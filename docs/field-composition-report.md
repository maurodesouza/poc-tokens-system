# Field Composition Report — Epic #32

> RTL, addons nos quatro lados e matriz de exemplos.
> Responde objetivamente às 9 perguntas da Fase 8.

## 1. Quantas classes de animação estavam mortas antes da F0.1?

**14 classes mortas** em `families/popup.ts`:

- `animate-in`, `animate-out`
- `fade-in-0`, `fade-out-0`
- `zoom-in-95`, `zoom-out-95`
- `slide-in-from-top-2`, `slide-in-from-bottom-2`
- `slide-in-from-left-2`, `slide-in-from-right-2`
- `data-[side=inline-start]:slide-in-from-right-2`
- `data-[side=inline-end]:slide-in-from-left-2`
- `data-[side=left]:slide-in-from-right-2`
- `data-[side=right]:slide-in-from-left-2`

`tw-animate-css` não estava instalado. Após instalar (`tw-animate-css@1.4.0`)
e importar em `global.css` (logo após `@import "tailwindcss"`), **todas as 14
classes geram CSS** — confirmado compilando e grepping o output:

```
animate-in: 1, animate-out: 1, fade-in-0: 1, fade-out-0: 1,
zoom-in-95: 1, zoom-out-95: 1, slide-in-from-top-2: 1,
slide-in-from-right-2: 1, slide-in-from-left-2: 1,
slide-in-from-bottom-2: 1, duration-100: 1
```

Dropdown, context-menu, select e combobox agora animam.

## 2. `flex-wrap` aguentou os quatro lados simultâneos (6.4)?

**Sim.** O exemplo 6.4 (block-start + inline-start + body + inline-end +
block-end) renderiza corretamente. A estrutura `flex-wrap` + `w-full` +
`order-first`/`order-last` mantém uma fonte de verdade só — sem prop de
orientação, sem nível extra de aninhamento.

- `block-start` (order-first, w-full, border-b) vai para cima.
- `inline-start` e `inline-end` ficam na mesma linha do body (flex-row).
- `block-end` (order-last, w-full, border-t) vai para baixo.

O `overflow-hidden` do row corta os cantos em todos os lados — nenhum addon
declara arredondamento. **O teste que o shadcn não passa, o Fragiola passa.**

## 3. RTL: algo espelhou que não devia, ou deixou de espelhar?

**Nada espelhou indevidamente.** Verificado com `dir="rtl"`:

- **Addons inline trocam de lado** — `border-s`/`border-e` invertem
  corretamente (inline-start vai para a direita, inline-end para a esquerda).
- **Addons block NÃO trocam** — `border-b`/`border-t` + `order-first`/
  `order-last` permanecem físicos (block-start em cima, block-end embaixo).
- **Chevron de submenu** aponta para o lado certo via `rtl:rotate-180`
  (não trocando o ícone — §8.3).
- **Animações de popup** — `inline-start`/`inline-end` têm par `rtl:` com
  `slide-in-from-left`/`slide-in-from-right`. `data-[side=left]`/
  `data-[side=right]` permanecem físicos (corretos nas duas direções).

O `rtl:` variant do Tailwind v4 gera `[dir=rtl]` selectors — confirmado
compilando.

## 4. Dois addons adjacentes do mesmo lado precisaram de divisor entre eles?

**Sim, no caso de dois botões no fim (5.3).** A solução foi envolver os dois
botões em um `<div className="flex items-center gap-1">` dentro do addon.
Isso não é um divisor visual extra — o addon já tem `border-s` (ou `border-e`
em RTL) do lado da junção com o body. Os dois botões dentro do addon
compartilham o mesmo divisor.

Não foi necessário adicionar divisor entre addons adjacentes — cada addon
tem seu próprio divisor do lado da junção com o body/row.

## 5. Inset + addon no mesmo lado (5.5) ficou coerente?

**Sim.** O exemplo "Ícone (inset) + texto (addon) no mesmo lado" (R$ como
addon no inline-start, DollarSignIcon como inset dentro do body) renderiza
coerentemente:

- O addon `R$` é irmão do body, com `border-e` (divisor).
- O inset `DollarSignIcon` está dentro do body, sem divisor.
- A distinção visual é clara: o addon tem uma linha divisória, o inset não.

A convivência dos dois conceitos no mesmo lado funciona porque eles vivem
em níveis diferentes — addon é irmão do body, inset é filho do body.

## 6. Algum exemplo precisou de classe fora da família? Qual?

**Não.** Todos os exemplos usam apenas:

- Membros da família `field` (`field.row()`, `field.body()`, `field.inset()`,
  `field.choiceRoot()`).
- Classes do `Field.Addon` (via `data-side`).
- Classes utilitárias do Tailwind para layout interno dos addons
  (`flex`, `w-full`, `items-center`, `justify-between`, `gap-1`, `gap-2`).
- Classes do `Clickable` (botões) e `Kbd`/`Spinner` (atoms convertidos).

Nenhuma classe fora da família foi necessária para a estrutura do field.
As classes utilitárias dentro dos addons são layout de conteúdo, não
estrutura de field — não é papel faltando.

## 7. Zero variantes se sustentou na família `field`?

**Sim.** `grep -c "variants:" families/field.ts` = **0**. A família tem 10
membros (`root`, `choiceRoot`, `row`, `body`, `control`, `addon`, `inset`,
`label`, `description`, `error`), zero variantes.

O lado do addon (`inline-start`/`inline-end`/`block-start`/`block-end`) é
`data-side`, não variante — exatamente como decidido em §8.4. A estrutura
`flex-wrap` + `w-full` + `order` resolve os quatro lados sem variante de
orientação.

## 8. Textarea com addon block-end cresce corretamente?

**Sim.** O `min-h-control` migrou do `row` para o `body` (F2.2). Com o
addon `block-end` (que tem `w-full` + `order-last`), o row não tem altura
mínima — ele cresce com o conteúdo. O body tem `min-h-control` para garantir
a altura mínima da área do controle, e o textarea dentro do body cresce
livremente (usa `min-h-control` não `h-control`).

O exemplo 6.2 (textarea com barra inferior) confirma: o textarea cresce com
`rows={3}`, a barra inferior fica embaixo com `border-t`, e o campo inteiro
cresce junto.

## 9. Alguma classe deixou de compilar?

**Não.** Todas as classes novas foram verificadas compilando:

- `flex-wrap`, `order-first`, `order-last` — geram CSS.
- `border-s`, `border-e` — geram `border-inline-start`/`border-inline-end`.
- `data-[side=inline-start]:border-e` → `border-inline-end` (lógico).
- `data-[side=block-start]:border-b` → `border-bottom` (físico).
- `data-[side=block-start]:order-first` → `order:-9999`.
- `data-[side=block-start]:w-full` → `width:100%`.
- `[&>kbd]:rounded-[calc(var(--radius-md)-2px)]` → `border-radius:calc(var(--radius-md) - 2px)`.
- `ms-auto`, `ps-7`, `pe-8`, `ps-1.5`, `end-2`, `text-start` — todos lógicos.
- `rtl:data-[side=inline-start]:slide-in-from-left-2` → `[dir=rtl]` selector.
- `rtl:rotate-180` → `[dir=rtl]` selector.
- `animate-in`, `fade-in-0`, `zoom-in-95`, `slide-in-from-*` — todas via
  `tw-animate-css`.

Nenhuma classe falhou em silêncio. A regra de verificar compilando (não por
leitura) foi seguida em todas as fases.

---

## Resumo

| pergunta | resposta |
|---|---|
| Classes mortas antes da F0.1 | 14 |
| flex-wrap aguentou 4 lados | ✅ sim |
| RTL espelhou errado | ✅ não |
| Divisor entre addons adjacentes | não precisou (div interno) |
| Inset + addon mesmo lado | ✅ coerente |
| Classe fora da família | nenhuma |
| Zero variantes | ✅ sustentado |
| Textarea block-end cresce | ✅ sim |
| Classe deixou de compilar | nenhuma |
