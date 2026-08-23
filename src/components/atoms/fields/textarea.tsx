import type * as React from "react";
import { field } from "#/components/families/field";
import { cn } from "#/utils/tailwind";

// Controle nu — texto multilinha. Mesma regra do Input: sem caixa própria.
// Altura variável: o textarea usa rows/resize; o field.body que o envolve usa
// min-h-control-height (não fixo), então cresce com o conteúdo sem variante.
// O controle declara min-h-control-height para o caso de ser usado sem body.
export function Textarea({
	className,
	...props
}: React.ComponentProps<"textarea">) {
	return (
		<textarea
			data-slot="textarea"
			className={cn(
				field.control(),
				"min-h-control-height",
				className as string,
			)}
			{...props}
		/>
	);
}
