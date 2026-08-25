import { MailIcon, SendIcon } from "lucide-react";
import { Checkbox } from "#/components/atoms/choice/checkbox";
import { Switch } from "#/components/atoms/choice/switch";
import { Clickable } from "#/components/atoms/clickable";
import { Input } from "#/components/atoms/fields";
import { Text } from "#/components/atoms/text";
import { baseOption, Chart, steadyEmphasis } from "#/components/charts/chart";
import { field } from "#/components/families/field";
import { Field } from "#/components/ui-frag/field";
import { RadioGroup } from "#/components/ui-frag/radio-group";

// Painel de uma feature individual — usado pelas rotas /features/<cor>.
//
// Envolve todo o conteúdo na palette de superfície da feature (campos e
// container) e aplica a palette cromática no CTA e controles marcados. É o
// mesmo esquema do feature-themes "todos juntos", mas numa página dedicada —
// sem a comparação lado a lado, focado em ver a feature isolada.
//
// Conteúdo: botões, field simples, field com addon, field com inset, field
// inválido, 2 checkboxes, 2 switches, 2 radios, 2 charts lado a lado.

const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];

type FeaturePanelProps = {
	/** Nome de exibição da feature. */
	label: string;
	/** Palette cromática — CTA e controles marcados. */
	accent: string;
	/** Palette de superfície — container e campos. */
	surface: string;
};

export function FeaturePanel({ label, accent, surface }: FeaturePanelProps) {
	return (
		<section
			className={`${surface} flex flex-col gap-6 rounded-lg border border-palette-line p-6`}
		>
			<div className="flex items-baseline justify-between gap-3">
				<Text.Heading as="h2">{label}</Text.Heading>
				<Text.Small>{surface}</Text.Small>
			</div>

			{/* Botões */}
			<div className="flex flex-wrap gap-2">
				<Clickable.Button variant="solid" className={accent}>
					Salvar
				</Clickable.Button>
				<Clickable.Button variant="outline">Cancelar</Clickable.Button>
				<Clickable.Button variant="ghost">Ver mais</Clickable.Button>
			</div>

			{/* Field simples */}
			<Field.Root>
				<Field.Label>Nome do projeto</Field.Label>
				<Field.Row>
					<Field.Body>
						<Input placeholder="ex: relatório mensal" />
					</Field.Body>
				</Field.Row>
				<Field.Description>
					Clique no campo para ver o outline de foco da feature.
				</Field.Description>
			</Field.Root>

			{/* Field com addon (ícone + botão no fim) */}
			<Field.Root>
				<Field.Label>Busca com addon</Field.Label>
				<Field.Row>
					<Field.Body>
						<Input placeholder="Pesquisar" />
					</Field.Body>
					<Field.Addon side="inline-end">
						<Clickable.Button variant="ghost" shape="square" size="sm">
							<SendIcon />
						</Clickable.Button>
					</Field.Addon>
				</Field.Row>
			</Field.Root>

			{/* Field com inset (ícone + botão no fim, sem divisor) */}
			<Field.Root>
				<Field.Label>Busca com inset</Field.Label>
				<Field.Row>
					<Field.Body>
						<Input placeholder="seu@email" type="email" />
						<span className={field.inset()}>
							<MailIcon />
						</span>
					</Field.Body>
				</Field.Row>
			</Field.Root>

			{/* Field inválido */}
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

			{/* Charts lado a lado */}
			<div className="grid gap-6 lg:grid-cols-2">
				<Chart
					title={`${label} — volume`}
					caption="Categoria nominal: uma série, um hue."
					palette={accent}
					option={(t) => ({
						...baseOption(t),
						color: [t.series[0]],
						tooltip: { ...baseOption(t).tooltip, trigger: "item" },
						xAxis: {
							...baseOption(t).xAxis,
							type: "category",
							data: ["Sul", "Sudeste", "Centro", "Nordeste", "Norte"],
						},
						yAxis: { ...baseOption(t).yAxis, type: "value" },
						series: [
							{
								type: "bar",
								data: [1240, 2310, 890, 1670, 620],
								itemStyle: { borderRadius: [4, 4, 0, 0] },
								barMaxWidth: 36,
								...steadyEmphasis,
							},
						],
					})}
				/>

				<Chart
					title={`${label} — tendência`}
					caption="Série temporal, duas séries."
					palette={accent}
					option={(t) => ({
						...baseOption(t),
						color: t.series.slice(0, 2),
						tooltip: {
							...baseOption(t).tooltip,
							trigger: "axis",
							axisPointer: { type: "line" },
						},
						legend: {
							data: ["Atual", "Anterior"],
							textStyle: { color: t.accent },
							icon: "roundRect",
							itemWidth: 10,
							itemHeight: 10,
							bottom: 0,
						},
						grid: { ...baseOption(t).grid, bottom: 56 },
						xAxis: { ...baseOption(t).xAxis, type: "category", data: MONTHS },
						yAxis: { ...baseOption(t).yAxis, type: "value" },
						series: [
							["Atual", [820, 932, 901, 934, 1290, 1330]],
							["Anterior", [620, 680, 740, 690, 830, 910]],
						].map(([name, data]) => ({
							name,
							data,
							type: "line",
							lineStyle: { width: 2 },
							symbolSize: 8,
							...steadyEmphasis,
						})),
					})}
				/>
			</div>
		</section>
	);
}
