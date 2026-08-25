import { createFileRoute } from "@tanstack/react-router";
import { Checkbox } from "#/components/atoms/choice/checkbox";
import { Switch } from "#/components/atoms/choice/switch";
import { Clickable } from "#/components/atoms/clickable";
import { Input } from "#/components/atoms/fields";
import { Text } from "#/components/atoms/text";
import { Field } from "#/components/ui-frag/field";
import { RadioGroup } from "#/components/ui-frag/radio-group";

export const Route = createFileRoute("/feature-themes")({
	component: FeatureThemes,
});

// Tematização por feature — comparação lado a lado.
//
// DUAS palettes por feature, cada uma internamente coerente:
//
//   palette-<feature>          cromática completa (como brand/danger). Vai onde
//                              a cor É o elemento: CTA, controle marcado.
//   palette-<feature>-surface  superfície (como surface/raised) com `ring` na
//                              cor da feature. Vai no container e nos campos.
//
// Nenhuma mistura papéis de origens diferentes. Precisou de outro contexto?
// Cria mais uma palette — o contrato é fechado, o número de palettes é livre.
//
// O 7º papel (`ring`) é o que torna a segunda palette possível: sem ele, texto e
// foco leriam o mesmo token e tematizar um tematizaria o outro.

type Panel = {
	label: string;
	/** palette cromática — CTA e controles marcados. Vazio = herda o contexto. */
	accent: string;
	/** palette de superfície — container e campos. Vazio = surface padrão. */
	surface: string;
};

const PANELS: Panel[] = [
	{ label: "Padrão (sem feature)", accent: "", surface: "" },
	{
		label: "Faturamento",
		accent: "palette-orange",
		surface: "palette-orange-surface",
	},
	{
		label: "Analytics",
		accent: "palette-purple",
		surface: "palette-purple-surface",
	},
	{
		label: "Integrações",
		accent: "palette-green",
		surface: "palette-green-surface",
	},
];

function FeatureThemes() {
	return (
		<div className="flex flex-col gap-6 p-8">
			<header className="flex flex-col gap-3">
				<Text.Heading as="h1">Tematização por feature</Text.Heading>
				<Text.Paragraph>
					As quatro janelas têm exatamente o mesmo conteúdo. A primeira usa a
					superfície padrão; as outras três, a palette de superfície da feature.
					CTA e controles marcados recebem a palette cromática.
				</Text.Paragraph>
			</header>

			<div className="grid gap-5 lg:grid-cols-2">
				{PANELS.map((panel) => (
					<Panel key={panel.label} {...panel} />
				))}
			</div>

			<section className="flex flex-col gap-2 rounded-lg border border-palette-line p-5">
				<Text.Strong>O que comparar entre as janelas</Text.Strong>
				<ul className="flex list-disc flex-col gap-1 ps-5">
					<li>
						<Text.Paragraph>
							<Text.Strong>Botão sólido e controles marcados</Text.Strong> —
							devem mudar de cor entre as janelas.
						</Text.Paragraph>
					</li>
					<li>
						<Text.Paragraph>
							<Text.Strong>Foco</Text.Strong> — clique num campo: o outline
							acompanha a feature.
						</Text.Paragraph>
					</li>
					<li>
						<Text.Paragraph>
							<Text.Strong>Fundo, borda e texto dos campos</Text.Strong> — devem
							ficar idênticos nas quatro.
						</Text.Paragraph>
					</li>
					<li>
						<Text.Paragraph>
							<Text.Strong>Campo inválido</Text.Strong> — vermelho nas quatro. O
							`[data-invalid]` aplica a palette danger e vence a da feature.
						</Text.Paragraph>
					</li>
					<li>
						<Text.Paragraph>
							<Text.Strong>Controles desmarcados</Text.Strong> — herdam a
							superfície, então ficam neutros nas quatro.
						</Text.Paragraph>
					</li>
				</ul>
			</section>
		</div>
	);
}

function Panel({ label, accent, surface }: Panel) {
	return (
		<section
			className={`${surface} flex flex-col gap-5 rounded-lg border border-palette-line p-5`}
		>
			<div className="flex items-baseline justify-between gap-3">
				<Text.Heading as="h3">{label}</Text.Heading>
				<Text.Small>{surface || "palette-surface"}</Text.Small>
			</div>

			{/* Botões */}
			<div className="flex flex-wrap gap-2">
				<Clickable.Button variant="solid" className={accent}>
					Salvar
				</Clickable.Button>
				<Clickable.Button variant="outline">Cancelar</Clickable.Button>
				<Clickable.Button variant="ghost">Ver mais</Clickable.Button>
			</div>

			{/* Campo normal */}
			<Field.Root>
				<Field.Label>Nome do projeto</Field.Label>
				<Field.Row>
					<Field.Body>
						<Input placeholder="ex: relatório mensal" />
					</Field.Body>
				</Field.Row>
				<Field.Description>
					Clique no campo para ver o outline de foco.
				</Field.Description>
			</Field.Root>

			{/* Campo inválido */}
			<Field.Root invalid>
				<Field.Label>E-mail</Field.Label>
				<Field.Row>
					<Field.Body>
						<Input defaultValue="não-é-um-email" />
					</Field.Body>
				</Field.Row>
				<Field.Error match>Informe um e-mail válido.</Field.Error>
			</Field.Root>

			{/* Booleanos */}
			<div className="flex flex-col gap-3">
				<Field.ChoiceRoot>
					<Checkbox defaultChecked />
					<Field.Label>Notificar equipe (marcado)</Field.Label>
				</Field.ChoiceRoot>
				<Field.ChoiceRoot>
					<Checkbox />
					<Field.Label>Arquivar automaticamente</Field.Label>
				</Field.ChoiceRoot>

				<Field.ChoiceRoot>
					<Switch defaultChecked />
					<Field.Label>Modo avançado (marcado)</Field.Label>
				</Field.ChoiceRoot>
				<Field.ChoiceRoot>
					<Switch />
					<Field.Label>Somente leitura</Field.Label>
				</Field.ChoiceRoot>

				<RadioGroup.Root defaultValue="auto">
					<Field.ChoiceRoot>
						<RadioGroup.Item value="auto" />
						<Field.Label>Automático (marcado)</Field.Label>
					</Field.ChoiceRoot>
					<Field.ChoiceRoot>
						<RadioGroup.Item value="manual" />
						<Field.Label>Manual</Field.Label>
					</Field.ChoiceRoot>
				</RadioGroup.Root>
			</div>

			<Text.Paragraph>
				Este parágrafo usa a cor de texto padrão e deve ficar igual nas quatro
				janelas.
			</Text.Paragraph>
		</section>
	);
}
