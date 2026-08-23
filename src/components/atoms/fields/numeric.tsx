import type * as React from "react";
import { field } from "#/components/families/field";
import { cn } from "#/utils/tailwind";

// Controle nu — numérico. É o TESTE DA TESE do Epic #23: um controle novo,
// escrito do zero, deve ser só o miolo — sem uma linha de estilo de caixa
// (borda, fundo, focus ring, estado inválido, tema). Tudo isso mora no
// field.body que envolve este controle.
//
// Comportamento: input type=number com step/min/max e incremento por teclado
// (ArrowUp/ArrowDown respeitando step). Nada de spinner próprio — o do browser
// basta; se for escondido pelo body, o incremento por teclado cobre.
export type NumericProps = Omit<React.ComponentProps<"input">, "type"> & {
	min?: number;
	max?: number;
	step?: number;
};

export function Numeric({
	className,
	min,
	max,
	step = 1,
	onKeyDown,
	...props
}: NumericProps) {
	return (
		<input
			type="number"
			data-slot="numeric"
			min={min}
			max={max}
			step={step}
			className={cn(field.control(), className as string)}
			onKeyDown={(event) => {
				if (event.key === "ArrowUp" || event.key === "ArrowDown") {
					const base = Number.parseFloat(event.currentTarget.value);
					const current = Number.isFinite(base) ? base : 0;
					const dir = event.key === "ArrowUp" ? 1 : -1;
					const next = current + dir * (step ?? 1);
					const clamped =
						Number.isFinite(min) && next < (min as number)
							? (min as number)
							: Number.isFinite(max) && next > (max as number)
								? (max as number)
								: next;
					event.currentTarget.value = String(clamped);
				}
				onKeyDown?.(event);
			}}
			{...props}
		/>
	);
}
