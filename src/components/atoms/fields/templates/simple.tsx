import type * as React from "react";
import { field } from "#/components/families/field";
import { Field } from "#/components/ui-frag/field";
import { Input } from "../input";

// Input.Template.Simple — o caso que mais aperta (Fase 4, #28 §4.4).
// label, description, error, required, addon dentro (inset), addon fora —
// todas legítimas pela regra 2 (conteúdo/comportamento). Sobrevive com 7 props.
//
// As três regras (§4.2):
// 1. Zero estilo próprio — nenhuma classe, tv(), ou className hardcoded além
//    do field.inset() no inset, que é peça da família (não estilo do template).
// 2. Zero props de aparência — sem variant, size, color, contentClassName.
// 3. Um className único, indo para a peça principal (body) — canal da palette.
//
// Proibido: contentProps / slotProps / *Props genéricos. Props achatadas.
//
// Teto de 7 props (§4.3): label, description, error, required, inset, addon,
// className. Props do input (value, onChange, name, placeholder, type, etc.)
// são encaminhadas via ...props — são comportamento, não configuração do
// template. Se precisar da oitava, parar e registrar.

type SimpleProps = Omit<React.ComponentProps<typeof Input>, "className"> & {
	label?: React.ReactNode;
	description?: React.ReactNode;
	error?: React.ReactNode;
	required?: boolean;
	inset?: React.ReactNode;
	addon?: React.ReactNode;
	className?: string;
};

function Simple({
	label: labelContent,
	description,
	error,
	required,
	inset,
	addon,
	className,
	...inputProps
}: SimpleProps) {
	return (
		<Field.Root>
			{labelContent ? (
				<Field.Label>
					{labelContent}
					{required ? <span aria-hidden="true">*</span> : null}
				</Field.Label>
			) : null}
			<Field.Row>
				<Field.Body className={className as string}>
					{inset ? <span className={field.inset()}>{inset}</span> : null}
					<Input {...inputProps} required={required} />
				</Field.Body>
				{addon ? <Field.Addon side="right">{addon}</Field.Addon> : null}
			</Field.Row>
			{description ? (
				<Field.Description>{description}</Field.Description>
			) : null}
			{error ? <Field.Error>{error}</Field.Error> : null}
		</Field.Root>
	);
}

export { Simple as TemplateSimple };
