import * as React from "react";

// Preferências globais que vivem no <html>: tema (data-theme), densidade
// (data-density) e direção (dir). São aplicadas imperativamente em qualquer
// lugar via document.documentElement, sem store compartilhado — por isso o
// hook usa MutationObserver para perceber mudanças disparadas fora do
// componente que o lê (ex: o AppHeader reage a uma troca feita numa rota).
//
// Substitui o use-theme.ts anterior, acrescentando density e direction no
// mesmo observer (um só observer cobre os três atributos).

export type Theme = "light" | "dark";
export type Density = "default" | "compact" | "spacious";
export type Direction = "ltr" | "rtl";

type Preferences = {
	theme: Theme;
	density: Density;
	direction: Direction;
};

type SetPreferences = {
	setTheme: (next: Theme) => void;
	setDensity: (next: Density) => void;
	setDirection: (next: Direction) => void;
};

function readTheme(): Theme {
	const v =
		typeof document !== "undefined"
			? (document.documentElement.dataset.theme as Theme | undefined)
			: undefined;
	return v ?? "light";
}

function readDensity(): Density {
	const v =
		typeof document !== "undefined"
			? (document.documentElement.dataset.density as Density | undefined)
			: undefined;
	return v ?? "default";
}

function readDirection(): Direction {
	const v =
		typeof document !== "undefined"
			? (document.documentElement.dir as Direction | undefined)
			: undefined;
	return v === "rtl" ? "rtl" : "ltr";
}

export function useDocumentPreferences(): Preferences & SetPreferences {
	const [theme, setThemeState] = React.useState<Theme>(readTheme);
	const [density, setDensityState] = React.useState<Density>(readDensity);
	const [direction, setDirectionState] =
		React.useState<Direction>(readDirection);

	React.useEffect(() => {
		const el = document.documentElement;
		const observer = new MutationObserver(() => {
			setThemeState(readTheme());
			setDensityState(readDensity());
			setDirectionState(readDirection());
		});
		observer.observe(el, {
			attributes: true,
			attributeFilter: ["data-theme", "data-density", "dir"],
		});
		return () => observer.disconnect();
	}, []);

	const setTheme = React.useCallback((next: Theme) => {
		document.documentElement.dataset.theme = next;
		setThemeState(next);
	}, []);
	const setDensity = React.useCallback((next: Density) => {
		document.documentElement.dataset.density = next;
		setDensityState(next);
	}, []);
	const setDirection = React.useCallback((next: Direction) => {
		document.documentElement.dir = next;
		setDirectionState(next);
	}, []);

	return { theme, density, direction, setTheme, setDensity, setDirection };
}
