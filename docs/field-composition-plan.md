# Plano — RTL, addons nos quatro lados e matriz de exemplos

> Leia [architecture.md](./architecture.md) §5.3, §7 e **§8 (RTL)** antes de executar.
> Pré-requisito: família `field` corrigida (a caixa é o `row`, spacing numérico,
> `[data-invalid]` aplicando palette danger).

## Objetivo

1. Corrigir dois bugs latentes encontrados na verificação.
2. Migrar o projeto para **propriedades lógicas** — RTL é objetivo do MVP.
3. Suportar addons **nos quatro lados**, não só nas laterais.
4. Cobrir a composition com uma matriz de exemplos reais, incluindo combinações.

**Fora de escopo:** `select` customizado e multi-select — próximo tópico.

---

## Fase 0 — Dois bugs encontrados na verificação

Ambos do mesmo tipo dos anteriores (`gap-xs`, `aria-invalid:palette-danger`): classe
copiada do shadcn que **não gera CSS nenhum** e falha em silêncio.

- [ ] **0.1 — Nenhuma animação de popup funciona.**

      `tw-animate-css` não está instalado. Verificado compilando: `animate-in`,
      `animate-out`, `fade-in-0`, `zoom-in-95` e `slide-in-from-*` **todas falham**. São
      ~14 classes mortas em `families/popup.ts` — dropdown, context-menu, select e
      combobox não animam nada hoje.

      ```bash
      pnpm add tw-animate-css
      ```
      e `@import "tw-animate-css";` em `global.css`, logo após o import do tailwindcss —
      mesmo pacote e mesma forma que o shadcn v4 usa.

      Depois de instalar, **recompilar e confirmar** que as ~14 classes geram CSS.

- [ ] **0.2 — Animação errada em RTL.**

      ```
      data-[side=inline-start]:slide-in-from-right-2
      ```
      `inline-start` é a **direita** em RTL, então o popup deslizaria do lado errado.
      Corrigir com o par `rtl:` (architecture.md §8.3):
      ```
      data-[side=inline-start]:slide-in-from-right-2
      rtl:data-[side=inline-start]:slide-in-from-left-2
      ```
      Idem para `inline-end`. As linhas `data-[side=left]` / `data-[side=right]` **não**
      precisam de par — `left`/`right` são físicos e já estão corretos nas duas direções.

---

## Fase 1 — Migração para propriedades lógicas

A varredura encontrou **10 ocorrências** em código — pequeno agora, caro depois.
Tabela de conversão completa em architecture.md §8.1.

- [ ] **1.1 — `families/menu.ts`:**

      | linha | de | para |
      |---|---|---|
      | 45 | `data-inset:pl-7` | `data-inset:ps-7` |
      | 56 | `pr-8 pl-1.5` | `pe-8 ps-1.5` |
      | 60 | `data-inset:pl-7` | `data-inset:ps-7` |
      | 71 | `ml-auto` | `ms-auto` |
      | 81 | `absolute right-2` | `absolute end-2` |

- [ ] **1.2 — `families/menu/parts.tsx:183`** — dois problemas na mesma linha:
      ```tsx
      <ChevronRightIcon className="ml-auto" />
      ```
      `ml-auto` → `ms-auto`, **e** o ícone aponta para o lado errado em RTL. Adicionar
      `rtl:rotate-180` — não trocar o ícone (§8.3).

- [ ] **1.3 — Varredura final.** Confirmar que não restou `pl-`/`pr-`/`ml-`/`mr-`/
      `border-l`/`border-r`/`rounded-l`/`rounded-r`/`left-`/`right-`/`text-left`/
      `text-right` em `src/components`.

      **Não trocar** `pt-`/`pb-`/`border-t`/`border-b`/`top-`/`bottom-`: o eixo block
      não inverte em RTL.

- [ ] **1.4 — Toggle LTR/RTL no playground**, ao lado dos toggles de tema e densidade
      (`<html dir="rtl">`). Sem isso não há como validar nada desta fase.

---

## Fase 2 — Addons nos quatro lados

### Por que não um nível extra, nem prop de orientação

A decisão e a evidência estão em architecture.md §8.4. Resumo: `flex-wrap` + `w-full` +
`order` mantém a estrutura plana e permite combinar os quatro lados — o que a abordagem
do shadcn (`:has()` + `flex-col`) não permite, e por isso nenhum dos 42 exemplos de
`InputGroup` deles mistura block com inline.

- [ ] **2.1 — `field.row` ganha `flex-wrap`** e **perde `min-h-control`.**

      ```
      flex w-full min-w-0 flex-wrap items-stretch overflow-hidden
      rounded-md border border-palette-line bg-palette-subtle
      text-sm text-palette-accent
      field-focus:outline-1 field-focus:outline-palette-solid
      group-data-[disabled]/field:cursor-not-allowed
      group-data-[disabled]/field:opacity-50
      ```

- [ ] **2.2 — `min-h-control` migra para `field.body`.**

      Semanticamente correto: a altura mínima é **da área do controle**, não da caixa.
      Com addon em cima, o `row` já é mais alto por causa do conteúdo.

      ```
      flex min-h-control min-w-0 flex-1 items-center gap-2 px-3
      ```

- [ ] **2.3 — `field.addon` com os quatro lados, em vocabulário lógico** (§8.2):

      ```
      flex shrink-0 items-center self-stretch px-3 text-sm text-palette-accent
      border-palette-line
      data-[side=inline-start]:border-e
      data-[side=inline-end]:border-s
      data-[side=block-start]:w-full data-[side=block-start]:order-first data-[side=block-start]:border-b
      data-[side=block-end]:w-full   data-[side=block-end]:order-last   data-[side=block-end]:border-t
      ```

      Eixo inline usa `border-s`/`border-e` (inverte em RTL); eixo block usa
      `border-b`/`border-t` (não inverte). O `overflow-hidden` do `row` continua cortando
      os cantos nos quatro lados — nenhum addon declara arredondamento.

- [ ] **2.4 — `Field.Addon` aceita os quatro valores de `side`.**
      Default: `inline-end`.

- [ ] **2.5 — Radius interno menor que o externo.**

      Detalhe pego do shadcn (`[&>kbd]:rounded-[calc(var(--radius)-5px)]`): elemento
      aninhado com radius menor parece encaixado em vez de sobreposto. Aplicar a `kbd` e
      botões dentro de addon/inset, derivando de `--radius-md`.

- [ ] **2.6 — Verificar compilando**, não por inspeção visual. Foi assim que `gap-xs`,
      `aria-invalid:palette-danger` e as animações passaram despercebidos.

---

## Fase 3 — Componentes de apoio

- [ ] **3.1 — `kbd`** — converter de `src/components/ui/kbd.tsx` (26 linhas) para o
      contrato de palette.
- [ ] **3.2 — `spinner`** — converter de `src/components/ui/spinner.tsx` (21 linhas).
- [ ] **3.3 — Ícones:** `lucide-react` (já instalado). **Nada de emoji** — o playground
      atual usa `🔍`, que não herda `currentColor` e não serve para validar cor.

Já disponíveis: `Clickable`, `DropdownMenu`, `Text`.

---

## Fase 4 — A distinção que o playground precisa provar

A primeira seção deve mostrar **inset e addon lado a lado**, com legenda:

- **`Field.Inset`** — dentro do padding do body, **sem divisor**. Ícone de busca, botão
  de olho na senha. Faz parte da área do controle.
- **`Field.Addon`** — irmão do body, **com divisor**. Prefixo "https://", botão anexo,
  dropdown de unidade. É uma região própria.

Essa é a distinção que o `InputGroup` do shadcn não faz e que gera a confusão. Se não
ficar óbvio de olhar, a arquitetura não está comunicada.

---

## Fase 5 — Matriz de exemplos

### 5.1 Ícones
- [ ] ícone no início (inset)
- [ ] ícone no fim (inset)
- [ ] ícone em ambos os lados (inset)
- [ ] **dois ícones no fim** (inset) — múltiplos irmãos sem divisor
- [ ] ícone no início como **addon** — contraste direto com o primeiro

### 5.2 Texto
- [ ] texto no início (`https://`)
- [ ] texto no fim (`Kg`)
- [ ] texto em ambos os lados (`R$` … `,00`)

### 5.3 Botões
- [ ] botão no fim
- [ ] botão no início
- [ ] botão em ambos os lados
- [ ] **dois botões no fim** — registrar se precisa de divisor **entre** eles

### 5.4 Outros
- [ ] `Kbd` no fim (`⌘K`)
- [ ] `Spinner` no fim
- [ ] `DropdownMenu` no fim (seletor de unidade/moeda)

### 5.5 Combinações
- [ ] texto no início + dropdown no fim
- [ ] botão + texto de um lado, dropdown do outro
- [ ] ícone (inset) + texto (addon) no mesmo lado — **convivência dos dois conceitos**,
      o caso mais provável de quebrar
- [ ] ícone no início (inset) + botão no fim (addon) + spinner (inset)

---

## Fase 6 — Exemplos compostos (eixo block)

- [ ] **6.1 — Mini editor de código.** `Field.Addon side="block-start"` com nome do
      arquivo à esquerda e botões (copiar, expandir) à direita; `Textarea` mono no body.

- [ ] **6.2 — Textarea com barra inferior.** `Field.Addon side="block-end"` com contador
      de caracteres e botão de submit. Testa se o `min-h-control` no body não trava o
      crescimento.

- [ ] **6.3 — block-start **e** block-end no mesmo campo** — testa `order-first` e
      `order-last` convivendo.

- [ ] **6.4 — Os quatro lados simultâneos** — block-start + inline-start + body +
      inline-end + block-end. **É o teste que o shadcn não passa.**

---

## Fase 7 — Validação

- [ ] **Compilar todas as classes** dos arquivos tocados; nenhuma pode deixar de gerar
      CSS.
- [ ] **RTL:** todos os exemplos com `dir="rtl"`. Confirmar que addons inline trocam de
      lado, addons block **não** trocam, e o chevron de submenu aponta para o lado certo.
- [ ] **Animações** de popup funcionando após a Fase 0.1, em LTR e RTL.
- [ ] Light + dark.
- [ ] `data-density="compact"` — registrar o que fica apertado demais.
- [ ] **Estado inválido com addon:** `[data-invalid]` tinge **a caixa inteira**, addons
      incluídos? É o teste real da herança de palette.
- [ ] **Disabled com addon:** o `group-data-[disabled]/field:` alcança os addons?
- [ ] **Foco com addon:** o outline envolve o campo **inteiro**, não só o body — é a
      razão de a borda ter ido para o `row`.
- [ ] **Teclado:** num campo com botão anexo, o Tab segue a ordem visual?
- [ ] `biome check` limpo; `tsc --noEmit` sem erros **novos** (há 6 pré-existentes de
      outro escopo: `DropdownMenu.Sub` e dois `Props` genéricos em select/combobox).

---

## Fase 8 — Relatório

`docs/field-composition-report.md`:

- [ ] Quantas classes de animação estavam mortas antes da Fase 0.1?
- [ ] **`flex-wrap` aguentou os quatro lados simultâneos** (6.4)?
- [ ] **RTL:** algo espelhou que não devia, ou deixou de espelhar?
- [ ] Dois addons adjacentes do mesmo lado precisaram de divisor entre eles?
- [ ] Inset + addon no mesmo lado (5.5) ficou coerente?
- [ ] Algum exemplo precisou de classe fora da família? Qual — é sinal de papel faltando.
- [ ] **Zero variantes se sustentou** na família `field`?
- [ ] Textarea com addon block-end cresce corretamente?
- [ ] Alguma classe deixou de compilar?

---

## Restrições para quem executar

1. **Propriedades lógicas sempre** no eixo inline (§8.1). Eixo block continua físico.
2. **Não adicionar nível de aninhamento** (`frame`) e **não criar prop de orientação**
   nem peças `Row`/`Column` separadas (§8.4).
3. **Zero variantes** na família. Lado é `data-side`, não variant.
4. **Não confundir inset com addon.** Inset não tem divisor; addon tem.
5. **Nada de emoji como ícone** — `lucide-react`, que herda `currentColor`.
6. **Verificar por compilação, não por leitura.** Classe inexistente falha em silêncio —
   já aconteceu três vezes neste projeto.
7. **Não usar `!important`.**
8. **Não mexer** no contrato de palette nem em `select`/`combobox` — próximo tópico.
