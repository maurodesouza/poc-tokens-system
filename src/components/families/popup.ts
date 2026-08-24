// Família `popup` — caixa flutuante (content, positioner, arrow).
// Origem: .cn-dropdown-menu-content, .cn-context-menu-content,
// .cn-popover-content, .cn-select-content, .cn-combobox-content em
// style-nova.css do shadcn (removido do projeto após a conversão).
//
// Decisões em docs/architecture.md §7.5 (famílias ortogonais) e §7.6 (tv).
// Drift resolvido (§7.2 tipo 1) — registrar em families-report.md:
//  - min-w-32 (dropdown) vs min-w-36 (context/select/combobox/menubar)
//    → padronizado em min-w-36 (sempre — variant width eliminada no Epic #16)
//  - menubar sem data-closed:* → incluído (era bug — não animava ao fechar)
//  - padding: p-1 (menu lists) vs p-2.5 (popover block) vs none (select)
//    → p-2 sempre (variant padding eliminada no Epic #16); o select não
//    duplica padding — o group interno p-1 foi removido.
//  - Conversões de cor: bg-popover text-popover-foreground →
//    palette-raised bg-palette-subtle text-palette-accent;
//    ring-foreground/10 ring-1 → border border-palette-line
//  - cn-menu-translucent (glassmorphism) NÃO incluído — usa !important
//    (proibido pelo Epic) e é cross-cutting, não estrutura de popup.
//    Ver families-report.md.
//
// Epic #16 — Fase 1: zero variantes. popup.content é tv({ base }) sem
// variants. p-2 e min-w-36 são sempre aplicados.
//
// Epic #16 — Fase 2: namespace object. Um único export `popup` com o
// membro `content`. Zero exports soltos.

import { tv } from "tailwind-variants";

const content = tv({
	base: `
		palette-raised bg-palette-solid text-palette-accent
		rounded-lg border border-palette-line shadow-md
		min-w-36 p-2
		max-h-(--available-height) origin-(--transform-origin)
		overflow-x-hidden overflow-y-auto
		data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95
		data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95
		data-[side=bottom]:slide-in-from-top-2
		data-[side=left]:slide-in-from-right-2
		data-[side=right]:slide-in-from-left-2
		data-[side=top]:slide-in-from-bottom-2
		data-[side=inline-start]:slide-in-from-right-2
		rtl:data-[side=inline-start]:slide-in-from-left-2
		data-[side=inline-end]:slide-in-from-left-2
		rtl:data-[side=inline-end]:slide-in-from-right-2
		duration-100
	`,
});

export const popup = { content };
