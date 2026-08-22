# Plano de Implementação — Famílias de Estilo

> **Leia [architecture.md](./architecture.md) §7 antes de executar.** Os *porquês*
> estão lá. Este documento tem só os passos.
>
> Contexto: o pilot de cores já foi validado (ver [pilot-report.md](./pilot-report.md)).
> Os átomos `Clickable`/`Text` e o `dialog` já usam o contrato de 5 papéis.

## Objetivo

Validar que componentes com o mesmo esqueleto visual podem compartilhar estilo sem
duplicação, e que as diferenças legítimas entre eles ficam **explícitas** em vez de
silenciosas.

**Escopo — 4 componentes:** `dropdown-menu`, `context-menu`, `select`, `combobox`.

Por que estes quatro (cada um prova uma coisa):

| componente | prova |
|---|---|
| `dropdown-menu` | baseline da família |
| `context-menu` | o par mais duplicado — colapsa em zero estilo próprio? |
| `select` | diferença estrutural real (`pr-8`) vira variant nomeada; usa 3 famílias |
| `combobox` | vocabulário de estado divergente (`data-highlighted`) |

**Baseline a bater:** hoje esses 4 usam **67 classes `cn-*` distintas** em **1109
linhas** de TSX.

**Fora de escopo:** `menubar`, `command`, `navigation-menu`, `sidebar` e as famílias
`field` e `layer`. Entram depois que `menu` + `popup` estiverem provadas.

> `command` fica de fora porque usa `cmdk` (lib externa, não instalada) — é o caso mais
> difícil da normalização e merece ser atacado depois, com a família já estável.

---

## Fase 0 — Preparação

- [ ] **0.1 — Registrar a custom variant.** Em `src/styles/global.css`, fora do
      `@theme`:
      ```css
      @custom-variant highlighted (&:is(:focus, [data-highlighted], [data-selected]));
      ```
      Verificado que compila para
      `.highlighted\:x:is(:focus, [data-highlighted], [data-selected])`.
      **Não usar `data-active`** para isso — já significa "item atual" (architecture.md §7.4).

- [ ] **0.2 — Criar `src/components/families/`.** Um arquivo por família:
      `menu.ts`, `popup.ts`. (`field.ts` e `layer.ts` ficam para depois.)

- [ ] **0.3 — Remover `src/components/ui` do `exclude` do tsconfig** apenas para os 4
      arquivos convertidos, ou mover os convertidos para fora de `ui/`. Hoje
      `tsconfig.json` exclui `src/components/ui` inteiro, então erros de tipo nesses
      arquivos não aparecem.

- [ ] **0.4 — Substituir `IconPlaceholder`.** Os 4 componentes importam de
      `@/app/(create)/components/icon-placeholder`, que não existe. Usar `lucide-react`
      (já instalado): `ChevronRightIcon`, `CheckIcon`, `ChevronDownIcon`.

---

## Fase 1 — Família `popup`

Origem: `.cn-dropdown-menu-content`, `.cn-context-menu-content`, `.cn-popover-content`
em `src/styles/style-nova.css`.

- [ ] **1.1 — Escrever `families/popup.ts`.**

      ```ts
      export const popupContent = tv({
        base: `
          palette-raised bg-palette-subtle text-palette-accent
          rounded-lg border border-palette-line shadow-md
          data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95
          data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95
          data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2
          data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2
          duration-100
        `,
        variants: {
          padding: { list: "p-1", block: "p-2.5" },
          width:   { auto: "", menu: "min-w-36" },
        },
        defaultVariants: { padding: "list", width: "menu" },
      })
      ```

      **Decisões de drift a resolver aqui** (architecture.md §7.2, tipo 1) — escolher
      **um** valor e registrar qual:
      - `min-w-32` vs `min-w-36` → padronizar em `min-w-36`
      - menubar sem `data-closed:*` → **incluir** (era bug)

      **Conversões de cor:** `bg-popover text-popover-foreground` →
      `palette-raised bg-palette-subtle text-palette-accent`;
      `ring-foreground/10 ring-1` → `border border-palette-line`.

---

## Fase 2 — Família `menu`

Origem: as ~12 partes repetidas (`item`, `label`, `separator`, `group`, `shortcut`,
`sub-trigger`, `sub-content`, `checkbox-item`, `radio-item`, `item-indicator`).

- [ ] **2.1 — Escrever `families/menu.ts`** com um `tv()` por parte. O `item` é o
      central:

      ```ts
      export const menuItem = tv({
        base: `
          relative flex cursor-default items-center gap-2 rounded-md py-1 text-sm
          outline-none select-none
          highlighted:bg-palette-subtle highlighted:text-palette-accent
          data-disabled:pointer-events-none data-disabled:opacity-50
          [&_svg:not([class*='size-'])]:size-4
        `,
        variants: {
          indicator: {
            none:  "px-1.5",
            trail: "pr-8 pl-1.5",   // select/combobox: espaço pro check
          },
          tone: {
            default:     "",
            destructive: "palette-danger text-palette-accent highlighted:bg-palette-subtle",
          },
        },
        defaultVariants: { indicator: "none", tone: "default" },
      })
      ```

      **Note:** o bloco `data-[variant=destructive]:*` original tinha 6 declarações com
      variante de tema. Com palette vira `palette-danger` + os tokens (architecture.md §7.7).

      **Drift a resolver:** `gap-1.5` vs `gap-2` → padronizar em `gap-2`.
      `data-disabled:opacity-50` (só existia no menubar) → aplicar a **todos**.

- [ ] **2.2 — Escrever as demais partes** no mesmo arquivo: `menuLabel`,
      `menuSeparator`, `menuGroup`, `menuShortcut`, `menuSubTrigger`, `menuItemIndicator`,
      `menuCheckboxItem`, `menuRadioItem`. Cada uma derivada das classes `cn-*`
      correspondentes, unificando o drift.

---

## Fase 3 — Converter os 4 componentes

Para cada um: substituir `cn("cn-…", className)` pela chamada da família.

- [ ] **3.1 — `dropdown-menu.tsx`** — o baseline.
      ```tsx
      function DropdownMenuItem({ className, ...props }: MenuPrimitive.Item.Props) {
        return <MenuPrimitive.Item
          data-slot="dropdown-menu-item"
          className={menuItem({ className })}
          {...props} />
      }
      ```

- [ ] **3.2 — `context-menu.tsx`** — **critério de sucesso: zero estilo próprio.**
      Deve consumir `popup` + `menu` sem uma única classe exclusiva. Se sobrar alguma,
      registrar qual e por quê (é diferença legítima ou drift que passou?).

- [ ] **3.3 — `select.tsx`** — usa `menuItem({ indicator: "trail" })`. O
      `select-trigger` fica com estilo próprio por ora (a família `field` é fase
      posterior) — **anotar** o que ele precisou.

- [ ] **3.4 — `combobox.tsx`** — **o teste da normalização.** Não deve precisar de
      nenhuma regra `data-highlighted` própria: a variant `highlighted:` da Fase 0.1 já
      cobre. Se precisar, a normalização falhou — registrar.

- [ ] **3.5 — Remover as classes `cn-*` órfãs** de `style-nova.css` conforme forem
      substituídas, para o arquivo encolher junto e a medição final ser real.

---

## Fase 4 — Playground

- [ ] Estender `src/routes/index.tsx` com uma seção por componente convertido, cada uma
      exercitando: item normal, item destacado (navegar por teclado), item desabilitado,
      item destructive, checkbox item, radio item, submenu, separator e label.
      Testar em light e dark, e com `data-density="compact"`.

---

## Fase 5 — O que medir e registrar

Escrever `docs/families-report.md` no mesmo formato do `pilot-report.md`.

- [ ] **Números antes/depois.** Classes `cn-*` distintas (baseline: 67), linhas de TSX
      (baseline: 1109), linhas em `style-nova.css`.
- [ ] **`context-menu` ficou com zero estilo próprio?** Se não, o que sobrou?
- [ ] **A normalização funcionou?** `combobox` precisou de alguma regra
      `data-highlighted` própria?
- [ ] **As variants foram suficientes?** Algum componente precisou de override fora do
      vocabulário de variants da família? Qual?
- [ ] **Quantos casos de drift foram encontrados** e qual valor foi escolhido em cada.
- [ ] **`tv({ extend })` aguentou?** Onde a composição ficou desconfortável?
- [ ] **Sobrou `!important`?** (Havia um em `.cn-menubar-item`:
      `data-[variant=destructive]:*:[svg]:text-destructive!`.)
- [ ] **Bundle.** O CSS gerado cresceu ou encolheu? Tailwind dedupe as classes das
      famílias, mas confirmar.

---

## Restrições para quem executar

1. **Não criar família nova** além de `popup` e `menu`. Se algo não couber, anotar na
   Fase 5.
2. **Toda diferença entre irmãos vira variant nomeada**, nunca override solto no
   componente. Se não dá para nomear a variant, provavelmente é drift — unificar.
3. **Não usar `data-active`** para "item destacado" (architecture.md §7.4).
4. **Não usar `!important`.**
5. **Não converter componentes fora dos 4.**
6. **Ao unificar drift, registrar a escolha** na Fase 5 — não silenciosamente.
