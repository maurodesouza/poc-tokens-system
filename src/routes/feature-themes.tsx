import { createFileRoute } from "@tanstack/react-router";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "#/components/atoms/choice/checkbox";
import { Switch } from "#/components/atoms/choice/switch";
import { Clickable } from "#/components/atoms/clickable";
import { Input } from "#/components/atoms/fields";
import { Text } from "#/components/atoms/text";
import { field } from "#/components/families/field";
import { Field } from "#/components/ui-frag/field";
import { RadioGroup } from "#/components/ui-frag/radio-group";
import { Select } from "#/components/ui-frag/select";

export const Route = createFileRoute("/feature-themes")({
	component: FeatureThemes,
});

// Tematização por feature — cada área do app tem sua cor de destaque.
//
// As palettes de feature são HÍBRIDAS: `soft`, `line` e `accent` copiados da
// surface (fundo, borda e TEXTO ficam neutros), enquanto `base` e `ring` levam a
// cor da feature — CTA e foco. `contrast` é escolhido pelo contraste com o base,
// não copiado.
//
// O 7º papel (`ring`) existe justamente para isto: antes, texto e foco liam o
// mesmo token (`accent`) e tematizar um tematizava o outro.
//
// Só é possível porque os 6 papéis são independentes: numa rampa numérica
// (tone-100..500) os cinco passos seriam a mesma cor por construção.
const FEATURES = [
	{ id: "orange", label: "Faturamento", palette: "palette-feature-orange" },
	{ id: "purple", label: "Analytics", palette: "palette-feature-purple" },
	{ id: "green", label: "Integrações", palette: "palette-feature-green" },
] as const;

const THEMES = ["light", "dark"] as const;

function FeatureThemes() {
	const [theme, setTheme] = useState<(typeof THEMES)[number]>("light");

	function applyTheme(next: (typeof THEMES)[number]) {
		setTheme(next);
		document.documentElement.dataset.theme = next;
	}

	return (
		<div className="flex flex-col gap-8 p-8">
			<header className="flex flex-col gap-3">
				<Text.Heading as="h1">Tematização por feature</Text.Heading>
				<Text.Link to="/">← Voltar para a home</Text.Link>
				<Text.Paragraph>
					Cada coluna aplica uma palette diferente no container. CTA e foco
					acompanham a cor da feature; superfície, bordas e texto de corpo
					permanecem neutros.
				</Text.Paragraph>
				<div className="flex gap-2">
					{THEMES.map((t) => (
						<Clickable.Button
							key={t}
							size="sm"
							variant={theme === t ? "solid" : "outline"}
							className="palette-brand"
							onClick={() => applyTheme(t)}
						>
							{t}
						</Clickable.Button>
					))}
				</div>
			</header>

			<div className="grid gap-6 md:grid-cols-3">
				{FEATURES.map((feature) => (
					<section
						key={feature.id}
						className={`${feature.palette} flex flex-col gap-5 rounded-lg border border-palette-line p-5`}
					>
						<Text.Heading as="h3">{feature.label}</Text.Heading>

						{/* CTA — deve pegar a cor da feature */}
						<div className="flex flex-wrap gap-2">
							<Clickable.Button variant="solid">Criar</Clickable.Button>
							<Clickable.Button variant="outline">Cancelar</Clickable.Button>
							<Clickable.Button variant="ghost">Ver mais</Clickable.Button>
						</div>

						{/* Campo — foco deve pegar a cor da feature */}
						<Field.Root>
							<Field.Label>Buscar</Field.Label>
							<Field.Row>
								<Field.Inset>
									<SearchIcon />
								</Field.Inset>
								<Field.Body>
									<Input placeholder="Digite para filtrar" />
								</Field.Body>
							</Field.Row>
							<Field.Description>
								Clique no campo para ver o outline.
							</Field.Description>
						</Field.Root>

						<Field.Root>
							<Field.Label>Período</Field.Label>
							<Select.Root defaultValue="30">
								<Field.Row>
									<Field.Body>
										<Select.Trigger>
											<Select.Value />
										</Select.Trigger>
										<Select.Content>
											<Select.Item value="7">7 dias</Select.Item>
											<Select.Item value="30">30 dias</Select.Item>
											<Select.Item value="90">90 dias</Select.Item>
										</Select.Content>
									</Field.Body>
								</Field.Row>
							</Select.Root>
						</Field.Root>

						{/* Controles booleanos — o estado marcado usa `base`, então deve
						    pegar a cor da feature; o foco usa `ring`. */}
						<div className="flex flex-col gap-3">
							<Text.Strong>Controles booleanos</Text.Strong>

							<Field.ChoiceRoot>
								<Checkbox defaultChecked />
								<div className="flex flex-col gap-1">
									<Field.Label>Notificar equipe</Field.Label>
									<Field.Description>
										Marcado — deve usar a cor da feature.
									</Field.Description>
								</div>
							</Field.ChoiceRoot>

							<Field.ChoiceRoot>
								<Checkbox />
								<Field.Label>Arquivar automaticamente</Field.Label>
							</Field.ChoiceRoot>

							<Field.ChoiceRoot>
								<Switch defaultChecked />
								<Field.Label>Modo avançado</Field.Label>
							</Field.ChoiceRoot>

							<Field.ChoiceRoot>
								<Switch />
								<Field.Label>Somente leitura</Field.Label>
							</Field.ChoiceRoot>

							<RadioGroup.Root defaultValue="auto">
								<Field.ChoiceRoot>
									<RadioGroup.Item value="auto" />
									<Field.Label>Automático</Field.Label>
								</Field.ChoiceRoot>
								<Field.ChoiceRoot>
									<RadioGroup.Item value="manual" />
									<Field.Label>Manual</Field.Label>
								</Field.ChoiceRoot>
							</RadioGroup.Root>
						</div>

						{/* Texto de corpo — deve permanecer neutro */}
						<Text.Paragraph>
							Este parágrafo usa a cor de texto padrão e não deve mudar entre as
							colunas.
						</Text.Paragraph>
					</section>
				))}
			</div>

			{/* O que observar */}
			<section className="flex flex-col gap-3 rounded-lg border border-palette-line p-5">
				<Text.Heading as="h3">O que verificar</Text.Heading>
				<ul className="flex list-disc flex-col gap-1 ps-5">
					<li>
						<Text.Paragraph>
							<Text.Strong>Botão sólido</Text.Strong> — deve ser laranja, roxo e
							verde nas três colunas.
						</Text.Paragraph>
					</li>
					<li>
						<Text.Paragraph>
							<Text.Strong>Foco do campo</Text.Strong> — clique num input: o
							outline deve ser da cor da feature.
						</Text.Paragraph>
					</li>
					<li>
						<Text.Paragraph>
							<Text.Strong>Fundo e borda dos campos</Text.Strong> — devem ficar
							neutros e idênticos nas três colunas.
						</Text.Paragraph>
					</li>
					<li>
						<Text.Paragraph>
							<Text.Strong>Parágrafo de corpo</Text.Strong> — deve ficar neutro
							nas três.
						</Text.Paragraph>
					</li>
					<li>
						<Text.Paragraph>
							<Text.Strong>Checkbox, switch e radio marcados</Text.Strong> — o
							preenchimento usa `base`, então deve pegar a cor da feature. Os
							desmarcados usam `soft` e devem ficar neutros.
						</Text.Paragraph>
					</li>
					<li>
						<Text.Paragraph>
							<Text.Strong>Texto digitado no input</Text.Strong> — deve ficar
							neutro nas três, mesmo com o foco colorido.
						</Text.Paragraph>
					</li>
				</ul>
				<div
					className={field.row({ className: "flex-col items-start gap-2 p-4" })}
				>
					<Text.Strong>Tensão conhecida no contrato</Text.Strong>
					<Text.Paragraph>
						O texto do controle e o outline de foco leem o mesmo token
						(`accent`). Tematizar um tematiza o outro. Se o texto digitado
						precisar ficar neutro com o foco colorido, o contrato precisa de um
						token separado para destaque de interação.
					</Text.Paragraph>
				</div>
			</section>
		</div>
	);
}
