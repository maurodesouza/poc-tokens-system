import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cn } from "#/utils/tailwind";

// Controle marcável — switch. Tem aparência própria (track + thumb) com
// palette: bg-palette-line quando off, bg-palette-solid quando on. Thumb
// branco (bg-palette-contrast) que desliza. Sem field.body (Fase 5, #29).
export function Switch({ className, ...props }: SwitchPrimitive.Root.Props) {
	return (
		<SwitchPrimitive.Root
			data-slot="switch"
			className={cn(
				"inline-flex shrink-0 items-center rounded-full border border-transparent",
				"w-8 h-5 p-0.5",
				"bg-palette-line data-checked:bg-palette-solid",
				"field-focus:outline-solid field-focus:outline-1 field-focus:outline-palette-solid",
				"aria-invalid:palette-danger",
				"data-disabled:opacity-50 data-disabled:cursor-not-allowed",
				"transition-colors",
				className as string,
			)}
			{...props}
		>
			<SwitchPrimitive.Thumb
				data-slot="switch-thumb"
				className="block size-4 rounded-full bg-palette-contrast transition-transform data-checked:translate-x-3"
			/>
		</SwitchPrimitive.Root>
	);
}
