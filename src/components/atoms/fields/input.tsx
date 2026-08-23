import { Field as FieldPrimitive } from "@base-ui/react/field";
import { field } from "#/components/families/field";
import { cn } from "#/utils/tailwind";

// Controle nu — texto. Sem borda, fundo, focus ring, estado inválido ou tema:
// tudo mora no field.body que envolve este controle. Usa FieldPrimitive.Control
// (Base UI) para o wiring de a11y (id, aria-labelledby, aria-describedby,
// validação) quando dentro de <Field.Root>; fora, funciona como input comum.
// inputVariants.tone (5 valores) some inteiro — cor via className do body.
export function Input({
	className,
	...props
}: React.ComponentProps<typeof FieldPrimitive.Control>) {
	return (
		<FieldPrimitive.Control
			data-slot="input"
			className={cn(field.control(), className as string)}
			{...props}
		/>
	);
}
