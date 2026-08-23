import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckIcon } from "lucide-react";
import { cn } from "#/utils/tailwind";

// Controle marcável — checkbox. Tem aparência própria (caixa + check), mas
// usa o contrato de palette: border-palette-line, bg-palette-subtle quando
// desmarcado, bg-palette-solid quando marcado. Foco via field-focus (mesma
// regra do body). Estado inválido via aria-invalid:palette-danger.
// Não usa field.body — controles marcáveis não têm corpo (Fase 5, #29).
export function Checkbox({
	className,
	...props
}: CheckboxPrimitive.Root.Props) {
	return (
		<CheckboxPrimitive.Root
			data-slot="checkbox"
			className={cn(
				"size-4 shrink-0 rounded-sm border border-palette-line bg-palette-subtle",
				"data-checked:bg-palette-solid data-checked:border-palette-solid data-checked:text-palette-contrast",
				"field-focus:outline-solid field-focus:outline-1 field-focus:outline-palette-solid",
				"aria-invalid:palette-danger",
				"data-disabled:opacity-50 data-disabled:cursor-not-allowed",
				"transition-colors",
				className as string,
			)}
			{...props}
		>
			<CheckboxPrimitive.Indicator
				data-slot="checkbox-indicator"
				className="grid place-content-center text-current"
			>
				<CheckIcon className="size-3" />
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	);
}
