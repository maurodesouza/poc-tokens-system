"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import type * as React from "react";

import { cn } from "@/utils/tailwind";
import { Icon } from "../icon";

function SelectRoot({
	...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
	return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup({
	...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
	return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({
	...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
	return (
		<SelectPrimitive.Value
			data-slot="select-value"
			{...props}
			className="opa"
		/>
	);
}

function SelectTrigger({
	className,
	children,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
	return (
		<SelectPrimitive.Trigger
			data-slot="select-trigger"
			className={cn(
				`
          group/field
          flex cursor-pointer w-full
          **:data-[slot=select-value]:line-clamp-1 **:data-[slot=select-value]:flex **:data-[slot=select-value]:items-center **:data-[slot=select-value]:gap-xs
           **:data-[slot=select-value]:w-full
        `,
				className,
			)}
			{...props}
		>
			{children}
		</SelectPrimitive.Trigger>
	);
}

function SelectTriggerIcon({
	className,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Icon> & {
	size?: "sm" | "default";
}) {
	return (
		<SelectPrimitive.Icon
			data-slot="select-trigger-icon"
			className={cn("size-4 opacity-50", className)}
			{...props}
		>
			<Icon size={20} name="chevron-down" />
		</SelectPrimitive.Icon>
	);
}

function SelectContent({
	className,
	children,
	position = "popper",
	...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
	return (
		<SelectPrimitive.Portal>
			<SelectPrimitive.Content
				data-slot="select-content"
				className={cn(
					"bg-background-base text-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md full-border shadow-md",
					position === "popper" &&
						"data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
					className,
				)}
				position={position}
				{...props}
			>
				<SelectScrollUpButton />
				<SelectPrimitive.Viewport
					className={cn(
						"p-1",
						position === "popper" &&
							"h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1",
					)}
				>
					{children}
				</SelectPrimitive.Viewport>
				<SelectScrollDownButton />
			</SelectPrimitive.Content>
		</SelectPrimitive.Portal>
	);
}

function SelectLabel({
	className,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
	return (
		<SelectPrimitive.Label
			data-slot="select-label"
			className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
			{...props}
		/>
	);
}

function SelectItem({
	className,
	children,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
	return (
		<SelectPrimitive.Item
			data-slot="select-item"
			className={cn(
				`
        focus:bg-background-support focus:text-foreground
        relative flex w-full cursor-pointer items-center gap-xs rounded-md py-xs px-sm text-sm outline-hidden select-none
        data-[disabled]:pointer-events-none data-[disabled]:opacity-50
        [&_svg]:pointer-events-none [&_svg]:shrink-0
        *:[span]:first:flex *:[span]:first:items-center *:[span]:first:gap-2 *:[span]:first:w-full
        `,
				className,
			)}
			{...props}
		>
			<SelectPrimitive.ItemText className="w-full">
				{children}
			</SelectPrimitive.ItemText>

			<span className="flex size-4 items-center justify-center shrink-0 opacity-50">
				<SelectPrimitive.ItemIndicator>
					<Icon size={20} name="check" className="size-4" />
				</SelectPrimitive.ItemIndicator>
			</span>
		</SelectPrimitive.Item>
	);
}

function SelectSeparator({
	className,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
	return (
		<SelectPrimitive.Separator
			data-slot="select-separator"
			className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
			{...props}
		/>
	);
}

function SelectScrollUpButton({
	className,
	...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
	return (
		<SelectPrimitive.ScrollUpButton
			data-slot="select-scroll-up-button"
			className={cn(
				"flex cursor-default items-center justify-center py-1",
				className,
			)}
			{...props}
		>
			<Icon name="chevron-up" className="size-4" />
		</SelectPrimitive.ScrollUpButton>
	);
}

function SelectScrollDownButton({
	className,
	...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
	return (
		<SelectPrimitive.ScrollDownButton
			data-slot="select-scroll-down-button"
			className={cn(
				"flex cursor-default items-center justify-center py-1",
				className,
			)}
			{...props}
		>
			<Icon name="chevron-down" className="size-4" />
		</SelectPrimitive.ScrollDownButton>
	);
}

export const Select = {
	Root: SelectRoot,
	Content: SelectContent,
	Group: SelectGroup,
	Item: SelectItem,
	Label: SelectLabel,
	ScrollDownButton: SelectScrollDownButton,
	ScrollUpButton: SelectScrollUpButton,
	Separator: SelectSeparator,
	Trigger: SelectTrigger,
	TriggerIcon: SelectTriggerIcon,
	Value: SelectValue,
};
