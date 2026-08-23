import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Checkbox } from "#/components/atoms/choice/checkbox";
import { Switch } from "#/components/atoms/choice/switch";
import { Clickable } from "#/components/atoms/clickable";
import { Input, Numeric, Textarea } from "#/components/atoms/fields";
import { Text } from "#/components/atoms/text";
import { field } from "#/components/families/field";
import { Field } from "#/components/ui-frag/field";
import { RadioGroup } from "#/components/ui-frag/radio-group";
import { Select } from "#/components/ui-frag/select";

export const Route = createFileRoute("/field-playground")({
	component: FieldPlayground,
});

const THEMES = ["light", "dark"] as const;
const DENSITIES = ["default", "compact"] as const;

function FieldPlayground() {
	const [theme, setTheme] = useState<(typeof THEMES)[number]>("light");
	const [density, setDensity] = useState<(typeof DENSITIES)[number]>("default");

	function applyTheme(next: (typeof THEMES)[number]) {
		document.documentElement.dataset.theme = next;
		setTheme(next);
	}

	function applyDensity(next: (typeof DENSITIES)[number]) {
		document.documentElement.dataset.density = next;
		setDensity(next);
	}

	return (
		<div className="flex flex-col gap-8 p-8 max-w-2xl">
			<header className="flex flex-col gap-4">
				<Text.Heading as="h1">Field Playground</Text.Heading>
				<div className="flex gap-4">
					<div className="flex gap-2">
						{THEMES.map((t) => (
							<Clickable.Button
								key={t}
								variant={theme === t ? "solid" : "outline"}
								onClick={() => applyTheme(t)}
							>
								{t}
							</Clickable.Button>
						))}
					</div>
					<div className="flex gap-2">
						{DENSITIES.map((d) => (
							<Clickable.Button
								key={d}
								variant={density === d ? "solid" : "outline"}
								onClick={() => applyDensity(d)}
							>
								{d}
							</Clickable.Button>
						))}
					</div>
				</div>
			</header>

			<section className="flex flex-col gap-6">
				<Text.Heading as="h2">Composition</Text.Heading>

				{/* Input com label, description, error */}
				<Field.Root
					validate={() => "Campo obrigatório"}
					validationMode="onChange"
				>
					<Field.Label>Nome</Field.Label>
					<Field.Row>
						<Field.Body>
							<Input placeholder="Seu nome" required />
						</Field.Body>
					</Field.Row>
					<Field.Description>Como aparece no perfil.</Field.Description>
					<Field.Error>Campo obrigatório</Field.Error>
				</Field.Root>

				{/* Input com addon fora */}
				<Field.Root>
					<Field.Label>Peso</Field.Label>
					<Field.Row>
						<Field.Body>
							<Input type="number" placeholder="70" />
						</Field.Body>
						<Field.Addon side="right">Kg</Field.Addon>
					</Field.Row>
				</Field.Root>

				{/* Input com addon dentro (inset) */}
				<Field.Root>
					<Field.Label>Buscar</Field.Label>
					<Field.Row>
						<Field.Body>
							<span className={field.inset()}>🔍</span>
							<Input placeholder="Pesquisar..." />
						</Field.Body>
					</Field.Row>
				</Field.Root>

				{/* Textarea */}
				<Field.Root>
					<Field.Label>Bio</Field.Label>
					<Field.Row>
						<Field.Body>
							<Textarea rows={3} placeholder="Sobre você" />
						</Field.Body>
					</Field.Row>
					<Field.Description>Máx 200 caracteres.</Field.Description>
				</Field.Root>

				{/* Numeric */}
				<Field.Root>
					<Field.Label>Idade</Field.Label>
					<Field.Row>
						<Field.Body>
							<Numeric min={0} max={120} step={1} placeholder="25" />
						</Field.Body>
					</Field.Row>
				</Field.Root>

				{/* Select */}
				<Field.Root>
					<Field.Label>País</Field.Label>
					<Select.Root defaultValue="br">
						<Select.Trigger>
							<Select.Value />
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="br">Brasil</Select.Item>
							<Select.Item value="us">Estados Unidos</Select.Item>
							<Select.Item value="pt">Portugal</Select.Item>
						</Select.Content>
					</Select.Root>
				</Field.Root>

				{/* Checkbox via ChoiceRoot */}
				<Field.ChoiceRoot>
					<Checkbox />
					<div className="flex flex-col gap-xs">
						<Field.Label>Aceito os termos</Field.Label>
						<Field.Description>Leia antes de aceitar.</Field.Description>
					</div>
				</Field.ChoiceRoot>

				{/* Switch via ChoiceRoot */}
				<Field.ChoiceRoot>
					<Switch />
					<div className="flex flex-col gap-xs">
						<Field.Label>Notificações</Field.Label>
					</div>
				</Field.ChoiceRoot>

				{/* RadioGroup */}
				<Field.Root>
					<Field.Label>Plano</Field.Label>
					<RadioGroup.Root defaultValue="free">
						<div className={field.choiceRoot()}>
							<RadioGroup.Item value="free" />
							<Field.Label>Free</Field.Label>
						</div>
						<div className={field.choiceRoot()}>
							<RadioGroup.Item value="pro" />
							<Field.Label>Pro</Field.Label>
						</div>
					</RadioGroup.Root>
				</Field.Root>
			</section>

			<section className="flex flex-col gap-6">
				<Text.Heading as="h2">Template</Text.Heading>

				{/* Input.Template.Simple — completo */}
				<Input.Template.Simple
					label="Email"
					description="Não compartilhamos."
					error="Email inválido"
					required
					inset={<span>@</span>}
					addon=".com"
					type="email"
					placeholder="seu@email"
				/>

				{/* Input.Template.Simple — mínimo */}
				<Input.Template.Simple label="Telefone" placeholder="(11) 99999-9999" />

				{/* Input.Template.Simple — palette danger */}
				<Input.Template.Simple
					label="CPF"
					className="palette-danger"
					placeholder="000.000.000-00"
				/>
			</section>
		</div>
	);
}
