import { useCallback, useEffect, useState } from "react";

// ECharts renderiza em CANVAS, e canvas não resolve `var(--palette-base)`. Esta é a
// única fronteira do projeto onde a cor precisa passar por JS.
//
// ─── SEM DEPENDER DA APLICAÇÃO ─────────────────────────────────────────────────
// O hook NÃO lê nenhum state de tema. Ele observa o DOM diretamente, porque numa
// lib não existe garantia de que o tema mora num hook, num contexto ou num store —
// só existe a garantia de que ele acaba num atributo do documento.
//
// Não há API para observar valor computado de CSS: `MutationObserver` observa DOM e
// atributos, não estilo. A saída é observar o ATRIBUTO que causa a troca
// (`data-theme`), que é o mesmo contrato que o CSS usa.
//
// ─── POR QUE SONDAS, E NÃO getPropertyValue ────────────────────────────────────
// `getComputedStyle(el).getPropertyValue('--chart-1')` devolve a custom property
// COMO DECLARADA — para `oklch(from …)` vem a string da função, não uma cor.
// Funções de cor só são avaliadas quando usadas numa propriedade real, então cada
// token é aplicado a `color` num span sonda e lido de volta resolvido.

export const SERIES_TOKENS = [1, 2, 3, 4, 5].map((i) => `--chart-${i}`);
export const RAMP_TOKENS = [1, 2, 3, 4, 5].map((i) => `--chart-ramp-${i}`);
export const FRAME_TOKENS = [
	"--palette-contrast",
	"--palette-accent",
	"--palette-line",
	"--palette-base",
	"--palette-soft",
] as const;

/** Atributos do documento que mudam as cores resolvidas. */
const WATCHED_ATTRIBUTES = ["data-theme", "class", "style"];

export type ChartTheme = {
	/** Muda a cada releitura — serve de chave para recriar o gráfico. */
	revision: number;
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
	const [resolved, setResolved] = useState<ChartTheme | null>(null);

	const read = useCallback(() => {
		if (!markHost || !frameHost) return;
		const [contrast, accent, line, base, soft] = readResolved(
			frameHost,
			FRAME_TOKENS,
		);
		setResolved((prev) => ({
			revision: (prev?.revision ?? 0) + 1,
			series: readResolved(markHost, SERIES_TOKENS),
			ramp: readResolved(markHost, RAMP_TOKENS),
			contrast,
			accent,
			line,
			base,
			soft,
		}));
	}, [markHost, frameHost]);

	useEffect(() => {
		read();
		if (!markHost) return;

		// O tema costuma trocar no <html>; a palette pode trocar no próprio host.
		const observer = new MutationObserver(read);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: WATCHED_ATTRIBUTES,
		});
		observer.observe(markHost, {
			attributes: true,
			attributeFilter: WATCHED_ATTRIBUTES,
		});
		return () => observer.disconnect();
	}, [read, markHost]);

	return resolved;
}
