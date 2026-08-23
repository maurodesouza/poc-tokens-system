"use client";

import { Field as FieldPrimitive } from "@base-ui/react/field";
import type * as React from "react";
import { Text } from "#/components/atoms/text";
import { field } from "#/components/families/field";
import { cn } from "#/utils/tailwind";

// Composition `Field` — costura o primitivo Base UI Field (comportamento/a11y)
// com o estilo da família `field` (aparência) via `render` (architecture.md
// §5.3). Padrão do Epic #16: namespace object, um export, acesso por ponto.
//
// O Base UI Field resolve o wiring de a11y que nem o shadcn nem o código de
// referência fazem: controlId↔labelId (aria-labelledby), aria-invalid,
// validate/validationMode e — confirmado na Fase 0 — aria-describedby em
// Description/Error via LabelableProvider. Nada de div+useId reimplementado.

// Root — coluna: label, corpo, description, error. Repassa validate,
// validationMode, invalid, disabled, name ao Base UI.
function FieldRoot({
	className,
	...props
}: React.ComponentProps<typeof FieldPrimitive.Root>) {
	return (
		<FieldPrimitive.Root
			data-slot="field-root"
			className={cn(field.root(), className as string)}
			{...props}
		/>
	);
}

// Label → Text.Label via render. O clique no label aciona o controle (vem do
// Base UI, não reimplementado). field.label traz só palette/estado; a
// tipografia (block/text-sm/font-semibold) vem do Text.Label.
function FieldLabel({
	className,
	...props
}: React.ComponentProps<typeof FieldPrimitive.Label>) {
	return (
		<FieldPrimitive.Label
			data-slot="field-label"
			render={<Text.Label />}
			className={cn(field.label(), className as string)}
			{...props}
		/>
	);
}

// Row — linha horizontal: body + addons "fora".
function FieldRow({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="field-row"
			className={cn(field.row(), className as string)}
			{...props}
		/>
	);
}

// Body — a caixa. Único lugar com borda/fundo/focus ring/altura/estado
// inválido. Recebe o controle nu (Field.Control + Input/Textarea/Numeric)
// como filho e, opcionalmente, insets "dentro".
function FieldBody({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="field-body"
			className={cn(field.body(), className as string)}
			{...props}
		/>
	);
}

// Control — passthrough que aplica field.control e recebe o controle nu
// (Fase 2) como filho. O controle (Input/Textarea/Numeric) já traz
// field.control; este slot existe para a API de namespace e para marcar o
// lugar do controle na composição.
function FieldControl({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="field-control"
			className={cn(field.control(), className as string)}
			{...props}
		/>
	);
}

// Addon (FORA) — irmão do body, dentro do row. data-side indica o lado.
function FieldAddon({
	side = "right",
	className,
	...props
}: React.ComponentProps<"div"> & { side?: "left" | "right" }) {
	return (
		<div
			data-slot="field-addon"
			data-side={side}
			className={cn(field.addon(), className as string)}
			{...props}
		/>
	);
}

// Description → Text.Paragraph via render. field.description traz só
// palette/estado; a tipografia vem do Text. Base UI registra o id no
// LabelableProvider → aria-describedby no controle.
function FieldDescription({
	className,
	...props
}: React.ComponentProps<typeof FieldPrimitive.Description>) {
	return (
		<FieldPrimitive.Description
			data-slot="field-description"
			render={<Text.Paragraph />}
			className={cn(field.description(), className as string)}
			{...props}
		/>
	);
}

// Error → Text.Error via render. match controla a visibilidade conforme o
// ValidityState do field (ex: match="valueMissing"). Base UI registra o id no
// LabelableProvider → aria-describedby; data-invalid aciona palette-danger.
function FieldError({
	className,
	match,
	...props
}: React.ComponentProps<typeof FieldPrimitive.Error> &
	Pick<React.ComponentProps<typeof FieldPrimitive.Error>, "match">) {
	return (
		<FieldPrimitive.Error
			data-slot="field-error"
			render={<Text.Error />}
			match={match}
			className={cn(field.error(), className as string)}
			{...props}
		/>
	);
}

export const Field = {
	Root: FieldRoot,
	Label: FieldLabel,
	Row: FieldRow,
	Body: FieldBody,
	Control: FieldControl,
	Addon: FieldAddon,
	Description: FieldDescription,
	Error: FieldError,
};
