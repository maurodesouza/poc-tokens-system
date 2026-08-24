// Tamanhos de ícone por contexto.
//
// O problema que isto resolve: em aplicação real se perde tempo procurando outro
// ícone do mesmo contexto só para descobrir qual tamanho usar ali. O tamanho passa
// a ser uma consulta, não uma arqueologia.
//
// ─── NA MAIORIA DOS CASOS VOCÊ NÃO PRECISA DISTO ───────────────────────────────
// Cada contexto já define o tamanho do ícone por CSS, via
// `[&_svg:not([class*='size-'])]:size-N`:
//
//   <Clickable.Button size="sm"><XIcon /></Clickable.Button>   → size-3.5, sozinho
//   <Field.Addon><SearchIcon /></Field.Addon>                   → size-4, sozinho
//   <DropdownMenu.Item><CopyIcon /></DropdownMenu.Item>         → size-4, sozinho
//
// O `:not([class*='size-'])` faz o default valer só quando ninguém especificou —
// então passar uma classe de tamanho continua funcionando como override.
//
// Use este objeto quando precisar do tamanho EXPLÍCITO: ícone solto fora de um
// contexto conhecido, ou quando quiser deliberadamente fugir do default.
//
// ─── POR QUE CLASSE E NÃO NÚMERO ───────────────────────────────────────────────
// `size-4` em vez de `16`: um número exige `width`/`height` inline ou uma prop que
// cada lib de ícone nomeia diferente, e não passa pelo tailwind-merge — então
// `cn(iconSize.addon, "size-6")` não resolveria o conflito. Como classe, o override
// funciona e o valor continua vindo da escala do Tailwind.

export const iconSize = {
	/** Dentro de addon ou inset de campo. */
	addon: "size-4",
	/** Dentro de botão `size="md"` (o default). */
	button: "size-4",
	/** Dentro de botão `size="sm"`. */
	buttonSm: "size-3.5",
	/** Item de menu, dropdown, select, combobox. */
	menuItem: "size-4",
	/** Indicador de check/radio em item de menu. */
	indicator: "size-4",
	/** Ícone solto em bloco de conteúdo — empty state, alerta. */
	standalone: "size-6",
} as const;

export type IconSize = keyof typeof iconSize;
