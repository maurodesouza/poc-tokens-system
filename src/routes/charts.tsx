import { createFileRoute } from "@tanstack/react-router";
import { Text } from "#/components/atoms/text";
import { baseOption, Chart, steadyEmphasis } from "#/components/charts/chart";

export const Route = createFileRoute("/charts")({ component: Charts });

const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago"];

function Charts() {
	return (
		<div className="flex flex-col gap-8 p-8">
			<header className="flex flex-col gap-3">
				<Text.Heading as="h1">Gráficos</Text.Heading>
				<Text.Paragraph>
					ECharts com as cores vindas dos tokens do escopo. Cores de série são
					um eixo próprio — não são palettes: identidade de série é um job
					diferente de fundo/texto/traço, e cores de status são reservadas.
				</Text.Paragraph>
			</header>

			<div className="grid gap-8 lg:grid-cols-2">
				{/* 1. Série temporal — magnitude ao longo do tempo, 3 séries.
				    Crosshair + tooltip compartilhado é o default nessa forma. */}
				<Chart
					title="Receita por canal"
					caption="Três séries, com crosshair e tooltip compartilhado."
					option={(t) => ({
						...baseOption(t),
						color: t.series.slice(0, 3),
						tooltip: {
							...baseOption(t).tooltip,
							trigger: "axis",
							axisPointer: { type: "line" },
						},
						legend: {
							data: ["Orgânico", "Pago", "Indicação"],
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
							["Orgânico", [820, 932, 901, 934, 1290, 1330, 1320, 1450]],
							["Pago", [620, 680, 740, 690, 830, 910, 880, 960]],
							["Indicação", [320, 360, 390, 420, 450, 470, 510, 560]],
						].map(([name, data]) => ({
							name,
							data,
							type: "line",
							smooth: false,
							// marcas finas: linha de 2px, marcador ≥8px
							lineStyle: { width: 2 },
							symbolSize: 8,
							...steadyEmphasis,
						})),
					})}
				/>

				{/* 2. Comparação nominal — UMA série, sem legenda (o título nomeia).
				    Nunca colorir barras nominais pelo valor: gastaria o canal de
				    identidade re-codificando o que o comprimento já mostra. */}
				<Chart
					title="Pedidos por região"
					caption="Categoria nominal: uma série, um hue."
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
								// data-end arredondado, ancorado na baseline
								itemStyle: { borderRadius: [4, 4, 0, 0] },
								barMaxWidth: 36,
								...steadyEmphasis,
							},
						],
					})}
				/>

				{/* 3. Composição — barras empilhadas com 2px de respiro entre segmentos,
				    para a divisão não depender só da diferença de cor. */}
				<Chart
					title="Plano por trimestre"
					caption="Composição empilhada, com respiro de 2px entre segmentos."
					option={(t) => ({
						...baseOption(t),
						color: t.series.slice(0, 3),
						tooltip: { ...baseOption(t).tooltip, trigger: "axis" },
						legend: {
							data: ["Free", "Pro", "Enterprise"],
							textStyle: { color: t.accent },
							icon: "roundRect",
							itemWidth: 10,
							itemHeight: 10,
							bottom: 0,
						},
						grid: { ...baseOption(t).grid, bottom: 56 },
						xAxis: {
							...baseOption(t).xAxis,
							type: "category",
							data: ["Q1", "Q2", "Q3", "Q4"],
						},
						yAxis: { ...baseOption(t).yAxis, type: "value" },
						series: [
							["Free", [320, 302, 341, 374]],
							["Pro", [220, 282, 291, 334]],
							["Enterprise", [150, 212, 201, 254]],
						].map(([name, data]) => ({
							name,
							data,
							type: "bar",
							stack: "total",
							barMaxWidth: 48,
							// o respiro entre segmentos é a borda na cor da superfície
							itemStyle: { borderColor: t.base, borderWidth: 2 },
							...steadyEmphasis,
						})),
					})}
				/>

				{/* 4. Scatter com dataZoom — a forma que motivou sair do Recharts.
				    Em scatter QUALQUER par pode encostar, então vale o teste all-pairs:
				    só os 3 primeiros slots passam. Mais que 3 séries aqui pede facetas. */}
				<Chart
					title="Latência × throughput"
					caption="Scatter com zoom por arrasto. Máximo de 3 séries: em scatter qualquer par pode encostar."
					height={300}
					option={(t) => ({
						...baseOption(t),
						color: t.series.slice(0, 3),
						tooltip: { ...baseOption(t).tooltip, trigger: "item" },
						legend: {
							data: ["api", "worker", "cdn"],
							textStyle: { color: t.accent },
							icon: "circle",
							itemWidth: 10,
							itemHeight: 10,
							bottom: 0,
						},
						grid: { left: 56, right: 16, top: 16, bottom: 76 },
						dataZoom: [
							{ type: "inside" },
							{
								type: "slider",
								height: 18,
								bottom: 34,
								borderColor: t.line,
								fillerColor: t.soft,
								handleStyle: { color: t.accent },
								textStyle: { color: t.accent },
							},
						],
						xAxis: {
							...baseOption(t).xAxis,
							type: "value",
							name: "req/s",
							nameTextStyle: { color: t.accent },
							splitLine: { lineStyle: { color: t.line } },
						},
						yAxis: {
							...baseOption(t).yAxis,
							type: "value",
							name: "ms",
							nameTextStyle: { color: t.accent },
						},
						series: [
							["api", seededScatter(1, 40, 120, 900)],
							["worker", seededScatter(2, 40, 240, 400)],
							["cdn", seededScatter(3, 40, 40, 1600)],
						].map(([name, data]) => ({
							name,
							data,
							type: "scatter",
							symbolSize: 9,
							// anel de 2px na cor da superfície separa marcas sobrepostas
							itemStyle: { borderColor: t.base, borderWidth: 2 },
							...steadyEmphasis,
						})),
					})}
				/>
			</div>

			{/* Tematização por feature — o eixo ORDINAL é o que aceita a cor da
			    palette. Aplique a palette no container e a rampa acompanha. */}
			<section className="flex flex-col gap-4">
				<div className="flex flex-col gap-1">
					<Text.Heading as="h3">Gráficos tematizados por feature</Text.Heading>
					<Text.Paragraph>
						Estes três são o mesmo gráfico, mudando só a palette do container. A
						rampa é derivada do `base`, então acompanha a feature.
					</Text.Paragraph>
				</div>
				<div className="grid gap-6 lg:grid-cols-3">
					{[
						["palette-orange", "Faturamento"],
						["palette-purple", "Analytics"],
						["palette-green", "Integrações"],
					].map(([palette, label]) => (
						<div key={palette}>
							<Chart
								title={label}
								palette={palette}
								debug
								caption="Faixas de uso — ordinal, uma cor."
								height={200}
								option={(t) => ({
									...baseOption(t),
									color: t.ramp,
									tooltip: { ...baseOption(t).tooltip, trigger: "item" },
									xAxis: {
										...baseOption(t).xAxis,
										type: "category",
										data: ["0-1k", "1-5k", "5-20k", "20-50k", "50k+"],
									},
									yAxis: { ...baseOption(t).yAxis, type: "value" },
									series: [
										{
											type: "bar",
											data: [1820, 1490, 980, 540, 210],
											itemStyle: { borderRadius: [4, 4, 0, 0] },
											barMaxWidth: 28,
											// ordinal: a cor carrega a ordem, um passo por barra
											colorBy: "data",
											...steadyEmphasis,
										},
									],
								})}
							/>
						</div>
					))}
				</div>
			</section>

			<section className="flex flex-col gap-2 rounded-lg border border-palette-line p-5">
				<Text.Strong>O que este teste responde</Text.Strong>
				<ul className="flex list-disc flex-col gap-1 ps-5">
					<li>
						<Text.Paragraph>
							Cores de série <Text.Strong>não cabem</Text.Strong> nos 6 papéis —
							identidade de série é um job próprio. Viraram{" "}
							<Text.Strong>--chart-1..8</Text.Strong>, fora do contrato.
						</Text.Paragraph>
					</li>
					<li>
						<Text.Paragraph>
							Canvas não resolve CSS var. Este é o único ponto do projeto onde a
							cor passa por JS (<Text.Strong>useChartTheme</Text.Strong>), lendo
							do elemento para respeitar palette de subárvore.
						</Text.Paragraph>
					</li>
					<li>
						<Text.Paragraph>
							Trocar tema exige recriar o gráfico — o wrapper usa `key` para
							isso. Confirme trocando light/dark no header.
						</Text.Paragraph>
					</li>
					<li>
						<Text.Paragraph>
							<Text.Strong>Tematizável só o eixo ordinal.</Text.Strong> A rampa
							deriva do `base` da palette do escopo, então segue a feature.
							Identidade de série não segue: a segurança para daltonismo depende
							de hues específicos, e cinco tons da mesma cor não distinguem
							"qual série é qual".
						</Text.Paragraph>
					</li>
				</ul>
			</section>
		</div>
	);
}

/** Dados determinísticos — sem Math.random, para o teste ser reproduzível. */
function seededScatter(seed: number, n: number, baseY: number, baseX: number) {
	let s = seed * 9301;
	const next = () => {
		s = (s * 9301 + 49297) % 233280;
		return s / 233280;
	};
	return Array.from({ length: n }, () => [
		Math.round(baseX * (0.4 + next() * 1.2)),
		Math.round(baseY * (0.5 + next() * 1.4)),
	]);
}
