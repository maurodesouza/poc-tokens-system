import { Field as FieldPrimitive } from "@base-ui/react/field";
import { field } from "#/components/families/field";
import { cn } from "#/utils/tailwind";

// Controle nu — texto multilinha. Mesma regra do Input: sem caixa própria.
// Altura variável: o textarea usa rows; o field.body que o envolve usa
// min-h-control (não fixo), então cresce com o conteúdo sem variante.
// render={<textarea />} troca o elemento default (input) por textarea mantendo
// o wiring de a11y do Base UI Field.
export function Textarea({
	className,
	rows,
	...props
}: React.ComponentProps<typeof FieldPrimitive.Control> & {
	rows?: number;
}) {
	return (
		<FieldPrimitive.Control
			data-slot="textarea"
			render={<textarea rows={rows} />}
			className={cn(field.control(), "min-h-control", className as string)}
			{...props}
		/>
	);
}
