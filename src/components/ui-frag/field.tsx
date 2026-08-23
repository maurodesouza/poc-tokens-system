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

// ChoiceRoot — row layout para controles marcáveis (checkbox, radio, switch).
// Diferente do Root: controle à esquerda, label à direita (não acima). Usa
// field.choiceRoot em vez de field.root. Reusa Label/Description/Error do field
// normal. Base UI Field fornece o mesmo wiring de a11y (Fase 5, #29).
function FieldChoiceRoot({
	className,
	...props
}: React.ComponentProps<typeof FieldPrimitive.Root>) {
	return (
		<FieldPrimitive.Root
			data-slot="field-choice-root"
			className={cn(field.choiceRoot(), className as string)}
			{...props}
		/>
	);
}

// Row — A CAIXA. Borda, fundo, altura, arredondamento e focus ring. Envolve o
// body e os addons; o overflow-hidden corta os cantos, então nenhum filho
// declara arredondamento. Focar o controle destaca o campo inteiro, addon
// incluído. (Correção: antes a borda estava no Body, o que exigia addon com
// borda própria + border-l-0/rounded-l-none para colar.)
function FieldRow({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="field-row"
			className={cn(field.row(), className as string)}
			{...props}
		/>
	);
}

// Body — área do controle dentro da caixa. Sem borda e sem fundo: quem desenha
// a caixa é o Row. Recebe o controle nu (Input/Textarea/Numeric) como filho e,
// opcionalmente, Insets "dentro".
function FieldBody({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="field-body"
			className={cn(field.body(), className as string)}
			{...props}
		/>
	);
}

// Inset (DENTRO) — filho do Body, dentro do padding. Ícone de busca, botão de
// olho na senha. Conceito DISTINTO do Addon: sem divisor e sem borda, vive
// dentro da área do controle.
//
// NÃO existe um Field.Control: os controles nus (Input/Textarea/Numeric) já
// são FieldPrimitive.Control e já aplicam field.control(). Um wrapper repetindo
// as mesmas classes criaria um elemento inútil e duplicaria o estilo.
function FieldInset({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="field-inset"
			className={cn(field.inset(), className as string)}
			{...props}
		/>
	);
}

// Addon (FORA) — irmão do body, dentro do row. data-side indica o lado em
// vocabulário lógico (architecture.md §8.2): inline-start/inline-end (eixo
// inline, inverte em RTL), block-start/block-end (eixo block, não inverte).
// Default inline-end (direita em LTR, esquerda em RTL). Lado é data-side,
// não variante (§8.4).
function FieldAddon({
	side = "inline-end",
	className,
	...props
}: React.ComponentProps<"div"> & {
	side?: "inline-start" | "inline-end" | "block-start" | "block-end";
}) {
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
	ChoiceRoot: FieldChoiceRoot,
	Label: FieldLabel,
	Row: FieldRow,
	Body: FieldBody,
	Inset: FieldInset,
	Addon: FieldAddon,
	Description: FieldDescription,
	Error: FieldError,
};
