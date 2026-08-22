// Família `menu` — lista de opções (item, label, separator, group, shortcut,
// sub-trigger, checkbox-item, radio-item, item-indicator).
// Origem: ~12 partes repetidas em dropdown/context/menubar/select/combobox.
//
// Decisões em docs/architecture.md §7.5 (famílias ortogonais), §7.6 (tv),
// §7.3 (normalização highlighted), §7.7 (palette mata duplicação de cor).
//
// Drift resolvido (§7.2 tipo 1) — registrar em families-report.md:
//  - gap-1.5 (dropdown/context/menubar/select) vs gap-2 (combobox)
//    → padronizado em gap-2
//  - data-disabled:opacity-50 (só menubar) → aplicado a TODOS via base
//  - data-[variant=destructive]: 6 declarações + dark theme →
//    palette-danger + tokens (tone: "destructive")
//  - focus:*:[svg]:text-accent-foreground (context) vs
//    not-data-[variant=destructive]:focus:**:text-accent-foreground (dropdown)
//    → eliminado: palette-danger redefini tokens, herança faz o resto
//  - text-muted-foreground (label/shortcut/separator) → text-palette-accent
//    (sem token de texto secundário — trade-off do pilot-report §2)
//  - bg-border (separator) → bg-palette-line
//  - item-indicator: alguns sem flex/size-4 → padronizado com todos
//  - label: px-2 py-1.5 (combobox) vs px-1.5 py-1 (demais) → px-1.5 py-1
//  - label: font-medium (dropdown/context) vs none (combobox/select)
//    → font-medium (distingue label de item)

import { tv } from "tailwind-variants";

// O item é o central. checkbox/radio/sub-trigger derivam dele via extend.
export const menuItem = tv({
	base: `
		relative flex cursor-default items-center gap-2 rounded-md py-1 text-sm
		outline-none select-none
		highlighted:bg-palette-subtle highlighted:text-palette-accent
		data-disabled:pointer-events-none data-disabled:opacity-50
		data-inset:pl-7
		[&_svg:not([class*='size-'])]:size-4
		[&_svg]:pointer-events-none [&_svg]:shrink-0
	`,
	variants: {
		// indicator: "none" para menus (dropdown/context/menubar);
		// "trail" para select/combobox (espaço pro check à direita).
		indicator: {
			none: "px-1.5",
			trail: "pr-8 pl-1.5",
		},
		// tone: "destructive" aplica palette-danger — redefini os 5 tokens,
		// e as regras highlighted:* do base resolvem contra a nova palette.
		tone: {
			default: "",
			destructive:
				"palette-danger text-palette-accent highlighted:bg-palette-subtle",
		},
	},
	defaultVariants: { indicator: "none", tone: "default" },
});

export const menuLabel = tv({
	base: "text-palette-accent px-1.5 py-1 text-xs font-medium data-inset:pl-7",
});

export const menuSeparator = tv({
	base: "bg-palette-line -mx-1 my-1 h-px",
});

// Shortcut: text-palette-accent sempre (sem texto secundário — pilot §2).
// A mudança de cor on-focus do original (group-focus/{name}:text-accent-foreground)
// não tem equivalente sem token secundário; distingue-se por tamanho/posição.
export const menuShortcut = tv({
	base: "text-palette-accent ml-auto text-xs tracking-widest",
});

// Sub-trigger = item + estado "popup aberto" (data-popup-open).
export const menuSubTrigger = tv({
	extend: menuItem,
	base: "data-popup-open:bg-palette-subtle data-popup-open:text-palette-accent",
	defaultVariants: { indicator: "none", tone: "default" },
});

export const menuItemIndicator = tv({
	base: "pointer-events-none absolute right-2 flex size-4 items-center justify-center",
});

// Checkbox/radio items = item com indicator à direita (trail).
// Não suportam tone: "destructive" — defaultVariants fixa tone: "default".
export const menuCheckboxItem = tv({
	extend: menuItem,
	defaultVariants: { indicator: "trail", tone: "default" },
});

export const menuRadioItem = tv({
	extend: menuItem,
	defaultVariants: { indicator: "trail", tone: "default" },
});
