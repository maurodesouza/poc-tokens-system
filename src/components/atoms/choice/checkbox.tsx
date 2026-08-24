import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckIcon } from "lucide-react";
import { cn } from "#/utils/tailwind";

// Controle marcável — checkbox. Tem aparência própria (caixa + check), mas
// usa o contrato de palette: border-palette-line, bg-palette-soft quando
// desmarcado, bg-palette-base quando marcado. Foco via field-focus (mesma
// regra do body). Estado inválido vem por herança: [data-invalid] no Field.Root aplica
// a palette danger a toda a subárvore (ver themes/light.css).
// Não usa field.body — controles marcáveis não têm corpo (Fase 5, #29).
export function Checkbox({
	className,
	...props
}: CheckboxPrimitive.Root.Props) {
	return (
		<CheckboxPrimitive.Root
			data-slot="checkbox"
			className={cn(
				"field-control size-4 shrink-0 rounded-sm border",
				"border-palette-line bg-palette-soft",
				"data-checked:bg-palette-ring data-checked:border-palette-line data-checked:text-palette-base",
				"field-focus:outline-solid field-focus:outline-1 field-focus:outline-offset-1 field-focus:outline-palette-ring",
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
