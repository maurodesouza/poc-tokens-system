import type * as React from "react";
import { field } from "#/components/families/field";
import { cn } from "#/utils/tailwind";

// Controle nu — texto. Sem borda, fundo, focus ring, estado inválido ou tema:
// tudo isso mora no field.body que envolve este controle. A cor vem da palette
// do body ancestral via text-palette-accent (declarado em field.control para o
// placeholder/selection herdarem o contrato). inputVariants.tone (5 valores)
// do código de referência some inteiro — cor via className do body.
export function Input({ className, ...props }: React.ComponentProps<"input">) {
	return (
		<input
			data-slot="input"
			className={cn(field.control(), className as string)}
			{...props}
		/>
	);
}
