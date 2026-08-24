import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { cn } from "#/utils/tailwind";

// Controle marcável — radio. Mesma regra do checkbox: aparência própria com
// palette, sem field.body. Circular (rounded-full) com indicator de ponto.
export function Radio({ className, ...props }: RadioPrimitive.Root.Props) {
	return (
		<RadioPrimitive.Root
			data-slot="radio"
			className={cn(
				"field-control size-4 shrink-0 rounded-full border border-palette-line bg-palette-soft",
				"data-checked:bg-palette-contrast",
				"field-focus:outline-solid field-focus:outline-1 field-focus:outline-offset-1 field-focus:outline-palette-accent",
				"data-disabled:opacity-50 data-disabled:cursor-not-allowed",
				"transition-colors",
				className as string,
			)}
			{...props}
		>
			<RadioPrimitive.Indicator
				data-slot="radio-indicator"
				className="grid place-content-center w-full h-full"
			>
				<span className="size-1.5 rounded-full bg-palette-base" />
			</RadioPrimitive.Indicator>
		</RadioPrimitive.Root>
	);
}
