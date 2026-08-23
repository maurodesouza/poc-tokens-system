// Família `popup` — caixa flutuante (content, positioner, arrow).
// Origem: .cn-dropdown-menu-content, .cn-context-menu-content,
// .cn-popover-content, .cn-select-content, .cn-combobox-content em
// src/styles/style-nova.css.
//
// Decisões em docs/architecture.md §7.5 (famílias ortogonais) e §7.6 (tv).
// Drift resolvido (§7.2 tipo 1) — registrar em families-report.md:
//  - min-w-32 (dropdown) vs min-w-36 (context/select/combobox/menubar)
//    → padronizado em min-w-36 (variant width: "menu")
//  - menubar sem data-closed:* → incluído (era bug — não animava ao fechar)
//  - padding: p-1 (menu lists) vs p-2.5 (popover block) vs none (select)
//    → variant padding: { none, list, block } — normalizado p-2 em ambos
//  - Conversões de cor: bg-popover text-popover-foreground →
//    palette-raised bg-palette-subtle text-palette-accent;
//    ring-foreground/10 ring-1 → border border-palette-line
//  - cn-menu-translucent (glassmorphism) NÃO incluído — usa !important
//    (proibido pelo Epic) e é cross-cutting, não estrutura de popup.
//    Ver families-report.md.

import { tv } from "tailwind-variants";

export const popupContent = tv({
	base: `
		palette-raised bg-palette-solid text-palette-accent
		rounded-lg border border-palette-line shadow-md
		max-h-(--available-height) origin-(--transform-origin)
		overflow-x-hidden overflow-y-auto
		data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95
		data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95
		data-[side=bottom]:slide-in-from-top-2
		data-[side=left]:slide-in-from-right-2
		data-[side=right]:slide-in-from-left-2
		data-[side=top]:slide-in-from-bottom-2
		data-[side=inline-start]:slide-in-from-right-2
		data-[side=inline-end]:slide-in-from-left-2
		duration-100
	`,
	variants: {
		// padding: list (p-2) para menus, block (p-2) para popover,
		// none para select (padding vem do group interno).
		padding: { none: "", list: "p-2", block: "p-2" },
		width: { auto: "", menu: "min-w-36" },
	},
	defaultVariants: { padding: "list", width: "menu" },
});
