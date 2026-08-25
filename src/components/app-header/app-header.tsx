import { useNavigate, useRouterState } from "@tanstack/react-router";
import { ChevronDownIcon } from "lucide-react";
import { Clickable } from "#/components/atoms/clickable";
import { Text } from "#/components/atoms/text";
import { DropdownMenu } from "#/components/ui-frag/dropdown-menu";
import {
	type Density,
	type Direction,
	type Theme,
	useDocumentPreferences,
} from "#/hooks/use-preferences";

// Header global — montado no __root, visível em todas as rotas.
//
// Reúne em um só lugar o que antes estava duplicado em cada página:
//   - título da página atual (lido do pathname)
//   - links de navegação (Clickable.Link, que envolve TanstackLink)
//   - controles globais: tema, densidade, direção
//
// Os controles escrevem direto em document.documentElement e o hook
// useDocumentPreferences observa as mudanças — então qualquer página que leia
// o mesmo hook vê o estado atualizado, e o próprio header reage mesmo se a
// troca for disparada por outro componente.

const NAV: { to: string; label: string }[] = [
	{ to: "/", label: "Playground" },
	{ to: "/field-playground", label: "Field" },
	{ to: "/palettes", label: "Palettes" },
	{ to: "/charts", label: "Charts" },
];

const FEATURE_NAV: { to: string; label: string }[] = [
	{ to: "/feature-themes", label: "Todos juntos" },
	{ to: "/features/orange", label: "Faturamento" },
	{ to: "/features/purple", label: "Analytics" },
	{ to: "/features/green", label: "Integrações" },
];

const THEMES: Theme[] = ["light", "dark"];
const DENSITIES: Density[] = ["default", "compact", "spacious"];
const DIRECTIONS: Direction[] = ["ltr", "rtl"];

function titleForPathname(pathname: string): string {
	const flat = NAV.find(
		(n) => n.to === pathname || (n.to !== "/" && pathname.startsWith(n.to)),
	);
	if (flat) return flat.label;
	const feat = FEATURE_NAV.find(
		(n) => n.to === pathname || pathname.startsWith(n.to),
	);
	return feat?.label ?? "Fragiola";
}

export function AppHeader() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const navigate = useNavigate();
	const { theme, density, direction, setTheme, setDensity, setDirection } =
		useDocumentPreferences();

	const featureActive = FEATURE_NAV.some(
		(n) => n.to === pathname || pathname.startsWith(n.to),
	);

	return (
		<header className="palette-raised bg-palette-base sticky top-0 z-40 flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-palette-line px-6 py-3">
			<Text.Heading as="h1" className="text-base">
				{titleForPathname(pathname)}
			</Text.Heading>

			<nav className="flex flex-wrap items-center gap-1.5">
				{NAV.map((item) => {
					const active =
						item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
					return (
						<Clickable.Link
							key={item.to}
							to={item.to}
							size="sm"
							variant={active ? "solid" : "ghost"}
							className={active ? "palette-brand" : undefined}
						>
							{item.label}
						</Clickable.Link>
					);
				})}

				<DropdownMenu.Root>
					<DropdownMenu.Trigger
						render={
							<Clickable.Button
								size="sm"
								variant={featureActive ? "solid" : "ghost"}
								className={featureActive ? "palette-brand" : undefined}
							/>
						}
					>
						Features
						<ChevronDownIcon />
					</DropdownMenu.Trigger>
					<DropdownMenu.Content>
						{FEATURE_NAV.map((item) => (
							<DropdownMenu.Item
								key={item.to}
								onClick={() => navigate({ to: item.to })}
							>
								{item.label}
							</DropdownMenu.Item>
						))}
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</nav>

			<div className="palette-surface ms-auto flex flex-wrap items-center gap-x-4 gap-y-2">
				<ControlGroup label="Tema">
					{THEMES.map((t) => (
						<Clickable.Button
							key={t}
							size="sm"
							variant={theme === t ? "solid" : "outline"}
							className={theme === t ? "palette-brand" : undefined}
							onClick={() => setTheme(t)}
						>
							{t}
						</Clickable.Button>
					))}
				</ControlGroup>

				<ControlGroup label="Densidade">
					{DENSITIES.map((d) => (
						<Clickable.Button
							key={d}
							size="sm"
							variant={density === d ? "solid" : "outline"}
							className={density === d ? "palette-brand" : undefined}
							onClick={() => setDensity(d)}
						>
							{d}
						</Clickable.Button>
					))}
				</ControlGroup>

				<ControlGroup label="Direção">
					{DIRECTIONS.map((d) => (
						<Clickable.Button
							key={d}
							size="sm"
							variant={direction === d ? "solid" : "outline"}
							className={direction === d ? "palette-brand" : undefined}
							onClick={() => setDirection(d)}
						>
							{d}
						</Clickable.Button>
					))}
				</ControlGroup>
			</div>
		</header>
	);
}

function ControlGroup({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex items-center gap-1.5">
			<Text.Small className="not-italic">{label}</Text.Small>
			<div className="flex gap-1.5">{children}</div>
		</div>
	);
}
