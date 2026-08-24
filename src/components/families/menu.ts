// Família `menu` — lista de opções (item, selectableItem, label, separator,
// group, shortcut, sub-trigger, item-indicator).
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
//    palette passada via className (ex: className="palette-danger"),
//    base usa highlighted:bg-palette-soft/text-palette-contrast que
//    resolvem contra a palette ativa — sem variant de tone
//  - focus:*:[svg]:text-accent-foreground (context) vs
//    not-data-[variant=destructive]:focus:**:text-accent-foreground (dropdown)
//    → eliminado: palette redefini tokens, herança faz o resto
//  - text-muted-foreground (label/shortcut/separator) → text-palette-contrast
//    (sem token de texto secundário — trade-off do pilot-report §2)
//  - bg-border (separator) → bg-palette-line
//  - item-indicator: alguns sem flex/size-4 → padronizado com todos
//  - label: px-2 py-1.5 (combobox) vs px-1.5 py-1 (demais) → px-1.5 py-1.5
//  - label: font-medium (dropdown/context) vs none (combobox/select)
//    → font-medium (distingue label de item)
//
// Epic #16 — Fase 1: zero variantes. A variant `indicator` virou dois
// membros: `item` (px-1.5) e `selectableItem` (pe-8 ps-1.5, espaço pro
// check à direita). `menuCheckboxItem` e `menuRadioItem` produziam string
// idêntica e foram fundidos em `selectableItem`. O sub-trigger herda de
// `item` (sem indicator) — não há sub-trigger selecionável.
//
// Epic #16 — Fase 2: namespace object. Um único export `menu` com todos
// os membros. Zero exports soltos.

import { tv } from "tailwind-variants";

// item é o central. selectableItem, subTrigger derivam dele via extend.
const item = tv({
	base: `
		relative flex cursor-default items-center gap-2 rounded-md py-1.5 text-sm
		px-1.5 outline-none select-none
		text-palette-contrast highlighted:bg-palette-soft highlighted:text-palette-accent
		data-disabled:pointer-events-none data-disabled:opacity-50
		data-inset:ps-7
		[&_svg:not([class*='size-'])]:size-4
		[&_svg]:pointer-events-none [&_svg]:shrink-0
	`,
});

// selectableItem = item com espaço pro indicador (check) à direita.
// Usado por CheckboxItem, RadioItem, item de select e item de combobox.
// O pe-8 não é variação de estilo — é consequência de ter indicador.
const selectableItem = tv({
	extend: item,
	base: "pe-8 ps-1.5",
});

const label = tv({
	base: "text-palette-contrast px-1.5 py-1.5 text-xs font-medium data-inset:ps-7",
});

const separator = tv({
	base: "bg-palette-line -mx-1.5 my-1.5 h-px",
});

// Shortcut: text-palette-contrast sempre (sem texto secundário — pilot §2).
// A mudança de cor on-focus do original (group-focus/{name}:text-accent-foreground)
// não tem equivalente sem token secundário; distingue-se por tamanho/posição.
const shortcut = tv({
	base: "text-palette-contrast ms-auto text-xs tracking-widest",
});

// Sub-trigger = item + estado "popup aberto" (data-popup-open).
const subTrigger = tv({
	extend: item,
	base: "data-popup-open:bg-palette-soft data-popup-open:text-palette-contrast",
});

const itemIndicator = tv({
	base: "pointer-events-none absolute end-2 flex size-4 items-center justify-center",
});

export const menu = {
	item,
	selectableItem,
	label,
	separator,
	shortcut,
	subTrigger,
	itemIndicator,
};
