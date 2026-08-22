import { useRender } from "@base-ui/react/use-render";
import { Link as TanstackLink } from "@tanstack/react-router";
import React from "react";
import { tv, type VariantProps } from "tailwind-variants";

const buttonVariants = tv({
	base: "flex items-center gap-2 rounded-md transition-colors hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-solid",
	variants: {
		tone: {
			default: "palette-surface",
			brand: "palette-brand",
			success: "palette-success",
			warning: "palette-warning",
			danger: "palette-danger",
		},
		variant: {
			solid:
				"bg-palette-solid text-palette-contrast hover:bg-palette-solid-hover",
			ghost: "bg-transparent text-palette-accent hover:bg-palette-subtle",
			outline:
				"bg-transparent text-palette-accent border border-palette-line hover:bg-palette-subtle",
			icon: "bg-transparent text-palette-accent hover:bg-palette-subtle",
		},
		size: {
			icon: "size-8 justify-center",
			default: "px-4 py-2",
		},
		disabled: {
			true: "cursor-not-allowed opacity-50 **:cursor-not-allowed",
			false: "",
		},
	},
	defaultVariants: {
		size: "default",
		tone: "default",
		variant: "solid",
	},
});

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

type ButtonProps = useRender.ComponentProps<"button"> & ButtonVariantProps;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
	{ render, tone, variant, size, className, ...props },
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
			className: buttonVariants({ tone, variant, size, disabled, className }),
		},
	});
});

type LinkProps = ButtonVariantProps &
	React.ComponentProps<typeof TanstackLink> & {
		className?: string;
	};

function Link(props: React.PropsWithChildren<LinkProps>) {
	const { tone = "default", variant, size, className, ...linkProps } = props;

	return (
		<TanstackLink
			className={buttonVariants({ tone, variant, size, className })}
			{...linkProps}
		/>
	);
}

type ExternalLinkProps = ButtonVariantProps &
	React.ComponentProps<"a"> & {
		className?: string;
	};

function ExternalLink(props: React.PropsWithChildren<ExternalLinkProps>) {
	const { tone = "default", variant, size, className, ...anchorProps } = props;

	return (
		<a
			className={buttonVariants({ tone, variant, size, className })}
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
