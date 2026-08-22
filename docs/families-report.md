# Relatório das Famílias — Observações da Validação

> Resultado da Fase 5 (#14). Respostas objetivas às perguntas de
> `docs/families-plan.md`. Cada pergunta é respondida abaixo.

---

## 1. Números antes/depois

| métrica | antes | depois | delta |
|---|---|---|---|
| classes `cn-*` distintas nos 4 componentes | 60 | 0 | -60 (100%) |
| linhas de TSX nos 4 componentes | 1109 | 1041 | -68 (-6%) |
| classes `cn-*` em `style-nova.css` | 422 | 368 | -54 |
| linhas em `style-nova.css` | 1748 | 1533 | -215 |
| linhas nas famílias (`popup.ts` + `menu.ts`) | 0 | 137 | +137 |

A eliminação de `cn-*` nos 4 componentes é total. A redução de linhas de
TSX é modesta (-6%) porque os componentes mantêm sua estrutura de props,
data-slots e composição — o que mudou é a origem do estilo (família em vez
de string inline). As 137 linhas das famílias são o **estilo compartilhado**
que antes estava duplicado em ~60 classes `cn-*` × 4 componentes.

O `style-nova.css` perdeu 54 blocos órfãos (classes cujos únicos
consumidores eram os 4 componentes convertidos). As 368 classes restantes
pertencem aos outros ~58 componentes ainda não convertidos.

---

## 2. `context-menu` ficou com zero estilo próprio?

**Quase.** Sobraram duas classes exclusivas, ambas **estruturais** (não
visuais):

1. `"isolate z-50 outline-none"` no `Positioner` — `z-50` é stacking
   context (não cor/typography), `isolate` cria contexto de empilhamento,
   `outline-none` é a11y (evita outline no container, não no item). Nenhuma
   dessas pertence à família `popup` — são propriedades do **positioner**
   (o wrapper que posiciona o popup), não do **content** (a caixa visível).

2. `"z-50 outline-none"` no `Popup` — mesmas razões. O `z-50` aqui garante
   que o popup fique acima do trigger; `outline-none` evita outline no
   container.

Nenhuma classe de **cor, tipografia, espaçamento, borda ou sombra** é
exclusiva do `context-menu`. Todas vêm das famílias. O `ChevronRightIcon`
usa `ml-auto` (layout utility), não estilo visual.

**Veredito:** o objetivo foi atingido. As classes residuais são
estruturais/comportamentais, não de estilo — e são comuns a todos os
popups (dropdown, select, combobox também as têm), candidatas a uma
futura família `positioner`.

---

## 3. A normalização funcionou?

**Sim.** O `combobox` precisou de **zero** regras `data-highlighted`
próprias. A variant `@custom-variant highlighted` (registrada em
`global.css` na Fase 0) cobre `:focus`, `[data-highlighted]` e
`[data-selected]` automaticamente via a família `menuItem`.

```
/* global.css */
@custom-variant highlighted (&:focus, &[data-highlighted], &[data-selected]);
```

O `ComboboxItem` consome `menuItem({ indicator: "trail" })` e a base da
família já contém `highlighted:bg-palette-subtle highlighted:text-palette-accent`.
Quando o Base UI marca o item com `data-highlighted` (navegação por teclado
ou hover), a variant dispara e o item destaca — sem nenhuma regra
adicional no componente.

As 2 ocorrências de `data-highlighted` no `combobox.tsx` são **comentários**
documentando este fato, não regras CSS.

---

## 4. As variants foram suficientes?

**Sim, com 1 override comportamental.**

| componente | variants usadas | overrides fora da família |
|---|---|---|
| `dropdown-menu` | `popupContent`, `menuItem({ tone })`, `menuCheckboxItem`, `menuRadioItem`, `menuSubTrigger`, `menuLabel`, `menuSeparator`, `menuShortcut`, `menuItemIndicator` | nenhuma |
| `context-menu` | mesmas + `popupContent` | nenhuma |
| `select` | `popupContent({ padding: "none" })`, `menuItem({ indicator: "trail" })`, `menuLabel`, `menuSeparator`, `menuItemIndicator` | `menuSeparator()` + `"pointer-events-none"` |
| `combobox` | `popupContent`, `menuItem({ indicator: "trail" })`, `menuLabel`, `menuSeparator`, `menuItemIndicator` | nenhuma |

O único override é `select.tsx` adicionando `pointer-events-none` ao
separator — uma propriedade **comportamental** (evita que o separator
intercepte cliques), não visual. O `SelectSeparator` original já tinha
essa classe; a família `menuSeparator` não a inclui porque nos outros
menus o separator já não intercepta (o primitivo `Menu.Separator` do
Base UI tem `pointer-events: none` por padrão, mas `Select.Separator`
não).

**Nenhum componente precisou de override de cor, tipografia, espaçamento,
borda ou sombra fora do vocabulário de variants da família.**

---

## 5. Casos de drift encontrados e valores escolhidos

| drift | componentes afetados | valor escolhido | justificativa |
|---|---|---|---|
| `min-w-32` vs `min-w-36` | dropdown (32) vs context/select/combobox (36) | `min-w-36` | largura de menu é mais comum; 32 era outlier |
| `gap-1.5` vs `gap-2` | dropdown/context/menubar (1.5) vs combobox (2) | `gap-2` | combobox tem input + indicador; 2 dá mais respiro |
| `data-disabled:opacity-50` | só menubar tinha | aplicado a todos via base | consistência — item desabilitado deve ter feedback visual em todo menu |
| `data-[variant=destructive]` (6 declarações + dark theme) | dropdown/context | `tone: "destructive"` = `palette-danger` + tokens | palette redefini os 5 tokens, herança resolve o resto; eliminou dark: variant |
| `text-muted-foreground` (label/shortcut/separator) | dropdown/context/select/combobox | `text-palette-accent` | sem token de texto secundário (trade-off do pilot §2); distinção por tamanho/peso |
| `bg-border` (separator) | todos | `bg-palette-line` | token de palette substitui cor hardcoded |
| `ring-1 ring-foreground/10` (content) | todos | `border border-palette-line` | border é mais semântico que ring para borda de popup; palette token |
| `p-1` vs `p-2.5` vs none (content padding) | menu (1) vs popover (2.5) vs select (none) | variant `padding: { none, list, block }` | 3 modos distintos — variant em vez de valor fixo |
| `font-medium` no label | dropdown/context (sim) vs combobox/select (não) | `font-medium` | distingue label de item; consistência |
| `px-2 py-1.5` vs `px-1.5 py-1` (label) | combobox (2/1.5) vs demais (1.5/1) | `px-1.5 py-1` | valor mais comum; combobox era outlier |
| menubar sem `data-closed:*` | menubar | incluído (era bug) | menubar não animava ao fechar — drift tipo 2 (bug latente) |

**Total: 11 casos de drift**, todos resolvidos com valor explícito ou
variant. Nenhum foi "deixado como está" — cada um tem justificativa
documentada no cabeçalho do arquivo de família correspondente.

---

## 6. `cn-menu-translucent` (glassmorphism)

**Excluído da família.** A classe `cn-menu-translucent` aplica
`backdrop-blur` e `background-color: color-mix(...)` com `!important` —
proibido pelo Epic (§7.1 proíbe `!important`). Além disso, é
**cross-cutting** (afeta popup e item simultaneamente), não estrutura de
uma família ortogonal.

A aparência de glassmorphism, se desejada, deve ser uma **camada
composicional** (ex: `data-glass` no positioner + CSS custom properties),
não uma classe `!important` colada ao content.

---

## 7. O que ficou para depois

- **Família `field`**: `select-trigger` e `combobox-trigger`/`combobox-input`
  mantêm estilo próprio (border, bg, padding, size variants, focus ring).
  O insumo para a família `field` está documentado nos comentários de
  `select.tsx` e `combobox.tsx`.
- **Família `positioner`**: as classes estruturais (`isolate z-50
  outline-none`) do positioner são comuns a todos os popups e podem ser
  extraídas.
- **Token de texto secundário**: `text-muted-foreground` foi mapeado para
  `text-palette-accent` (sem distinção). O pilot-report §2 já registrou
  este trade-off. Decisão fica para depois.
- **`cn-menu-translucent`**: glassmorphism precisa de abordagem
  composicional, não `!important`.
