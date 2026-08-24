import { Link as TanstackLink } from "@tanstack/react-router";
import type { JSX } from "react";
import React from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { tailwind } from "#/utils/tailwind";

const headingVariants = tv({
	base: "font-semibold text-palette-contrast",
	variants: {
		hierarchy: {
			// Escala do Tailwind (text-md não existe nela). Progressão canônica
			// de UI: 24 / 20 / 18px. Antes eram 40 / 28 / 20px — tamanhos de
			// landing page, grandes demais para interface de aplicação.
			h1: "text-2xl",
			h2: "text-xl",
			h3: "text-lg",
		},
	},
});

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> &
	VariantProps<typeof headingVariants> & {
		as?: Extract<keyof JSX.IntrinsicElements, "h1" | "h2" | "h3">;
	};

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
	function Heading(props, ref) {
		const { as: Element = "h1", className, ...rest } = props;

		return (
			<Element
				ref={ref}
				className={headingVariants({
					hierarchy: Element,
					className,
				})}
				{...rest}
			/>
		);
	},
);

const Paragraph = tailwind.twx.p`text-palette-contrast text-sm transition-all`;

const Link = tailwind.twx(
	TanstackLink,
)`text-palette-contrast text-sm hover:underline`;

const Clickable = tailwind.twx
	.button`inline text-palette-contrast text-sm hover:underline`;

const Strong = tailwind.twx.strong`text-palette-contrast text-sm font-semibold`;

const Small = tailwind.twx.small`text-palette-contrast text-xs italic`;

const Label = tailwind.twx
	.label`text-palette-contrast text-sm font-semibold block`;

const Highlight = tailwind.twx.span`text-palette-contrast text-sm`;

const TextError = tailwind.twx(Highlight)`palette-danger text-xs`;

export const Text = {
	Heading,
	Paragraph,

	Link,
	Small,
	Label,
	Error: TextError,
	Strong,
	Highlight,

	Clickable,
};
