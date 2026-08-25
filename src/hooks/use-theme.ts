import * as React from "react";

// Reage à troca de tema feita em qualquer lugar via `document.documentElement
// .dataset.theme = ...`. Como o tema é aplicado imperativamente (não há store
// compartilhado), um MutationObserver é a forma de perceber a mudança fora da
// página que a disparou — ex: o PaletteInspector, que vive no __root e precisa
// remontar as swatches quando o tema muda numa rota filha.
export function useDocumentTheme() {
	const [theme, setTheme] = React.useState<string>(() =>
		typeof document !== "undefined"
			? (document.documentElement.dataset.theme ?? "light")
			: "light",
	);

	React.useEffect(() => {
		const el = document.documentElement;
		const observer = new MutationObserver(() => {
			setTheme(el.dataset.theme ?? "light");
		});
		observer.observe(el, {
			attributes: true,
			attributeFilter: ["data-theme"],
		});
		return () => observer.disconnect();
	}, []);

	return theme;
}
