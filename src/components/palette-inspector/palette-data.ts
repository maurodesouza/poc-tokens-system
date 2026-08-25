// Constantes compartilhadas entre o PaletteInspector (side panel global), a
// página /palettes e qualquer lugar que precise listar/visualizar palettes.
//
// Extraído de feature-themes.tsx, onde vivia duplicado e atrelado àquela rota.
// Agora o inspector e a página dedicada consomem daqui.

// Mapa estático de propósito: o Tailwind varre o código-fonte em busca de
// classes literais. `bg-palette-${role}` não geraria CSS nenhum.
export const ROLE_SWATCH = {
	base: "bg-palette-base",
	soft: "bg-palette-soft",
	line: "bg-palette-line",
	contrast: "bg-palette-contrast",
	accent: "bg-palette-accent",
	ring: "bg-palette-ring",
} as const;

export const ROLES = Object.keys(ROLE_SWATCH) as (keyof typeof ROLE_SWATCH)[];

// Lista completa das palettes definidas nos temas (light/dark). A ordem agrupa
// superfícies primeiro, depois cromáticas, depois as de feature (cromática +
// surface pareadas).
export const ALL_PALETTES = [
	"palette-surface",
	"palette-raised",
	"palette-brand",
	"palette-success",
	"palette-warning",
	"palette-danger",
	"palette-orange",
	"palette-orange-surface",
	"palette-purple",
	"palette-purple-surface",
	"palette-green",
	"palette-green-surface",
] as const;

export type PaletteName = (typeof ALL_PALETTES)[number];
