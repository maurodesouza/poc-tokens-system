"use client";

import type { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { Radio } from "#/components/atoms/choice/radio";
import { cn } from "#/utils/tailwind";

// Composition RadioGroup — grupo de radios com palette. Base UI RadioGroup
// se integra com Field.Root via useFieldRootContext (a11y wiring automático).
// Item é o radio nu; o usuário compõe com Field.Label em um wrapper
// field.choiceRoot() para o layout controle+label ao lado.

function RadioGroupRoot({ className, ...props }: RadioGroupPrimitive.Props) {
	return (
		<RadioGroupPrimitive
			data-slot="radio-group"
			className={cn("flex flex-col gap-sm", className as string)}
			{...props}
		/>
	);
}

function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
	return <Radio className={className as string} {...props} />;
}

export const RadioGroup = {
	Root: RadioGroupRoot,
	Item: RadioGroupItem,
};
