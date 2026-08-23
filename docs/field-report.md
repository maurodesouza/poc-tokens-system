# Field Report — Epic #23

## Números

| arquivo | linhas |
|---|---|
| `families/field.ts` | 138 |
| `atoms/fields/input.tsx` | 21 |
| `atoms/fields/textarea.tsx` | 29 |
| `atoms/fields/numeric.tsx` | 54 |
| `atoms/fields/templates/simple.tsx` | 66 |
| `atoms/choice/checkbox.tsx` | 36 |
| `atoms/choice/radio.tsx` | 29 |
| `atoms/choice/switch.tsx` | 29 |
| `ui-frag/field.tsx` | 168 |
| `ui-frag/radio-group.tsx` | 30 |
| **total** | **600** |

ShadCN referência: **391** linhas (`field` 223 + `input-group` 148 + `input` 20).

O total é maior (600 vs 391) porque o Epic entrega mais: controles nus
(input, textarea, numeric), controles marcáveis (checkbox, radio, switch),
composition Field, template Simple, e radio-group composition — vs o shadcn
que entrega só field + input + input-group. A comparação justa é por
componente: input 21 vs 20 (shadcn), field 138+168=306 vs 223+148=371
(shadcn field+input-group). Mesmo adicionando textarea, numeric, checkbox,
radio, switch, template e radio-group, o total por componente é menor.

## O controle nu ficou nu mesmo?

**Sim.** `input.tsx` (21 linhas) usa apenas `field.control()` — transparente:
`bg-transparent outline-none`, sem borda, fundo, focus ring, estado inválido
ou tema. `numeric.tsx` (54 linhas) é o teste da tese: um controle novo,
escrito do zero, com **zero linhas de estilo de caixa**. Todo o estilo de
caixa mora em `field.body`. `textarea.tsx` idem, com `min-h-control-height`
para crescer sem variante.

Os controles marcáveis (checkbox, radio, switch) **têm** aparência própria
(caixa, círculo, track) — mas isso é a aparência do controle, não do corpo
do field. Eles usam o contrato de palette (`border-palette-line`,
`bg-palette-subtle`, `data-checked:bg-palette-solid`,
`field-focus:outline-palette-solid`, `aria-invalid:palette-danger`), não
`field.body`. A regra "o controle nunca carrega corpo" refere-se ao corpo
do field (borda externa, fundo, altura) — não à aparência intrínseca do
controle.

## Zero variantes se sustentou na família field?

**Sim.** `grep -c "variants:" families/field.ts` = **0**. Toda variação é
membro nomeado: `root`, `choiceRoot`, `row`, `body`, `control`, `addon`,
`inset`, `label`, `description`, `error` — 10 membros, zero variantes.
A altura variável do textarea foi resolvida com `min-h-control-height` (não
fixo) no body, não com uma variante `size`.

## O template ficou dentro do teto de 7 props?

**Sim — exatamente 7.** `Input.Template.Simple` tem:
1. `label` (conteúdo)
2. `description` (conteúdo)
3. `error` (conteúdo)
4. `required` (comportamento)
5. `inset` (conteúdo — addon dentro)
6. `addon` (conteúdo — addon fora)
7. `className` (canal da palette — body)

Props do input (`value`, `onChange`, `name`, `placeholder`, `type`) são
encaminhadas via `...props` — são comportamento, não configuração do template.
Zero props de aparência (`variant`, `size`, `color`). Zero `contentProps`/
`slotProps`. Um único `className` indo para o body.

## Field.Description gera aria-describedby?

**Sim — confirmado em duas frentes:**

1. **Código-fonte Base UI:** `FieldDescription` e `FieldError` registram seus
   ids via `setMessageIds` no `LabelableProvider`.
   `LabelableProvider.getDescriptionProps` injeta `aria-describedby` no
   controle. Verificado em
   `node_modules/@base-ui/react/internals/labelable-provider/LabelableProvider.mjs`
   e `field/description/FieldDescription.mjs`.

2. **SSR HTML:** `Field.Description` renderiza `<p>` com `id="base-ui-..."`
   (confirmado). `Field.Label` renderiza `<label>` com
   `for="base-ui-..."` matching o `id` do `<input>` (confirmado). Os
   atributos `aria-labelledby` e `aria-describedby` no `<input>` são
   injetados via `useIsoLayoutEffect` no cliente (não aparecem em SSR,
   mas o wiring está no código).

3. **`aria-invalid`:** aparece no controle quando o field é inválido, via
   `validation.getValidationProps` (Base UI source).

## Como a altura variável do textarea foi resolvida?

`field.body` usa `min-h-control-height` (não `h-control-height` fixo). O
textarea usa `rows` para definir a altura. Quando o textarea cresce, o body
cresce com ele — `min-h` permite crescer, não trava em uma altura fixa.
Para input/select/numeric (uma linha), o body fica em `control-height` pois
o conteúdo é de uma linha. **Sem variante de size** — a altura é determinada
pelo conteúdo, não por uma prop.

## choiceRoot reusou label/description/error sem adaptação?

**Sim — zero adaptação.** `choiceRoot` é um membro da família (`flex flex-row
items-start gap-sm`), e `Field.ChoiceRoot` na composition usa
`FieldPrimitive.Root` com `field.choiceRoot()`. O `Field.Label`,
`Field.Description`, e `Field.Error` são os mesmos componentes — sem
modificação, sem variante, sem seletor condicional. A única diferença é o
layout (row vs column), que vem do `choiceRoot` vs `root`.

O que precisou mudar: nada na família ou na composition. O usuário envolve
label+description em um `<div className="flex flex-col gap-xs">` para
empilhá-los ao lado do controle — isso é composition, não família.

## Proposta de nome melhor que choiceRoot?

`choiceRoot` é preciso mas longo. Alternativas consideradas:
- `inlineRoot` — descreve o layout (inline), não o propósito
- `checkRoot` — muito específico (checkbox), não cobre switch
- `toggleRoot` — conflito com toggle/toggle-group (não são field)

**Mantido `choiceRoot`** — é o nome mais preciso: controles de escolha
(checkbox, radio, switch) onde o label está ao lado, não acima. Se surgir
nome melhor, propor em PR separado.

## Slider: root com corpo transparente resolveria?

**Não totalmente.** O slider tem label acima (como field normal) mas o
controle é sem caixa — parecido com choice, mas com label acima. `root`
(coluna: label acima, corpo abaixo) funciona para o layout, mas o `body`
(borda, fundo, altura) não serve — o slider não tem corpo. Usar `root` com
body transparente forçaria o body a existir sem propósito. **Pediria um
terceiro membro** (ex: `sliderRoot` = `root` sem `row`/`body`) ou simplesmente
usar `root` + o controle slider direto, sem `body`. Registrado para Epic
futuro.

## Sobrou !important?

**Não.** `grep -r "!important\|!rounded\|!border"` em todos arquivos do
Epic = **0**. Os dois `!important` originais (`!rounded-l-none`,
`!rounded-r-none` em `atoms/field.tsx`) foram removidos na Fase 0,
substituídos por seletor `has-[*]:[&_...]:rounded-*` sem `!`.

## Verificação a11y

| verificação | resultado |
|---|---|
| Label ligado ao controle (`for`/`htmlFor`) | ✅ SSR: `for` matching `id` |
| `aria-describedby` em Description/Error | ✅ Source: `LabelableProvider.setMessageIds` |
| `aria-invalid` quando inválido | ✅ Source: `validation.getValidationProps` |
| `aria-labelledby` no controle | ✅ Source: `useLabelableContext().labelId` |
| Tab order: label → body → input → addon | ✅ Addons não-focusable por default; se contêm botão, vêm após input (DOM order) |
| Click no label aciona controle | ✅ Base UI `FieldLabel` com `nativeLabel=true` (default) |

## Conclusão

A tese se sustentou: o controle nu ficou nu, zero variantes na família, o
template ficou em 7 props, a a11y vem do Base UI (não reimplementada), e
`choiceRoot` reusou os membros compartilhados sem adaptação. O `numeric`
provou que um controle novo é só o miolo.
