# Fragiola — Arquitetura do Design System

> Documento de **decisões**. Registra o que foi decidido e *por quê*.
> Para os passos de execução, ver [implementation-plan.md](./implementation-plan.md).

---

## 1. Sistema de cores

### 1.1 O problema que estamos resolvendo

O sistema anterior usava uma rampa numérica (`--tone-100` … `--tone-500`) mais uma
classe adaptadora (`.tone`) que traduzia esses números em nomes de uso. Isso exigia
**duas classes** para aplicar uma cor:

```html
<div class="tone palette-brand">
```

Dois problemas:

1. **Os números não têm significado.** `tone-300` não diz que é o fill principal.
   Cada componente escolhia um passo diferente por conta própria, e a coerência
   se perdia.
2. **A segunda classe era o preço da rampa numérica.** `.tone` existia por uma
   razão técnica do CSS: custom property resolve `var()` no elemento onde é
   *declarada*, e o valor já computado é o que herda. Colocar
   `--tone-contrast-100: var(--tone-100)` no `:root` faria ele computar com o
   `--tone-100` do root, e trocar a palette num filho não teria efeito. Então a
   tradução precisava morar no mesmo elemento da fonte.

**Nomear por papel desde a fonte elimina a tradução, e a segunda classe deixa de
existir.**

### 1.2 O contrato: 5 papéis

Toda palette declara exatamente estes 5 tokens:

| token | papel | exemplo de uso |
|---|---|---|
| `--palette-subtle` | o fundo desta palette | fundo do alert, hover de ghost, chão da superfície |
| `--palette-line` | traço | borda, divisor, ring |
| `--palette-solid` | o fill de destaque | fundo do botão sólido, **focus ring** |
| `--palette-accent` | a cor como conteúdo | texto e ícone sobre fundo neutro ou sobre `subtle` |
| `--palette-contrast` | conteúdo sobre o `solid` | texto do botão sólido |

Os pares de uso são fixos e não exigem análise de contexto:

- `bg-palette-subtle` + `text-palette-accent` → badge soft, alert
- `bg-palette-solid` + `text-palette-contrast` → botão sólido
- `border-palette-line` → borda

**Por que 5 e não mais:** cinco cobre os cinco papéis que um componente realmente
pede. Radix usa 12 e documenta papéis; o shadcn usa 2 e duplica variants. Cinco é o
ponto onde cada token tem papel único e nenhum papel fica sem token.

**Por que não um sexto token "coringa":** um token sem papel definido é a rampa
numérica voltando com nome melhor. Em seis meses `support` significaria cinco coisas
diferentes, e a coerência que os nomes de papel compram desapareceria.

### 1.3 Borda vs focus ring

O sistema anterior tinha `ring-inner` / `ring-outer` (dois traços de intensidade
diferente). Foram colapsados:

- **borda / divisor** → `line`
- **focus ring** → `solid`

O focus ring precisa ser mais forte que a borda, e a cor certa para ele é a cor de
destaque da palette. É o que o shadcn faz na prática (`ring-ring` aponta para a cor
primária). Não precisa de token próprio.

> Nota: `ring-inner`/`ring-outer` no sistema antigo eram, apesar do nome, **bordas** —
> valores cinza claros usados em `border` e no thumb do scrollbar. O nome colidia com a
> semântica de `ring-*` do Tailwind (focus ring).

### 1.4 Superfície é uma palette como qualquer outra

Não existe categoria separada para "base" ou "superfície". `base-1` / `base-2` do
sistema antigo deixam de existir como conceito. No lugar:

- `palette-surface` — o chão do app
- `palette-raised` — superfície elevada (card, popover, dialog)

São palettes normais, com os mesmos 5 tokens. Numa palette de superfície, `subtle` é
o fundo daquele nível, `accent` é a cor de texto padrão dela, e `solid` é o inverso do
fundo (o preto do tooltip / botão default).

**Consequência importante:** elevação não é um eixo de token, é mais uma palette.
Precisou de um terceiro nível? Cria `palette-sunken`. Esse é o ponto da API: qualquer
necessidade nova é *mais uma palette*, não uma extensão do contrato.

**Ganho concreto:** o `default` acromático deixa de ser caso especial. No
`buttonVariants` antigo isso custava ~8 linhas de override `data-[tone=default]:*` e
um `!important` em quase toda classe — os `!` existiam só para arbitrar a briga de
especificidade entre a variant e o caso especial. Sem caso especial, não há briga:

```tsx
// ANTES — ~30 linhas, ! em quase tudo
solid: `bg-tone-luminosity-300! text-tone-foreground-contrast! hover:brightness-125
        data-[tone=default]:bg-background-support! data-[tone=default]:text-foreground!`

// DEPOIS — zero !, zero data-tone
solid: 'bg-palette-solid text-palette-contrast'
```

### 1.5 A classe `palette-*` NÃO pinta nada

**Decidido:** a classe declara apenas as 5 custom properties. Não aplica
`background-color` nem `color`.

```css
.palette-danger {
  --palette-subtle:   …;
  --palette-line:     …;
  --palette-solid:    …;
  --palette-accent:   …;
  --palette-contrast: …;
}
```

Quem pinta é sempre o componente, explicitamente:

```html
<div class="palette-raised bg-palette-subtle text-palette-accent">
```

**Motivo:** o caso `Text.Error` — ele usa `palette-danger` apenas para obter a *cor do
texto*. Se a classe pintasse background, o `Text.Error` ganharia fundo vermelho claro
sem pedir.

**Trade-offs aceitos:**

- ➖ Perde a herança automática de texto que o `base-1` dava. Cada átomo de texto
  precisa declarar `text-palette-accent`, e o `body` precisa de
  `bg-palette-subtle text-palette-accent` explícito.
- ➕ **Elimina um problema de cascade layer.** Se a classe pintasse, ela precisaria
  viver num layer abaixo de `utilities` — classe custom fora de layer vence qualquer
  layer independente de especificidade, então `.palette-danger { background-color }`
  derrotaria `bg-palette-solid` e o botão sólido nunca pintaria. Declarando só custom
  properties, não há competição: elas não colidem com utilities.
- ➕ Comportamento uniforme: toda palette faz exatamente a mesma coisa. Não existe
  "palette que pinta" e "palette que não pinta".

### 1.6 Estados (hover / active / disabled) são derivação, não token

Hover não é uma cor, é uma **transformação** — ajuste de lightness sobre o `solid`.

Se hover fosse um token, toda palette criada pelo usuário teria que preencher mais um
campo, e quem esquecesse entregaria hover quebrado. Como a tese da API é "o usuário
cria N palettes", **o contrato do usuário tem que continuar sendo 5**.

A derivação usa relative color syntax:

```css
oklch(from var(--palette-solid) calc(l + var(--palette-state-shift)) c h)
```

`--palette-state-shift` é **um token por tema**, não por palette (negativo no light —
escurece; positivo no dark — clareia).

**Escape hatch:** uma palette específica pode cravar o valor, e a derivação vira
fallback:

```css
--color-palette-solid-hover: var(
  --palette-solid-hover,
  oklch(from var(--palette-solid) calc(l + var(--palette-state-shift)) c h)
);
```

Default derivado e consistente; override explícito quando a derivação não servir.

### 1.7 Formato de cor: OKLCH, valor completo

Os tokens guardam a cor **completa** (`oklch(0.62 0.19 250)`), não componentes soltos
(`212 100% 47%` + `hsla(var(…))` como no sistema antigo).

**Motivos:**
1. Relative color syntax (§1.6) exige uma cor completa como entrada.
2. OKLCH é perceptualmente uniforme — ajustar lightness dá resultado previsível em
   qualquer matiz, o que HSL não garante.
3. Tailwind v4 gera opacidade via `color-mix`, então `bg-palette-solid/50` continua
   funcionando sem o truque do `hsl(var(--x) / 50%)`.

### 1.8 Tema light/dark: `[data-theme]` no root

```css
:root[data-theme="light"] .palette-brand { … }
:root[data-theme="dark"]  .palette-brand { … }
```

Atributo em vez de classe: mais direto de setar via JS
(`document.documentElement.dataset.theme`) e não colide com utilities do Tailwind.

---

## 2. Spacing

### 2.1 Escala numérica do Tailwind, sem camada semântica

Nomes t-shirt (`--spacing-xs`, `--spacing-md`, …) foram **abandonados**. Os valores do
sistema antigo eram literalmente `p-1` a `p-6` — seis aliases de indireção com zero
ganho semântico e mapeamento lossy (assim que precisar de um passo entre `sm` e `md`,
nasce `xxxs`).

Espaçamento é uma escala contínua sem semântica: `md` não diz nada que `4` não diga.
Isso é diferente de cor, onde `danger` carrega significado real.

**Valores quebrados** (3px, 7px, do design da empresa) usam arbitrary value: `p-[3px]`.
É local, explícito e grepável quando alguém abusa. Uma camada de nomes não resolveria
esse caso de qualquer forma — só moveria o problema para "qual nome tem o 3px".

### 2.2 Densidade trocável por subárvore

Verificado compilando o Tailwind deste projeto: a escala numérica inteira é `calc()`
sobre uma custom property, avaliada em runtime.

```css
.p-4   { padding: calc(var(--spacing) * 4); }
.gap-2 { gap:     calc(var(--spacing) * 2); }
```

Ou seja, redeclarar `--spacing` numa subárvore reescala tudo abaixo dela:

```css
[data-density="compact"] { --spacing: 0.2rem; }
```

Isso entrega o cenário "dashboard denso vs CRM normal" com **um token**, sem criar
camada semântica de spacing e funcionando com a escala que os 62 componentes já usam.

**Limitação conhecida:** `--spacing` também alimenta `w-*` e `size-*`, então densidade
reduzida encolhe larguras e ícones junto. Densidade real não é linear (você quer cortar
padding vertical mais que horizontal, e não quer cortar gap de layout de página).
**Isso é ponto de validação do pilot**, não motivo para construir camada semântica
antecipadamente.

---

## 3. Breakpoints

Ficam como **configuração global**. Não podem seguir a API de palette por
impossibilidade técnica, não por escolha: palette funciona porque custom property é
herdável por subárvore; breakpoint não é um valor, é uma condição de media query
avaliada contra a viewport.

**Pendência conhecida (revisar depois do pilot):** os nomes atuais são de dispositivo
(`mobile`, `tablet`, `laptop`, `desktop`) e são min-width. Nome de dispositivo em
min-width mente — `tablet:flex` também dispara no desktop, mas o nome sugere
exclusividade. Além disso `mobile: 28.125rem` = 450px é *maior* que a largura da maioria
dos celulares, então `mobile:` na prática significa "não-celular-pequeno".

---

## 4. Radius e tipografia

Mantidos como estão. Radius em `sm/md/lg` é a escolha certa — radius não é escala
contínua, são poucos degraus discretos com identidade visual.

**Pendência conhecida (vai aparecer no pilot):** a escala de texto atual é
`xs=12, sm=16, md=20, lg=28, xl=40`. Não existe **14px**, que é o tamanho usado pela
maioria dos 62 componentes (menu item, badge, célula de tabela). Também não há
line-heights definidos (`--text-*--line-height`). Não é problema de nomenclatura —
decide-se na calibragem, olhando o resultado.

---

## 5. Composição de componentes

### 5.1 O problema

Medido nos 62 componentes: **17 classes distintas** de title/description/label/header
(`cn-dialog-description`, `cn-popover-title`, `cn-card-description`, `cn-select-label`,
`cn-context-menu-label`, `cn-dropdown-menu-label`, `cn-menubar-label`, …).

Não existe primitivo de texto. Cada componente redefine a própria tipografia numa
classe CSS. Mudar a aparência de "title" exige editar N lugares.

### 5.2 O mecanismo já existe: `render` do Base UI

O close button do dialog **já aponta para o primitivo**:

```tsx
<DialogPrimitive.Close render={<Button variant="ghost" size="icon-sm" />}>
```

Mas apenas **3 dos 62 arquivos** usam `render={<Button`, e nenhum usa para texto. A
ferramenta existe; o shadcn só não aplicou com disciplina.

### 5.3 A regra: separar comportamento de aparência

`DialogPrimitive.Title` não pode ser simplesmente substituído por `Text.Heading` — ele
é obrigatório para acessibilidade (é ele que liga o `aria-labelledby` do popup). A
solução não é substituir, é **separar as duas camadas e costurá-las com `render`**:

```tsx
const DialogTitle = (props) => (
  <DialogPrimitive.Title render={<Text.Heading as="h2" />} {...props} />
)
```

- **Comportamento / a11y** → vem do Base UI, não negociável
- **Aparência** → vem do átomo do Fragiola
- **`render`** → costura as duas

O shadcn funde as duas numa classe CSS, e é exatamente por isso que duplica.

Essa mesma regra resolve os **dois** problemas do projeto: a duplicação vertical
(dialog recria title) e a horizontal (`context-menu` ≡ `dropdown-menu`) são o mesmo
erro em eixos diferentes.

### 5.4 Um mecanismo de polimorfismo só: `render`

Hoje há dois mecanismos concorrendo: `asChild` (nos átomos) e `render` (Base UI).

**Decidido: `render`.** É o que os 62 componentes já falam e é o que torna a
composição de §5.3 possível.

> Nota: o `asChild` atual do `Clickable.Button` **não funciona**. `twx.button` renderiza
> um `<button>` literal e não implementa Slot, então `<Button asChild><a/></Button>`
> produz `<button asChild><a/></button>`, com `asChild` vazando como atributo DOM.

### 5.5 Namespace de composição

O padrão `Clickable.Button` / `Clickable.Link` / `Clickable.ExternalLink` (em vez de
`Button` solto) é mantido: as três variações compartilham o mesmo `buttonVariants` e
`Link` **usa** `Button` em vez de recriar o estilo. Mesma coisa em `Text`, onde
`Text.Error` deriva de `Text.Highlight`.

---

## 6. Pontos a confirmar

Itens derivados por inferência durante o desenho. Confirmar antes ou durante o pilot:

1. **`subtle` como "o chão" nas palettes de superfície.** O sistema antigo tinha dois
   fundos por base (`background-base` + `background-support`). Com elevação virando
   palette, a leitura adotada é: cada palette de superfície tem **um** fundo (`subtle`),
   e o segundo nível é outra palette (`palette-raised`). Confirmar que é isso.
2. **Foreground secundário.** Ficou **fora** do contrato por decisão explícita (os
   `foreground-min`/`max` do sistema antigo nunca foram usados na prática). Mas
   `cn-dialog-description` usa `text-muted-foreground` — sem nível secundário, título e
   descrição do dialog ficam com a mesma cor. **Vai aparecer no pilot.** Decidir olhando
   o resultado, não antes.

---

## 7. Famílias de estilo (duplicação entre componentes)

### 7.1 O problema, medido

`src/styles/style-nova.css` tem **422 classes `cn-*`**. Componentes que compartilham
o mesmo esqueleto visual têm o estilo colado, não compartilhado:

| grupo | classes | similaridade |
|---|---|---|
| `*-item` (context-menu, dropdown-menu, menubar, select, combobox, command) | 6 | ~85% |
| `*-content` (dropdown-menu, context-menu, menubar, popover) | 4 | ~95% |
| campo (input, textarea, select-trigger) | 3 | bloco de 12 declarações idêntico |

Nos 4 componentes-alvo do pilot (dropdown-menu, context-menu, select, combobox):
**67 classes `cn-*` distintas, 1109 linhas de TSX.**

### 7.2 As diferenças entre irmãos são de três tipos

Comparando linha a linha, e **só um dos três é legítimo**:

**Tipo 1 — drift acidental.** Ninguém decidiu; aconteceu porque está duplicado.
- `min-w-32` (dropdown) vs `min-w-36` (context, menubar)
- `gap-1.5` (menu) vs `gap-2` (combobox)
- `rounded-md` (menu) vs `rounded-sm` (command)
- `data-disabled:opacity-50` existe **só** no menubar
- `.cn-menubar-content` não tem `data-closed:animate-out` — os irmãos têm.
  **O menubar não anima ao fechar.** É bug, não decisão.

**Tipo 2 — diferença estrutural real.** `select-item` usa `pr-8` para caber o
indicador de check à direita; `menu-item` usa `px-1.5`. Intencional.

**Tipo 3 — vocabulário de estado imposto pela lib.**
```
dropdown / context / menubar / select  →  :focus
combobox                               →  [data-highlighted]
command (cmdk)                         →  [data-selected]
```
Os três significam **"o item em destaque"**. São diferentes porque cada primitivo
expõe o estado do seu jeito — não é decisão de design.

Uma boa arquitetura precisa **eliminar** o tipo 1, **expressar** o tipo 2 e
**normalizar** o tipo 3.

### 7.3 Normalização de estado: `@custom-variant`, não React

O tipo 3 é o bloqueio real: enquanto três seletores diferentes significarem a mesma
coisa, o estilo compartilhado não pode ser escrito uma vez.

**Decidido: normalizar em CSS**, com uma custom variant do Tailwind v4:

```css
@custom-variant highlighted (&:is(:focus, [data-highlighted], [data-selected]));
```

Compila para:
```css
.highlighted\:bg-palette-subtle:is(:focus, [data-highlighted], [data-selected]) { … }
```

A família escreve `highlighted:bg-palette-subtle` **uma vez** e funciona nos três
vocabulários.

> **Alternativa descartada:** normalizar na camada React (cada componente traduz o
> estado da lib para um `data-*` comum via `onFocus`/`onBlur` + state). Funciona, mas
> custa uma indireção e re-renders por componente. A variant CSS resolve o mesmo
> problema com uma linha, sem tocar em nenhum componente.

**Extensibilidade:** uma lib nova com vocabulário próprio (`aria-selected`, etc.)
entra adicionando um seletor **num lugar só**.

### 7.4 Vocabulário de estado

⚠️ **`data-active` NÃO pode ser usado para "item em destaque".** Ele já existe no
style-nova com significado diferente — *item atual / selecionado* (link ativo da
sidebar, tab atual, navigation-menu). São 10 usos com essa semântica. Reaproveitar o
nome causaria colisão.

Vocabulário final:

| estado | atributo | significado | situação |
|---|---|---|---|
| destacado | `highlighted` (variant) | item sob cursor/teclado | **normalizar** (§7.3) |
| marcado | `data-checked` | checkbox / radio item | já uniforme (23 usos) |
| atual | `data-active` | link ativo, tab atual | já uniforme — **não tocar** |
| aberto | `data-open` | popup aberto | já uniforme (60 usos) |
| desabilitado | `data-disabled` | — | já uniforme |

### 7.5 As famílias são ortogonais, não hierárquicas

| família | esqueleto | quem usa |
|---|---|---|
| `popup` | caixa flutuante (content, positioner, arrow) | dropdown, context, menubar, select, combobox, popover |
| `menu` | lista de opções (item, label, separator, group, shortcut, sub-trigger, checkbox-item, radio-item, item-indicator) | dropdown, context, menubar, select, combobox, command, sidebar |
| `field` | controle de entrada | input, textarea, select-trigger, combobox-input |
| `layer` | backdrop + painel modal | dialog, alert-dialog, sheet, drawer |

Nomeadas pelo **esqueleto visual**, não pela semântica do componente — porque é isso
que a família é. O vocabulário segue o do Base UI (`Popup`, `Trigger`, `Item`,
`Backdrop`) para não criar uma segunda tradução mental.

**São combináveis, não uma taxonomia:**
- `popover` = `popup`
- `dropdown-menu` = `popup` + `menu`
- `select` = `field` + `popup` + `menu`
- `command` = `layer` + `menu`

Um componente novo é uma **recombinação**, não um arquivo do zero. É essa
ortogonalidade que dá a extensibilidade.

### 7.6 Famílias são `tv()` compartilhado, não classe CSS

**Decidido: `tv({ extend })` em TypeScript.**

```ts
// families/menu.ts
export const menuItem = tv({
  base: "flex items-center gap-2 rounded-md py-1 text-sm highlighted:bg-palette-subtle …",
  variants: {
    indicator: {
      none:  "px-1.5",
      trail: "pr-8 pl-1.5",   // select/combobox: espaço pro check
    },
  },
})

// select.tsx
const selectItem = tv({ extend: menuItem, defaultVariants: { indicator: "trail" } })
```

**Por que não classe CSS:** com `.cn-select-item` sobrescrevendo `.cn-menu-item`, o
`pr-8` vira uma sobrescrita silenciosa — quem lê não sabe se é intenção ou drift. Com
`tv()`, a diferença do tipo 2 vira uma **variant nomeada** (`indicator: "trail"`) que
se documenta sozinha, e o drift do tipo 1 fica impossível por construção: só existe o
que foi declarado.

Outros motivos: type-safe, `extend` existe exatamente para este caso, e os átomos já
usam `tailwind-variants` — não introduz mecanismo novo.

**Trade-off aceito:** classe CSS seria mais fácil de sobrescrever "de fora". Mas o
Fragiola é copy-paste (registry), então o usuário edita o arquivo da família
diretamente — o que é melhor, não pior.

**Consequência para o CLI (depois):** instalar `dropdown-menu` precisa trazer junto as
famílias `popup` e `menu`. É `registryDependencies`, mecanismo que o shadcn já tem.

### 7.7 Parte da duplicação já morreu com a palette

Nem tudo que parecia duplicação de *estrutura* era: parte era duplicação de *cor*.

```
/* repetido em input, textarea e select-trigger */
aria-invalid:ring-destructive/20   dark:aria-invalid:ring-destructive/40
aria-invalid:border-destructive    dark:aria-invalid:border-destructive/50
```

Com o contrato de palette isso é **`aria-invalid:palette-danger`** — uma classe, sem
variante de tema. O mesmo vale para `dark:bg-input/30` e
`bg-popover text-popover-foreground`.
