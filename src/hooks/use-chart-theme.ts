import { useEffect, useState } from "react";
import { useDocumentPreferences } from "#/hooks/use-preferences";

// ECharts renderiza em CANVAS, e canvas não resolve `var(--palette-base)`. Esta é a
// única fronteira do projeto onde a cor precisa passar por JS.
//
// ─── POR QUE SONDAS, E NÃO getPropertyValue ────────────────────────────────────
// `getComputedStyle(el).getPropertyValue('--chart-1')` devolve a custom property
// COMO DECLARADA — para `oklch(from var(--palette-base) …)` vem a string da função,
// não uma cor. O ECharts recebia isso e pintava tudo cinza.
//
// Funções de cor só são avaliadas quando usadas numa propriedade real. Então cada
// token é aplicado a `color` num span sonda, e lemos `color` de volta — aí o browser
// devolve `rgb(...)` resolvido.
//
// As sondas ficam fora da tela em vez de `hidden`: `display:none` pode pular o
// cálculo de estilo.

export const SERIES_TOKENS = [1, 2, 3, 4, 5].map((i) => `--chart-${i}`);
export const RAMP_TOKENS = [1, 2, 3, 4, 5].map((i) => `--chart-ramp-${i}`);
export const FRAME_TOKENS = [
	"--palette-contrast",
	"--palette-accent",
	"--palette-line",
	"--palette-base",
	"--palette-soft",
] as const;

export type ChartTheme = {
	/** Modo ativo quando as cores foram lidas — serve de chave para recriar. */
	mode: string;
	/** Cores de série, derivadas da palette das MARCAS. */
	series: string[];
	/** Rampa ordinal/sequencial, também da palette das marcas. */
	ramp: string[];
	/** Moldura — sempre da superfície, nunca da palette do gráfico. */
	contrast: string;
	accent: string;
	line: string;
	base: string;
	soft: string;
};

function readResolved(host: HTMLElement, tokens: readonly string[]) {
	return tokens.map((token) => {
		const probe = host.querySelector<HTMLElement>(`[data-token="${token}"]`);
		return probe ? getComputedStyle(probe).color : "";
	});
}

export function useChartTheme(
	markHost: HTMLElement | null,
	frameHost: HTMLElement | null,
): ChartTheme | null {
	const { theme } = useDocumentPreferences();
	const [resolved, setResolved] = useState<ChartTheme | null>(null);

	useEffect(() => {
		if (!markHost || !frameHost) return;

		const series = readResolved(markHost, SERIES_TOKENS);
		const ramp = readResolved(markHost, RAMP_TOKENS);
		const [contrast, accent, line, base, soft] = readResolved(
			frameHost,
			FRAME_TOKENS,
		);

		setResolved({
			mode: theme,
			series,
			ramp,
			contrast,
			accent,
			line,
			base,
			soft,
		});
	}, [markHost, frameHost, theme]);

	return resolved;
}
