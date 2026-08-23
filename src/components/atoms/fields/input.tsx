import type * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

export const inputVariants = tv({
	base: `
    h-full w-full text-sm
    py-xs
    placeholder:text-foreground-min
    selection:bg-tone-luminosity-300 selection:text-tone-foreground-contrast
    transition-[color,box-shadow]
    file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-background-base file:text-sm file:font-semibold
    disabled:!cursor-not-allowed disabled:opacity-50
  `,

	variants: {
		tone: {
			default: "",
			brand: "tone palette-brand",
			danger: "tone palette-danger",
			warning: "tone palette-warning",
			success: "tone palette-success",
		},
	},

	defaultVariants: {
		tone: "default",
	},
});

type InputProps = React.ComponentProps<"input"> &
	VariantProps<typeof inputVariants> & {
		invalid?: boolean;
	};

export function Input({ className, invalid = false, ...props }: InputProps) {
	return (
		<input
			aria-invalid={invalid}
			data-slot="input"
			className={inputVariants({
				...props,
				tone: invalid ? "danger" : props.tone,
				className,
			})}
			{...props}
		/>
	);
}
