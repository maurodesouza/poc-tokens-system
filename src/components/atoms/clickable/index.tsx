import { useRender } from "@base-ui/react/use-render";
import { Link as TanstackLink } from "@tanstack/react-router";
import React from "react";
import { tv, type VariantProps } from "tailwind-variants";

// size e shape são eixos ORTOGONAIS.
//
// Antes, `size` misturava medida com forma: `icon` descrevia o formato (quadrado)
// e `default` a medida. Isso não compõe — não havia como pedir "quadrado E pequeno",
// que é exatamente o botão dentro de um addon.
//
// Também é por isso que não existe `size="addon"`: addon não é um tamanho, é um
// contexto que PEDE um tamanho. Acoplar a escala ao lugar de uso impede reusar a
// mesma medida fora dele. É a mesma razão pela qual o InputGroupButton do shadcn
// (que é só `variant="ghost" size="xs"`) não deveria existir como componente.
//
// O tamanho do ícone acompanha o size do botão via [&_svg:not([class*='size-'])],
// então <Button size="sm"><XIcon/></Button> já sai com o ícone certo sem ninguém
// escolher. O :not() permite override explícito quando necessário.
const buttonVariants = tv({
	base: "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md select-none transition-colors hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-palette-accent [&_svg]:pointer-events-none [&_svg]:shrink-0",
	variants: {
		variant: {
			solid: "bg-palette-base text-palette-contrast hover:bg-palette-shade",
			ghost: "bg-transparent text-palette-accent hover:bg-palette-soft",
			outline:
				"bg-transparent text-palette-accent border border-palette-line hover:bg-palette-soft",
			icon: "bg-transparent text-palette-accent hover:bg-palette-soft",
		},
		// Medida. `md` usa h-control para alinhar com a altura dos campos.
		size: {
			sm: "h-7 gap-1.5 px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3.5",
			md: "h-control gap-2 px-4 text-sm [&_svg:not([class*='size-'])]:size-4",
		},
		// Forma. `square` zera o padding lateral e iguala largura à altura —
		// combina com qualquer size.
		shape: {
			auto: "",
			square: "aspect-square px-0",
		},
		disabled: {
			true: "pointer-events-none opacity-50 **:pointer-events-none",
			false: "",
		},
	},
	defaultVariants: {
		size: "md",
		shape: "auto",
		variant: "solid",
	},
});

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

type ButtonProps = useRender.ComponentProps<"button"> & ButtonVariantProps;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
	{ render, variant, size, shape, className, ...props },
	ref,
) {
	const disabled = Boolean(props.disabled);

	return useRender({
		defaultTagName: "button",
		render,
		ref,
		props: {
			...props,
			disabled,
			className: buttonVariants({ variant, size, shape, disabled, className }),
		},
	});
});

type LinkProps = ButtonVariantProps &
	React.ComponentProps<typeof TanstackLink> & {
		className?: string;
	};

function Link(props: React.PropsWithChildren<LinkProps>) {
	const { variant, size, shape, className, ...linkProps } = props;

	return (
		<TanstackLink
			className={buttonVariants({ variant, size, shape, className })}
			{...linkProps}
		/>
	);
}

type ExternalLinkProps = ButtonVariantProps &
	React.ComponentProps<"a"> & {
		className?: string;
	};

function ExternalLink(props: React.PropsWithChildren<ExternalLinkProps>) {
	const { variant, size, shape, className, ...anchorProps } = props;

	return (
		<a
			className={buttonVariants({ variant, size, shape, className })}
			{...anchorProps}
		/>
	);
}

export const Clickable = {
	Button,
	Link,
	ExternalLink,
};

export { buttonVariants };
