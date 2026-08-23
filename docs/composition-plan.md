# Plano de Implementação — Composição e Padronização

> Leia [architecture.md](./architecture.md) §7 antes de executar.
> Pré-requisito: as famílias `menu` e `popup` já existem em `src/components/families/`
> e os 4 componentes em `src/components/ui-frag/` já as consomem.

## Objetivo

Três mudanças que se reforçam:

1. **Wrappers compartilhados via factory** — eliminar os wrappers React duplicados entre
   `dropdown-menu` e `context-menu`, sem acoplar ao namespace errado do Base UI.
2. **Namespace object** — um export por componente/família, em vez de N exports soltos.
3. **Zero variantes nas famílias** — variação vira membro nomeado, não variant.

**Baseline a bater:**

| arquivo | linhas | exports |
|---|---|---|
| `combobox.tsx` | 299 | 17 |
| `context-menu.tsx` | 268 | 16 |
| `dropdown-menu.tsx` | 261 | 16 |
| `select.tsx` | 205 | 11 |
| **total** | **1033** | **60** |

---

## Fase 0 — Factory de partes do menu

### Por que factory e não import direto

Verificado: `ContextMenu.Item === Menu.Item` (14/14 partes idênticas em runtime; só
`Root` e `Trigger` diferem). A adaptação de comportamento acontece **dentro** do Base UI
via `ContextMenuRootContext` — os wrappers não contêm lógica de context-menu. O `role`
ARIA é `menuitem` nos dois casos, sem condicional.

Importar `Menu` direto e compartilhar funcionaria **hoje**. A factory protege do
**amanhã**: se o Base UI divergir numa versão futura, cada componente continua ligado ao
seu próprio namespace e herda a divergência, em vez de ficar preso ao `Menu`
silenciosamente — sem erro de tipo e sem crash.

- [ ] **0.1 — Criar `src/components/families/menu/parts.tsx`.**

      A factory recebe o namespace do primitivo e devolve os wrappers já estilizados:

      ```tsx
      export function createMenuParts(P: MenuNamespace) {
        function Item({ className, ...props }) {
          return <P.Item data-slot="menu-item" className={menu.item({ className })} {...props} />
        }
        function SelectableItem({ className, children, ...props }) { /* item + indicator */ }
        // … demais partes
        return { Item, SelectableItem, Label, Separator, Group, Shortcut,
                 CheckboxItem, RadioGroup, RadioItem, SubTrigger, SubContent, Content }
      }
      ```

      Partes que a factory precisa receber: `Item`, `CheckboxItem`,
      `CheckboxItemIndicator`, `RadioGroup`, `RadioItem`, `RadioItemIndicator`, `Group`,
      `GroupLabel`, `Separator`, `SubmenuRoot`, `SubmenuTrigger`, `Portal`, `Positioner`,
      `Popup`.

      **Tipagem:** tentar generics sobre o namespace antes de recorrer a `any`. Os tipos
      do Base UI são namespaces, não unions, então a inferência pode não fechar. Se
      precisar de `any`, usar **apenas na assinatura da factory** e manter os tipos
      corretos nos componentes que a consomem. Registrar no relatório.

- [ ] **0.2 — Decidir o `data-slot`.**

      Compartilhando o wrapper, o slot vira `menu-item` para todos, em vez de
      `dropdown-menu-item` / `context-menu-item`.

      **Decisão:** aceitar o nome único. É padronização, e mirar um componente específico
      continua possível via ancestral
      (`[data-slot=context-menu-content] [data-slot=menu-item]`). Se algo no playground
      quebrar por causa disso, registrar.

---

## Fase 1 — Zero variantes nas famílias

Auditoria feita no código atual. **Toda variante encontrada é artefato, não necessidade.**

- [ ] **1.1 — `popup.padding`** — hoje `{ none: "", list: "p-2", block: "p-2" }`.
      `list` e `block` produzem **a mesma classe**. `none` existe só porque o `select` põe
      padding no group interno, o que é inconsistência do select.
      → **Eliminar a variante.** `p-2` sempre; ajustar o `select` para não duplicar padding.

- [ ] **1.2 — `popup.width`** — `{ auto: "", menu: "min-w-36" }`. Nenhum dos 4 componentes
      usa `auto` desde que `w-(--anchor-width)` foi removido.
      → **Eliminar.** `min-w-36` sempre.

- [ ] **1.3 — `menuCheckboxItem` / `menuRadioItem`** — ambos são `extend: menuItem` com
      `indicator: "trail"`; produzem string idêntica.
      → **Fundir em um.**

- [ ] **1.4 — `menuItem.indicator`** — eliminar como variante. O `pr-8` não é variação de
      estilo, é consequência de **ter indicador**. Vira um segundo membro:

      ```ts
      export const menu = {
        item:           tv({ base: "… px-1.5 …" }),
        selectableItem: tv({ extend: item, base: "pr-8 pl-1.5" }),
      }
      ```

      `CheckboxItem`, `RadioItem`, item de `select` e item de `combobox` usam
      `selectableItem`.

      > **Nome em aberto:** `selectableItem` é descritivo mas não convence totalmente.
      > Se surgir um melhor durante a implementação, **propor no relatório — não trocar
      > por conta própria.**

- [ ] **1.5 — Regra permanente.** Depois desta fase, variante nova só se justifica quando
      **dois componentes da família precisam de valores diferentes e os dois estão
      certos**. Se um dos lados for arbitrário, unifica. Se for "coisa diferente", vira
      membro nomeado. Registrar qualquer variante criada e o porquê.

---

## Fase 2 — Namespace objects

### 2.1 Famílias

- [ ] Converter `families/menu.ts` e `families/popup.ts` de N exports soltos para um
      objeto por família:
      ```ts
      export const menu  = { item, selectableItem, label, separator, shortcut,
                             subTrigger, itemIndicator }
      export const popup = { content }
      ```

### 2.2 Componentes

- [ ] Converter os 4 para um export único cada:

      ```tsx
      // dropdown-menu.tsx
      const parts = createMenuParts(Menu)
      export const DropdownMenu = {
        Root: Menu.Root, Trigger: DropdownMenuTrigger, Content: DropdownMenuContent,
        ...parts,
      }
      ```

      ```tsx
      // context-menu.tsx — deve sobrar quase nada de próprio
      const parts = createMenuParts(ContextMenuPrimitive)
      export const ContextMenu = {
        Root: ContextMenuPrimitive.Root, Trigger: ContextMenuPrimitive.Trigger,
        Content: ContextMenuContent, ...parts,
      }
      ```

      **Critério de sucesso:** `context-menu.tsx` cai de 268 para ~40 linhas.

- [ ] **Manter os exports nomeados antigos como re-export** durante a conversão, para não
      quebrar o playground de uma vez. Remover no fim da fase.

- [ ] **Atualizar `src/routes/index.tsx`** para o novo acesso (`DropdownMenu.Item`).

> **Trade-off já aceito:** o namespace object quebra tree-shaking — importar
> `DropdownMenu` traz as 15 partes mesmo usando 3. Aceito conscientemente: partes de um
> mesmo menu são usadas juntas, e no modelo copy-paste o usuário só instala o que
> precisa. **Não reverter por bundle sem medir.**

---

## Fase 3 — Validação

- [ ] Playground renderiza os 4 componentes com todas as partes: item, item selecionável,
      checkbox, radio, submenu, label, separator, shortcut, disabled.
- [ ] **Testar context menu por botão direito especificamente** — é o caso em que o
      comportamento adaptado por contexto (`isContextMenu`) entra em ação. Confirmar que
      o menu não fecha ao soltar o botão direito e que a navegação por teclado funciona.
- [ ] Light + dark, `data-density="compact"`.
- [ ] `pnpm check` (Biome) e build sem erro de tipo.

---

## Fase 4 — Relatório

Escrever `docs/composition-report.md`:

- [ ] **Números antes/depois:** linhas por arquivo (baseline 1033) e exports (baseline 60).
- [ ] **`context-menu.tsx` chegou a ~40 linhas?** Se não, o que sobrou de próprio e por quê.
- [ ] **A factory tipou bem** ou precisou de `any`? Onde?
- [ ] **Zero variantes se sustentou?** Alguma família precisou de variante nova? Aplicar o
      critério da Fase 1.5.
- [ ] **`data-slot` unificado quebrou algo?**
- [ ] **Context menu por botão direito continua correto** após compartilhar os wrappers?
- [ ] **Proposta de nome** melhor que `selectableItem`, se houver.
- [ ] **Bundle:** CSS e JS cresceram ou encolheram?

---

## Restrições para quem executar

1. **Factory, não import direto de `Menu`.** Cada componente injeta o próprio namespace.
2. **Zero variantes nas famílias.** Variação vira membro nomeado. Se precisar mesmo de
   uma variante, parar e registrar em vez de criar.
3. **Não renomear `selectableItem`** por conta própria — propor no relatório.
4. **Não converter componentes fora dos 4.**
5. **Não usar `!important`.**
6. **Não mexer no contrato de palette** (5 papéis) nem na variant `highlighted`.
