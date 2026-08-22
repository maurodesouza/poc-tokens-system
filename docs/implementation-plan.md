# Plano de Implementação — Pilot do Design System

> **Leia [architecture.md](./architecture.md) antes de executar.** Este documento
> contém apenas os passos; os *porquês* estão lá.

## Objetivo do pilot

Validar duas coisas no mesmo movimento, sem converter os 62 componentes:

1. **Arquitetura de cor** — o contrato de 5 papéis aguenta componentes reais?
2. **Arquitetura de composição** — um componente estrutural (dialog) consegue apontar
   para átomos (`Clickable`, `Text`) em vez de recriar tipografia e botões?

**Escopo:** átomos `Clickable` + `Text` convertidos, `dialog` reescrito apontando para
eles, e um playground que troca palette / tema / densidade em runtime.

**Fora de escopo:** os outros 60 componentes, e a extração de primitivos de estilo
compartilhados (`menu`, `dialog/sheet/drawer`). Isso vem depois que o contrato de cor
estiver validado.

---

## Fase 0 — Desbloqueio

Nada renderiza hoje. Estes passos são pré-requisito de tudo.

- [ ] **0.1 — Instalar `@base-ui/react`.** Não está instalado; `dialog.tsx` importa
      `@base-ui/react/dialog` e não compila sem ele.
      ```bash
      pnpm add @base-ui/react
      ```

- [ ] **0.2 — Instalar uma lib de ícones.** `dialog.tsx` importa `IconPlaceholder` de
      `@/app/(create)/components/icon-placeholder`, que é um artefato do registry do
      shadcn e **não existe neste projeto**. Usar `lucide-react` (o default do shadcn) e
      substituir o `IconPlaceholder` por `<XIcon />`.
      ```bash
      pnpm add lucide-react
      ```

- [ ] **0.3 — Corrigir o import de CSS.** `src/routes/__root.tsx:5` importa
      `../styles.css`, que é um arquivo separado com seu próprio `@import "tailwindcss"`.
      O `src/styles/global.css` **nunca é carregado**. Trocar para
      `../styles/global.css?url` e **deletar `src/styles.css`**, movendo o que houver de
      útil nele (`html, body, #app { min-height: 100% }`, `body { margin: 0 }`) para o
      `global.css`.

- [ ] **0.4 — Unificar o `cn`.** Existem dois:
      - `src/lib/utils.ts` — `twMerge` puro (usado pelos 62 componentes shadcn)
      - `src/utils/tailwind/cn/index.ts` — `extendTailwindMerge` (usado pelos átomos)

      Manter **`src/utils/tailwind/cn`** e reapontar `src/lib/utils.ts` para ele
      (re-export), para não quebrar os 62 imports existentes de uma vez.

- [ ] **0.5 — Ajustar o `extendTailwindMerge`.** Em `src/utils/tailwind/cn/index.ts`:
      - **Remover** `theme: { spacing: ["xs","sm","md","lg","xl"] }` — a escala nomeada
        de spacing foi abandonada (ver architecture.md §2.1).
      - **Adicionar** um class group para as palettes, para que duas nunca coexistam no
        mesmo elemento (`cn("palette-brand", "palette-danger")` deve resolver para
        `palette-danger`):
        ```ts
        extendTailwindMerge({
          extend: {
            classGroups: {
              palette: [{ palette: ["surface", "raised", "brand", "success", "warning", "danger"] }],
            },
          },
        })
        ```

**Critério de saída da fase:** `pnpm dev` sobe, a página inicial renderiza, e o
`global.css` está sendo aplicado.

---

## Fase 1 — Tokens

- [ ] **1.1 — Reescrever `src/styles/themes/light.css` e `dark.css`.**

      Formato: `[data-theme]` no root, cor **completa** em OKLCH, 5 tokens por palette.
      Deletar `.theme-light` / `.theme-dark`, `.base-1`, `.base-2` e todos os
      `--tone-*`.

      Estrutura de cada arquivo:

      ```css
      :root[data-theme="light"] {
        --palette-state-shift: -0.06;   /* hover escurece no light */
      }

      :root[data-theme="light"] .palette-surface {
        --palette-subtle:   oklch(1 0 0);          /* o chão do app */
        --palette-line:     oklch(0.90 0.005 250);
        --palette-solid:    oklch(0.25 0.01 250);  /* inverso do fundo: tooltip, botão default */
        --palette-accent:   oklch(0.30 0.01 250);  /* cor de texto padrão */
        --palette-contrast: oklch(1 0 0);
      }

      :root[data-theme="light"] .palette-raised { … }  /* superfície elevada */

      :root[data-theme="light"] .palette-brand {
        --palette-subtle:   oklch(0.95 0.03 250);
        --palette-line:     oklch(0.85 0.08 250);
        --palette-solid:    oklch(0.55 0.20 250);
        --palette-accent:   oklch(0.45 0.18 250);
        --palette-contrast: oklch(1 0 0);
      }

      :root[data-theme="light"] .palette-success { … }
      :root[data-theme="light"] .palette-warning { … }
      :root[data-theme="light"] .palette-danger  { … }
      ```

      `dark.css` é o mesmo com `[data-theme="dark"]` e
      `--palette-state-shift: 0.06` (hover clareia no dark).

      **Palettes do pilot (6):** `surface`, `raised`, `brand`, `success`, `warning`,
      `danger`.

      **Cuidados na calibragem:**
      - `--palette-contrast` **não é branco por default**. No dark, o `solid` costuma ser
        um tom claro; branco em cima dele reprova WCAG AA. Escolher preto ou branco pelo
        que der contraste ≥ 4.5:1 contra o `solid` **daquele tema**.
      - `warning` precisa ser visivelmente distinto de `danger` — hue ~40–60, não ~10.

- [ ] **1.2 — Reescrever o `@theme inline` em `src/styles/global.css`.**

      ```css
      @theme inline {
        --default-transition-duration: 300ms;

        --color-*: initial;

        --color-palette-subtle:   var(--palette-subtle);
        --color-palette-line:     var(--palette-line);
        --color-palette-solid:    var(--palette-solid);
        --color-palette-accent:   var(--palette-accent);
        --color-palette-contrast: var(--palette-contrast);

        /* estado derivado — ver architecture.md §1.6 */
        --color-palette-solid-hover: var(
          --palette-solid-hover,
          oklch(from var(--palette-solid) calc(l + var(--palette-state-shift)) c h)
        );

        /* fora do contrato de palette */
        --color-scrim: oklch(0 0 0 / 0.4);

        --radius-*: initial;
        --radius-sm: 4px;
        --radius-md: 8px;
        --radius-lg: 16px;
        --radius-full: 9999px;

        --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;

        --text-xs: 0.75rem;
        --text-sm: 1rem;
        --text-md: 1.25rem;
        --text-lg: 1.75rem;
        --text-xl: 2.5rem;

        --breakpoint-desktop: 90rem;
        --breakpoint-laptop:  73.125rem;
        --breakpoint-tablet:  48rem;
        --breakpoint-mobile:  28.125rem;
      }
      ```

      **NÃO declarar `--spacing-xs/sm/md/lg/xl`** nem `--spacing-control-height`. A escala
      numérica do Tailwind é a escala oficial (architecture.md §2.1).

- [ ] **1.3 — Densidade.** Adicionar em `global.css`, fora do `@theme`:
      ```css
      [data-density="compact"]  { --spacing: 0.2rem; }
      [data-density="spacious"] { --spacing: 0.3rem; }
      ```

- [ ] **1.4 — Regras base.** Como a palette não pinta (architecture.md §1.5), o `body`
      precisa aplicar explicitamente:
      ```css
      body {
        @apply palette-surface bg-palette-subtle text-palette-accent font-sans text-sm antialiased;
      }
      ```
      E `:root` precisa de `data-theme` e `data-density` default — setar no
      `src/routes/__root.tsx` (`<html data-theme="light" data-density="default">`).

**Critério de saída:** trocar `data-theme` no devtools do browser muda as cores da
página.

---

## Fase 2 — Átomos

### 2.1 `src/components/atoms/clickable/index.tsx`

- [ ] **Reescrever `buttonVariants`.** Remover todos os `!important`, todos os
      `data-[tone=default]:*` e o `.attrs` que injeta `data-tone` — eles existiam só
      porque `default` era caso especial (architecture.md §1.4).

      ```ts
      const buttonVariants = tv({
        base: "flex items-center gap-2 rounded-md transition-colors hover:no-underline",
        variants: {
          tone: {
            default: "palette-surface",
            brand:   "palette-brand",
            success: "palette-success",
            warning: "palette-warning",
            danger:  "palette-danger",
          },
          variant: {
            solid:   "bg-palette-solid text-palette-contrast hover:bg-palette-solid-hover",
            ghost:   "bg-transparent text-palette-accent hover:bg-palette-subtle",
            outline: "bg-transparent text-palette-accent border border-palette-line hover:bg-palette-subtle",
            icon:    "bg-transparent text-palette-accent hover:bg-palette-subtle",
          },
          size: {
            icon:    "size-8 justify-center",
            default: "px-4 py-2",
          },
          disabled: {
            true:  "cursor-not-allowed opacity-50 **:cursor-not-allowed",
            false: "",
          },
        },
        defaultVariants: { size: "default", tone: "default", variant: "solid" },
      });
      ```

      > `px-md py-xs` viraram `px-4 py-2` (mesmos valores: 1rem / 0.5rem).

- [ ] **Trocar `asChild` por `render`** (architecture.md §5.4). O `asChild` atual não
      funciona — `twx.button` não implementa Slot e o atributo vaza para o DOM.
      `Clickable.Link` e `Clickable.ExternalLink` devem passar o elemento via `render`,
      no mesmo padrão que o Base UI usa.

- [ ] **Adicionar focus ring.** No `base`, usando `solid` como cor do ring
      (architecture.md §1.3):
      ```
      focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-solid
      ```

### 2.2 `src/components/atoms/text/index.tsx`

- [ ] **Substituir os tokens antigos:**
      | antes | depois |
      |---|---|
      | `text-foreground` | `text-palette-accent` |
      | `text-tone-foreground-context` | `text-palette-accent` |
      | `tone palette-danger` | `palette-danger` |

- [ ] **Corrigir o `Heading`.** Em `text/index.tsx:28-34`, o spread `{...props}` vem
      **depois** do `className` computado, então um `className` passado por prop
      sobrescreve o resultado do `headingVariants` em vez de ser mesclado. Inverter a
      ordem: spread primeiro, `className` depois.

- [ ] **Remover o `!` de `Text.Clickable`** (`text-tone-foreground-context!`) — sem caso
      especial não há guerra de especificidade.

**Critério de saída:** uma página de teste com `Clickable.Button` em todas as 5 tones ×
4 variants renderiza corretamente em light e dark, sem nenhum `!important`.

---

## Fase 3 — Dialog (o teste de composição)

Reescrever `src/components/ui/dialog.tsx`. **A regra está em architecture.md §5.3:**
comportamento vem do Base UI, aparência vem do átomo, `render` costura.

- [ ] **3.1 — `DialogTitle` aponta para `Text.Heading`:**
      ```tsx
      function DialogTitle(props: DialogPrimitive.Title.Props) {
        return (
          <DialogPrimitive.Title
            data-slot="dialog-title"
            render={<Text.Heading as="h2" />}
            {...props}
          />
        )
      }
      ```
      Deleta a classe `cn-dialog-title cn-font-heading`.

- [ ] **3.2 — `DialogDescription` aponta para `Text.Paragraph`.** Mesmo padrão.
      > ⚠️ O estilo original usa `text-muted-foreground`. O contrato de 5 papéis **não
      > tem** nível de texto secundário (decisão explícita — architecture.md §6, ponto 2).
      > Implementar sem ele e **anotar como o resultado ficou**: título e descrição vão
      > sair com a mesma cor. Esse é um dos achados que o pilot existe para produzir.
      > **Não inventar um sexto token para contornar.**

- [ ] **3.3 — Close button.** Já usa `render={<Button …/>}` — trocar o `Button` do
      shadcn por `Clickable.Button` com `variant="icon"` e substituir `IconPlaceholder`
      por `<XIcon />` do `lucide-react`.

- [ ] **3.4 — `DialogFooter`** — mesma troca de `Button` por `Clickable.Button`.

- [ ] **3.5 — Converter os estilos restantes.** Substituir as classes `cn-dialog-*`
      (definidas em `src/styles/style-nova.css:463-490`) por utilities com os novos
      tokens. Mapeamento:
      | classe antiga | token novo |
      |---|---|
      | `.cn-dialog-overlay` → `bg-black/10` | `bg-scrim` |
      | `.cn-dialog-content` → `bg-popover text-popover-foreground` | `palette-raised bg-palette-subtle text-palette-accent` |
      | `.cn-dialog-content` → `ring-foreground/10` | `border border-palette-line` |
      | `.cn-dialog-footer` → `bg-muted/50 border-t` | `bg-palette-subtle border-t border-palette-line` |

      > `palette-raised` no `DialogContent` é o que faz o dialog ser uma superfície
      > elevada — e como palettes são aninháveis, um `Clickable.Button` dentro dele com
      > `tone="default"` pega automaticamente as cores da superfície elevada, não as do
      > chão do app. **Esse é o comportamento que o pilot precisa confirmar.**

**Critério de saída:** o dialog abre, o título usa `Text.Heading`, o close usa
`Clickable.Button`, e nenhuma classe `cn-dialog-*` sobrou no arquivo.

---

## Fase 4 — Playground

- [ ] Reescrever `src/routes/index.tsx` com:
      - Toggle de **tema** (`data-theme` light/dark no `<html>`)
      - Toggle de **densidade** (`data-density` default/compact/spacious)
      - Grid de `Clickable.Button`: **5 tones × 4 variants**, em tamanho `default` e `icon`
      - Todos os membros de `Text` (`Heading` h1/h2/h3, `Paragraph`, `Link`, `Small`,
        `Label`, `Error`, `Strong`, `Highlight`, `Clickable`)
      - Um `Dialog` completo com header, title, description, footer e close
      - Uma seção com o dialog **aberto inline** dentro de um `palette-raised`, para
        verificar aninhamento de palettes

---

## Fase 5 — O que observar (o resultado do pilot)

Registrar as respostas, não só "funcionou":

- [ ] **Faltou algum papel?** Algum estilo exigiu um token fora dos 5? Anotar qual e
      onde. (Não adicionar token — anotar.)
- [ ] **Texto secundário.** Como ficou título vs descrição do dialog sem nível
      secundário? Legível ou visivelmente errado?
- [ ] **Aninhamento.** Um botão `tone="default"` dentro de `palette-raised` pega a cor da
      superfície elevada?
- [ ] **Contraste.** Todos os pares `solid` + `contrast` passam 4.5:1, nos **dois** temas?
- [ ] **Hover derivado.** A derivação por `--palette-state-shift` produz hover visível e
      agradável nas 6 palettes? Algum `solid` já tão claro/escuro que o shift satura?
- [ ] **Densidade.** Com `data-density="compact"`, o que quebrou? Ícones e larguras
      encolheram junto (limitação conhecida — architecture.md §2.2). É aceitável ou
      justifica tokens semânticos de spacing?
- [ ] **Tipografia.** A falta de 14px e de line-heights atrapalhou? (architecture.md §4)
- [ ] **Sobrou algum `!important`?** Se sim, ali há uma briga de especificidade que a
      arquitetura deveria ter eliminado — investigar a causa.

---

## Restrições para quem executar

1. **Não adicionar um sexto token de palette.** Se algo não couber nos 5, anotar na
   Fase 5. O contrato é deliberadamente fechado (architecture.md §1.2).
2. **Não reintroduzir spacing nomeado** (`p-md`, `gap-xs`). Usar a escala numérica;
   valores quebrados via `p-[3px]`.
3. **Não usar `!important`.** Se precisar, é sintoma de problema arquitetural —
   registrar em vez de contornar.
4. **Não converter outros componentes** além de `dialog`. O escopo é o pilot.
5. **`render`, nunca `asChild`** (architecture.md §5.4).
