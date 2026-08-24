import { cn } from "#/utils/tailwind";

// `kbd` — tecla de atalho (ex: ⌘K). Convertido do shadcn (cn-kbd/cn-kbd-group
// do style-nova.css do shadcn, removido após a conversão) para o contrato de
// palette do Fragiola.
//
// KbdGroup renderiza <div> (não <kbd>) — agrupar teclas é layout, não
// semântica de tecla individual.

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
	return (
		<kbd
			data-slot="kbd"
			className={cn(
				"pointer-events-none inline-flex items-center justify-center select-none",
				"rounded-md border border-palette-line bg-palette-soft text-palette-accent",
				"text-xs font-medium",
				className,
			)}
			{...props}
		/>
	);
}

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="kbd-group"
			className={cn("inline-flex items-center gap-1", className)}
			{...props}
		/>
	);
}

export { Kbd, KbdGroup };
