# Plano de Implementação — Família `field` e Templates

> Leia [architecture.md](./architecture.md) §5.3 (comportamento vs aparência) e §7
> (famílias) antes de executar.

## Objetivo

Resolver a ambiguidade de campos do shadcn — hoje há **três** formas de escrever um
campo e **dois** inputs diferentes — estabelecendo que **só existe um jeito**.

```
<Input />                                          // input.tsx, tem borda própria
<Field><FieldLabel/><Input/></Field>               // field.tsx, 223 linhas, 10 exports
<InputGroup><InputGroupInput/><InputGroupAddon/>   // input-group.tsx, 148 linhas, 6 exports
```

**Causa-raiz:** o `Input` carrega o próprio corpo (borda, fundo, altura). Dentro de um
grupo isso daria borda dupla, então foi preciso inventar um segundo input sem borda.

**Regra do Fragiola:** *o controle nunca carrega corpo*. O corpo é sempre a peça
`field.body`. Por isso só precisa existir um input.

**Consequência que faz a arquitetura valer:** criar um controle novo (multi-select,
color picker, numeric) passa a ser escrever **só o miolo** — sem borda, sem fundo, sem
focus ring, sem estado inválido, sem tema. Tudo isso mora no corpo.

---

## Fase 0 — Decisões e preparação

- [ ] **0.1 — Usar o `Field` primitivo do Base UI.**

      `@base-ui/react/field` expõe `Root`, `Label`, `Control`, `Description`, `Error`,
      `Validity`, `Item`. Ele já resolve o que `div` não resolve:
      - ligação `controlId` ↔ `labelId` e `aria-labelledby`
      - `aria-invalid`
      - `Root` aceita `validate`, `validationMode`, `invalid`, `disabled`, `name`
      - `Error` aceita `match` para erro condicional

      **Nem o shadcn nem o código de referência fazem esse wiring** — ambos usam `div`
      pura, e `description`/`error` ficam sem `aria-describedby`. Isso é bug de
      acessibilidade, e é exatamente o tipo de coisa que a §5.3 manda delegar à lib.

      **Regra:** comportamento e a11y do Base UI; aparência do Fragiola; `render` costura.
      Nada de reimplementar wiring em `div`.

      > Verificar durante a implementação se `Field.Description` gera `aria-describedby`.
      > A inspeção encontrou `labelId`/`controlId` e `aria-labelledby`, mas não confirmou
      > `describedby`. **Se não gerar, registrar no relatório** — não contornar em silêncio.

- [ ] **0.2 — Custom variant de foco.**

      A regra de foco aparece **três vezes** em `atoms/field.tsx:22-24` e de novo em
      `addons/container.tsx:20-22`. E `focus:` é **redundante** com `focus-within:` —
      `:focus-within` já casa com o próprio elemento quando ele está focado.

      Registrar em `global.css`, no mesmo padrão do `highlighted`:
      ```css
      @custom-variant field-focus (&:is(:focus-within), &:is(.group\/field:focus *));
      ```
      Ajustar o seletor conforme o que o `group/field` realmente precisa. Objetivo: **uma
      regra escrita uma vez**.

- [ ] **0.3 — Novo lar para `h-control-height`.**

      Era `--spacing-control-height`, removido por estar no namespace de spacing (gerava
      `p-control-height`, `gap-control-height`). Definir fora do `@theme` como token
      próprio, ou usar altura derivada de padding + line-height. Registrar a escolha.

- [ ] **0.4 — Eliminar os dois `!important`.**

      `atoms/field.tsx:11-12` usa `!rounded-l-none` / `!rounded-r-none` para o corpo
      perder o arredondamento do lado onde há addon. É guerra de especificidade. Resolver
      com ordem de cascade ou seletor mais específico — **não com `!`**.

---

## Fase 1 — Família `field`

Criar `src/components/families/field.ts`, seguindo o padrão de `menu.ts` e `popup.ts`:
namespace object, **zero variantes** (architecture.md §7.6 e o critério do Epic anterior).

- [ ] **1.1 — Membros:**

      | membro | papel |
      |---|---|
      | `root` | coluna vertical: label, corpo, description, error |
      | `label` | — aponta para `Text.Label` |
      | `row` | linha horizontal: corpo + addons anexados |
      | `body` | **a caixa** — borda, fundo, altura, padding, focus ring |
      | `control` | o miolo nu (transparente, sem borda) |
      | `addon` | bloco anexado com borda própria, colado ao corpo |
      | `description` | — aponta para `Text` |
      | `error` | — aponta para `Text.Error` |

- [ ] **1.2 — Conversão de cor para o contrato de palette.**

      | antes | depois |
      |---|---|
      | `full-border` / `border-ring-inner` | `border border-palette-line` |
      | `bg-background-base` | `bg-palette-subtle` |
      | `text-foreground` | `text-palette-accent` |
      | `ring-ring-outer` (focus) | `outline-palette-solid` |
      | `placeholder:text-foreground-min` | `placeholder:text-palette-accent` + opacidade |
      | `selection:bg-tone-luminosity-300` | `selection:bg-palette-solid` |
      | `selection:text-tone-foreground-contrast` | `selection:text-palette-contrast` |

      **Estado inválido:** `aria-invalid:palette-danger` no `body` — uma classe substitui
      as 6 declarações com variante de tema do shadcn (architecture.md §7.7).

- [ ] **1.3 — Addon "dentro" vs "fora".**

      São **dois conceitos distintos** e precisam de nomes distintos:
      - **dentro** — ícone de busca, botão de olho na senha. É filho direto do `body`,
        sem borda, dentro do padding.
      - **fora** (`addon`) — bloco anexado com borda própria e cantos arredondados só do
        lado externo. É irmão do `body`, dentro do `row`.

      Sem nomes separados isso vira exatamente a confusão do `InputGroup`. Nomear os dois
      explicitamente e documentar quando usar cada um.

---

## Fase 2 — Controles nus

Criar `src/components/atoms/fields/`. **Nenhum controle tem borda, fundo ou focus ring.**

- [ ] **2.1 — `input`** — texto. O `inputVariants.tone` de 5 valores do código de
      referência **some inteiro**: cor agora vem da palette do `body` via `className`. De
      ~48 linhas para ~15.
- [ ] **2.2 — `textarea`** — **testa a altura variável.** O `row` tem altura fixa
      (`h-control-height`). Registrar como foi resolvido.
- [ ] **2.3 — `select`** — reusar o `select.tsx` já convertido em `ui-frag/`; o trigger
      passa a ser um `body`, não um controle com borda própria.
- [ ] **2.4 — `numeric`** — controle novo, escrito do zero. **É o teste da tese:** deve
      ser só o miolo, sem uma linha de estilo de caixa. Se precisar de mais que isso, a
      arquitetura falhou — registrar.

---

## Fase 3 — Composition

- [ ] **3.1 — `Field` namespace object**, no padrão do Epic anterior:
      ```tsx
      export const Field = { Root, Label, Row, Body, Control, Addon, Description, Error }
      ```
      Cada peça costura primitivo do Base UI + estilo da família via `render`.

- [ ] **3.2 — Label, Description e Error apontam para `Text`.**
      `Field.Label` → `Text.Label`, `Field.Description` → `Text` (parágrafo pequeno),
      `Field.Error` → `Text.Error`. **Nenhum deles redefine tipografia própria** — é a
      mesma regra que aplicamos no `DialogTitle` (architecture.md §5.3).

---

## Fase 4 — Templates

- [ ] **4.1 — Nome:** `Template`. Acesso em três níveis: `Input.Template.Simple`.
      Um template por componente hoje, namespace preparado para mais.

- [ ] **4.2 — As três regras** (não negociáveis):

      1. **Zero estilo próprio.** Nenhuma classe, nenhum `tv()`, nenhum `className`
         hardcoded. Se precisa de CSS, não é template — é peça da família.
      2. **Zero props de aparência.** Nada de `variant`, `size`, `color`,
         `contentClassName`, `slotProps`. Props de **comportamento** (`side`, `delay`,
         `validationMode`) e de **conteúdo** (`label`, `error`, `items`) são livres.
      3. **Um `className` único**, indo para a peça principal. É o canal da palette —
         `className="palette-danger"` usa o sistema de tokens, não o reimplementa.

      **Proibido explicitamente:** `contentProps` / `slotProps` / `*Props` genéricos. Eles
      abrem uma porta por onde passa qualquer coisa, inclusive `className` e `style`, e
      aí não há mais o que fiscalizar. Props conhecidas vão **achatadas e nomeadas**.

- [ ] **4.3 — Teto de 7 props.** Se um template passar disso, ele não é mais template:
      vira outro template, ou aquele caso desce para composition. **Não adicionar a
      oitava prop — parar e registrar.**

- [ ] **4.4 — `Input.Template.Simple`.** É o caso que mais aperta: `label`,
      `description`, `error`, `required`, addon dentro, addon fora — todas legítimas pela
      regra 2. Se a API sobrevive aqui com teto de 7, sobrevive em qualquer componente.

---

## Fase 5 — Controles marcáveis (checkbox, radio, switch)

**Decidido: container próprio.** Esses três não têm corpo com borda, e o label fica **à
direita** do controle, não acima. A estrutura `root > row > body` não serve.

### Por que container próprio e não uma variante de orientação

O shadcn resolve com uma variante `orientation` no `Field`, e o custo aparece no seletor:

```
horizontal: "flex-row items-center has-[>[data-slot=field-content]]:items-start
  *:data-[slot=field-label]:flex-auto
  has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px"
```

Um seletor condicional que testa `role=checkbox` de dentro de um container genérico — o
sintoma clássico de forçar duas estruturas no mesmo molde. Container próprio elimina isso.

### São exatamente três — e por quê

Auditado nos 62 componentes:

| componente | veredito |
|---|---|
| `checkbox`, `radio-group`, `switch` | **entram** — controle + label ao lado, sem corpo |
| `toggle`, `toggle-group` | **não são field** — botão que fica pressionado; o próprio conteúdo é o label. Pertencem a `Clickable` |
| `slider` | **quarto formato** — label acima (como field), mas controle sem caixa. Ver 5.3 |

- [ ] **5.1 — Membro da mesma família, não família separada.**

      Os três compartilham `label`, `description`, `error` e os estados (disabled,
      invalid) com o field normal. Só diferem no layout e na ausência de corpo. Então:

      ```ts
      export const field = {
        root,        // coluna: label acima, corpo abaixo
        choiceRoot,  // linha: controle à esquerda, label à direita
        label, description, error,   // compartilhados
        row, body, control, addon,   // só o field normal usa
      }
      ```

      Reusa tudo que é comum; troca só o root. **Nome `choiceRoot` em aberto** — se
      surgir melhor durante a implementação, propor no relatório, não trocar por conta
      própria.

- [ ] **5.2 — Estrutura do `choiceRoot`.**

      - controle e label na mesma linha, alinhados pelo topo (label pode quebrar em 2 linhas)
      - `description` alinhada com o label, não com o controle
      - clicar no label aciona o controle — vem do `Field.Label` do Base UI, **não
        reimplementar**
      - área de clique adequada para touch
      - **Zero variantes** — vale a mesma regra da Fase 1

- [ ] **5.3 — `slider` fica fora deste Epic.** É um quarto formato (label acima, controle
      sem caixa) e não cabe nem em `root` nem em `choiceRoot`. **Não implementar** —
      apenas registrar no relatório se `root` funcionaria com o corpo transparente ou se
      pede um terceiro membro.

## Fase 6 — Playground e relatório

- [ ] **6.1 — Playground:** input, textarea, select e numeric, cada um com/sem label,
      description, error, required, addon dentro, addon fora. Composition e template lado
      a lado. Light + dark + `data-density="compact"`.

- [ ] **6.2 — Verificar a11y de verdade**, não por inspeção visual:
      - o label está ligado ao controle?
      - `description` e `error` chegam via `aria-describedby`?
      - `aria-invalid` aparece quando inválido?
      - navegação por teclado passa pelos addons na ordem certa?

- [ ] **6.3 — `docs/field-report.md`**, no formato dos relatórios anteriores:
      - **Números:** linhas totais vs os 391 do shadcn (`field` 223 + `input-group` 148 +
        `input` 20).
      - **O controle nu ficou nu mesmo?** O `numeric` precisou de estilo de caixa?
      - **Zero variantes se sustentou** na família `field`?
      - **O template ficou dentro do teto de 7 props?** Quantas ficaram?
      - **`Field.Description` gera `aria-describedby`?** (Fase 0.1)
      - **Como a altura variável do textarea foi resolvida?**
      - **`choiceRoot` reusou label/description/error** sem adaptação? O que precisou mudar?
      - **Proposta de nome** melhor que `choiceRoot`, se houver.
      - **`slider`:** `root` com corpo transparente resolveria, ou pede membro próprio? (Fase 5.3)
      - **Sobrou `!important`?**

---

## Restrições para quem executar

1. **O controle nunca carrega corpo.** Se um controle precisar de borda ou fundo
   próprios, parar e registrar — é sinal de que a arquitetura falhou.
2. **Comportamento e a11y vêm do Base UI Field**, não de `div` com `useId` na mão.
3. **Zero variantes** na família `field`. Variação vira membro nomeado.
4. **Templates: as três regras da Fase 4.2**, sem exceção. Sem `contentProps`.
5. **Não usar `!important`** — inclusive removendo os dois existentes.
6. **Implementar checkbox/radio/switch** via `choiceRoot` (Fase 5). **Não implementar
   `slider`, `toggle` nem `toggle-group`** — os dois últimos não são field.
7. **Não mexer** no contrato de palette, na variant `highlighted`, nem nas famílias
   `menu`/`popup`.
