import ReactECharts from "echarts-for-react";
import { useState } from "react";
import { Text } from "#/components/atoms/text";
import {
	type ChartTheme,
	FRAME_TOKENS,
	RAMP_TOKENS,
	SERIES_TOKENS,
	useChartTheme,
} from "#/hooks/use-chart-theme";

// Wrapper mínimo de propósito: expõe a config do ECharts crua e só injeta o tema
// resolvido. Embrulhar a API recriaria a limitação que motivou sair do Recharts.

const OFFSCREEN: React.CSSProperties = {
	position: "absolute",
	width: 1,
	height: 1,
	overflow: "hidden",
	clip: "rect(0 0 0 0)",
	whiteSpace: "nowrap",
};

/** Aplica cada token a `color` para que o browser avalie a função de cor. */
function ColorProbes({ tokens }: { tokens: readonly string[] }) {
	return (
		<>
			{tokens.map((token) => (
				<span
					key={token}
					data-token={token}
					style={{ color: `var(${token})` }}
				/>
			))}
		</>
	);
}

type ChartProps = {
	title: string;
	/**
	 * Palette das MARCAS — precisa ser CROMÁTICA. Derivar da surface produziria
	 * branco (base = oklch(1 0 0), chroma 0). Default: palette-brand.
	 * A moldura fica sempre na superfície, independente disto.
	 */
	palette?: string;
	/** Recebe o tema resolvido e devolve a config do ECharts. */
	option: (t: ChartTheme) => Record<string, unknown>;
	height?: number;
	/** Legenda textual da figura — obrigatória quando há ≥2 séries. */
	caption?: string;
	/** Mostra as cores resolvidas pelas sondas — para conferir a derivação. */
	debug?: boolean;
};

export function Chart({
	title,
	option,
	height = 260,
	caption,
	palette = "palette-brand",
	debug,
}: ChartProps) {
	const [markHost, setMarkHost] = useState<HTMLElement | null>(null);
	const [frameHost, setFrameHost] = useState<HTMLElement | null>(null);
	const theme = useChartTheme(markHost, frameHost);

	return (
		<figure className="relative flex flex-col gap-2">
			{/* Sondas das MARCAS — dentro da palette pedida. */}
			<span
				ref={setMarkHost}
				className={palette}
				style={OFFSCREEN}
				aria-hidden="true"
			>
				<ColorProbes tokens={[...SERIES_TOKENS, ...RAMP_TOKENS]} />
			</span>

			{/* Sondas da MOLDURA — fora da palette, herdam a superfície. */}
			<span ref={setFrameHost} style={OFFSCREEN} aria-hidden="true">
				<ColorProbes tokens={FRAME_TOKENS} />
			</span>

			<figcaption className="flex flex-col gap-1">
				<Text.Strong>{title}</Text.Strong>
				{caption && <Text.Small>{caption}</Text.Small>}
			</figcaption>

			{theme && debug && (
				<div className="flex flex-wrap gap-1">
					{[...SERIES_TOKENS, ...RAMP_TOKENS].map((token, i) => (
						<span
							key={token}
							className="h-5 w-5 rounded border border-palette-line"
							style={{ backgroundColor: [...theme.series, ...theme.ramp][i] }}
							title={`${token}: ${[...theme.series, ...theme.ramp][i]}`}
						/>
					))}
				</div>
			)}

			{theme && (
				// key força recriar quando o tema muda: canvas não reage a CSS var
				<ReactECharts
					key={theme.mode}
					option={option(theme)}
					style={{ height }}
					opts={{ renderer: "canvas" }}
				/>
			)}
		</figure>
	);
}

/**
 * Emphasis estável — espalhe em toda série.
 *
 * Sem isto o ECharts aplica `liftColor` na marca em hover (echarts/lib/util/
 * states.js): ele CLAREIA a cor, e com uma cor já clara a marca vira branco e
 * some. A palavra-chave que desliga esse comportamento é literalmente
 * `'inherit'` — o código testa `emphasisStyle.fill === 'inherit'` e, só nesse
 * caso, reusa a cor original. Qualquer outra propriedade (opacity, scale) não
 * conta como fill e o lift acontece assim mesmo.
 *
 * `itemStyle` cobre barras, pontos e símbolos; `lineStyle` cobre o traço das
 * linhas, que tem stroke e não fill.
 */
export const steadyEmphasis = {
	emphasis: {
		scale: false,
		itemStyle: { color: "inherit", opacity: 0.8 },
		lineStyle: { color: "inherit", opacity: 0.8 },
	},
} as const;

/** Eixos, grid e tooltip recessivos — comuns a todos os gráficos. */
export function baseOption(t: ChartTheme) {
	return {
		grid: { left: 48, right: 16, top: 16, bottom: 32 },
		textStyle: { color: t.accent, fontSize: 12 },
		tooltip: {
			backgroundColor: t.base,
			borderColor: t.line,
			textStyle: { color: t.contrast },
			axisPointer: { lineStyle: { color: t.line } },
		},
		xAxis: {
			axisLine: { lineStyle: { color: t.line } },
			axisTick: { show: false },
			axisLabel: { color: t.accent },
		},
		yAxis: {
			splitLine: { lineStyle: { color: t.line } },
			axisLine: { show: false },
			axisTick: { show: false },
			axisLabel: { color: t.accent },
		},
	};
}
