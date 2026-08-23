# Relatório de Composição e Padronização — Observações da Validação

> Resultado da Fase 4 (#21). Respostas objetivas às perguntas de
> `docs/composition-plan.md`. Cada pergunta é respondida abaixo com
> números medidos no código final.

---

## 1. Números antes/depois

| arquivo | linhas (antes) | linhas (depois) | exports (antes) | exports (depois) |
|---|---|---|---|---|
| `combobox.tsx` | 299 | 296 | 17 | 17 |
| `context-menu.tsx` | 268 | 70 | 16 | 15 |
| `dropdown-menu.tsx` | 261 | 71 | 16 | 15 |
| `select.tsx` | 205 | 200 | 11 | 10 |
| **total** | **1033** | **637** | **60** | **57** |

Redução de **396 linhas (-38%)** e **3 exports (-5%)**.

A redução de linhas concentra-se em `context-menu` (-198, -74%) e
`dropdown-menu` (-190, -73%), que passaram a consumir a factory
`createMenuParts`. `select` e `combobox` têm redução marginal porque não
usam a factory — têm partes próprias (trigger, input, chips, scroll
buttons) que não são compartilhadas.

O número de exports caiu pouco porque cada namespace object expõe os
mesmos membros que antes eram exports soltos. A diferença (-3) vem de
`Portal` (não incluído nos namespaces — não usado no playground) e da
fusão de `CheckboxItem`/`RadioItem` que agora herdam estilo de um único
membro (`selectableItem`).

### Famílias e factory

| arquivo | linhas (antes) | linhas (depois) |
|---|---|---|
| `families/menu.ts` | 87 | 92 |
| `families/popup.ts` | 45 | 48 |
| `families/menu/parts.tsx` (nova) | 0 | 251 |
| **total famílias** | **132** | **391** |

As 251 linhas da factory são o **custo do compartilhamento**: o código
que antes estava duplicado em `dropdown-menu.tsx` e `context-menu.tsx`
(190 + 180 = 370 linhas de wrappers) agora existe uma vez só. O balanço
é 391 linhas de famílias/factory vs 370 linhas removidas dos componentes
— aparentemente neutro, mas a factory serve para **todos os futuros
componentes da família menu** (menubar, command, sidebar), não só para
estes dois.

---

## 2. `context-menu.tsx` chegou a ~40 linhas?

**Não.** Ficou com 70 linhas. O que sobrou de próprio:

1. **Root** (3 linhas) — `ContextMenuPrimitive.Root` com `data-slot`.
2. **Trigger** (8 linhas) — `ContextMenuPrimitive.Trigger` com
   `data-slot` + `className="select-none"`. O `select-none` é
   comportamental (evita seleção de texto no right-click), não estilo
   visual — não vem de família.
3. **Content** (14 linhas) — wraps `parts.Content` com defaults
   específicos: `align="start"`, `alignOffset=4`, `side="right"`,
   `sideOffset=0`. O context-menu posiciona à direita do cursor, não
   abaixo como o dropdown.
4. **SubContent** (7 linhas) — wraps `ContextMenuContent` com
   `side="right"`.
5. **Imports + export** (~20 linhas) — boilerplate.

**Por que não chegou a 40:** os defaults de posicionamento do Content
são diferentes do dropdown e não podem ser hardcoded na factory (a
factory é genérica). SubContent também precisa ser próprio porque wrap
o Content específico, não o da factory. As ~30 linhas extras sobre o
alvo de 40 são os 4 wrappers específicos + boilerplate de
import/export.

**Avaliação:** a diferença é legítima e estrutural, não drift. A factory
eliminou toda a duplicação de **wrappers de itens** (Item, Label,
Separator, CheckboxItem, RadioItem, SubTrigger, etc. — 12 partes), que
eram o grosso da duplicação. O que sobrou são as 4 partes que são
genuinamente diferentes entre dropdown e context.

---

## 3. A factory tipou bem ou precisou de `any`?

**Tipou bem. Não precisou de `any`.**

A factory usa um tipo estrutural `MenuNamespace` que lista as 14 partes
necessárias com seus tipos extraídos de `typeof MenuPrimitive.Item`,
`typeof MenuPrimitive.CheckboxItem`, etc.:

```ts
type MenuNamespace = {
  Item: typeof MenuPrimitive.Item;
  CheckboxItem: typeof MenuPrimitive.CheckboxItem;
  // … 12 mais
};
```

`ContextMenuPrimitive` é aceito por esse tipo porque o Base UI
re-exporta os mesmos componentes de Menu no namespace de ContextMenu
(apenas `Root` e `Trigger` são diferentes, e esses são deliberadamente
excluídos do tipo). A inferência fecha sem `any` na assinatura da
factory nem nos componentes que a consomem.

**Implicação:** se o Base UI divergir `ContextMenu.Item` de
`Menu.Item` no futuro, o tipo estrutural vai reclamar no ponto de
chamada — que é exatamente o comportamento desejado (a factory protege
do amanhã).

---

## 4. Zero variantes se sustentou?

**Sim.** Nenhuma variante nova foi necessária.

| família | variantes antes | variantes depois |
|---|---|---|
| `popup` | `padding` (none/list/block), `width` (auto/menu) | 0 |
| `menu` | `indicator` (none/trail) | 0 |

As variantes eliminadas eram artefatos:
- `popup.padding`: `list` e `block` produziam a mesma classe (`p-2`);
  `none` existia só porque o `select` punha padding no group interno
  (inconsistência corrigida — o group perdeu `p-1`, o padding vem do
  `popup.content`).
- `popup.width`: nenhum componente usava `auto` desde que
  `w-(--anchor-width)` foi removido.
- `menu.indicator`: o `pr-8` não é variação de estilo, é consequência
  de ter indicador. Virou um segundo membro (`selectableItem`).
- `menuCheckboxItem` / `menuRadioItem`: produziam string idêntica.
  Fundidos em `selectableItem`.

**Critério da Fase 1.5 aplicado:** nenhum caso surgiu onde dois
componentes precisassem de valores diferentes e os dois estivessem
certos. A regra permanente se mantém: variante nova só se justifica
quando dois componentes da família precisam de valores diferentes e os
dois estão certos.

---

## 5. `data-slot` unificado quebrou algo?

**Não.** O `data-slot` unificado (`menu-item`, `menu-label`,
`menu-separator`, etc. em vez de `dropdown-menu-item` /
`context-menu-item`) não quebrou nada no playground.

O playground não tem CSS que mire `dropdown-menu-item` ou
`context-menu-item` especificamente. O estilo vem das famílias (`tv()`)
aplicado via `className`, não via seletores de `data-slot`.

Mirar um componente específico continua possível via ancestral:
`[data-slot=dropdown-menu-content] [data-slot=menu-item]`. O Content
mantém seu `data-slot` específico (`dropdown-menu-content`,
`context-menu-content`) porque é componente-próprio, não da factory.

---

## 6. Context menu por botão direito continua correto?

**Sim.** O comportamento de right-click é preservado.

A factory recebe o namespace `ContextMenuPrimitive` (não `MenuPrimitive`),
então cada wrapper usa `ContextMenuPrimitive.Item`,
`ContextMenuPrimitive.CheckboxItem`, etc. internamente. O Base UI
adapta o comportamento via `ContextMenuRootContext` — o wrapper não
contém lógica de context-menu, apenas estilo.

Verificado no playground:
- O trigger renderiza como `div` com `data-slot="context-menu-trigger"`
  e `select-none` (evita seleção no right-click).
- O `role` ARIA é `menuitem` nos itens (igual ao dropdown — sem
  condicional).
- O menu abre no posicionamento correto (`side="right"`,
  `alignOffset=4` — à direita do cursor).

A tese da factory se sustenta: compartilhar wrappers entre dropdown e
context não regrediu o comportamento de right-click.

---

## 7. Proposta de nome melhor que `selectableItem`

**Proposta: `indicatorItem`.**

`selectableItem` é descritivo mas confunde — "selecionável" sugere que
o item pode ser marcado/desmarcado, quando na verdade o membro é um item
**com espaço para indicador**. O `pr-8` existe para caber o check à
direita, não porque o item é selecionável. Um item de select não é
"selecionável" no sentido de checkbox — ele **é** a seleção.

`indicatorItem` descreve o que o membro **tem** (indicador) em vez do
que ele **é** (selecionável). É paralelo a `itemIndicator` (o estilo do
indicador) e `subTrigger` (o item que é trigger de submenu).

**Não trocado no código** — apenas proposto. A troca exigiria atualizar
a factory, os 4 componentes e o playground, e o nome atual funciona. Se
a proposta for aceita, a troca é mecânica.

---

## 8. Bundle: CSS e JS cresceram ou encolheram?

| bundle | antes | depois | delta |
|---|---|---|---|
| CSS (`global.css`) | 80.551 bytes | 80.551 bytes | 0 (0%) |
| JS (routes chunk) | 305.722 bytes | 319.223 bytes | +13.501 (+4,4%) |

**CSS não mudou** — as mesmas classes Tailwind são geradas, apenas de
locais diferentes (factory em vez de componente). O `data-slot`
unificado não gera CSS extra porque não há seletores que o mirem.

**JS cresceu 4,4%** — esperado e aceito. O crescimento vem da factory
`createMenuParts` (251 linhas de código novo que antes não existia).
O trade-off foi aceito no plano: o namespace object quebra tree-shaking
(importar `DropdownMenu` traz todas as partes), mas partes de um mesmo
menu são usadas juntas, e no modelo copy-paste o usuário só instala o
que precisa.

No modelo de biblioteca final (CLI/registry), o usuário copia apenas o
componente que precisa, e a factory vem junto como dependência. O
bundle de um único componente não muda — o que muda é que dois
componentes que compartilham a factory não duplicam o código dos
wrappers.
