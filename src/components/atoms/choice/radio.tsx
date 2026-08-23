import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { cn } from "#/utils/tailwind";

// Controle marcável — radio. Mesma regra do checkbox: aparência própria com
// palette, sem field.body. Circular (rounded-full) com indicator de ponto.
export function Radio({ className, ...props }: RadioPrimitive.Root.Props) {
	return (
		<RadioPrimitive.Root
			data-slot="radio"
			className={cn(
				"size-4 shrink-0 rounded-full border border-palette-line bg-palette-subtle",
				"data-checked:border-palette-solid",
				"field-focus:outline-solid field-focus:outline-1 field-focus:outline-palette-solid",
				"aria-invalid:palette-danger",
				"data-disabled:opacity-50 data-disabled:cursor-not-allowed",
				"transition-colors",
				className as string,
			)}
			{...props}
		>
			<RadioPrimitive.Indicator
				data-slot="radio-indicator"
				className="grid place-content-center"
			>
				<span className="size-2 rounded-full bg-palette-solid" />
			</RadioPrimitive.Indicator>
		</RadioPrimitive.Root>
	);
}
