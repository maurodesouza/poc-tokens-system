import { PaletteIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { Clickable } from "#/components/atoms/clickable";
import { Input } from "#/components/atoms/fields";
import { Text } from "#/components/atoms/text";
import { Field } from "#/components/ui-frag/field";
import { useDocumentPreferences } from "#/hooks/use-preferences";
import { cn } from "#/utils/tailwind";
import { ALL_PALETTES } from "./palette-data";
import { PaletteRow } from "./palette-row";

// Largura do painel — usada tanto no `padding-right` do wrapper (para empurrar
// o conteúdo) quanto na largura do próprio painel. Mantida em sync via classe.
const PANEL_WIDTH = "w-[440px]";
const PANEL_PADDING = "pr-[440px]";

// Inspector global de palettes — helper de visualização disponível em qualquer
// página. Monta no __root envolvendo o conteúdo da rota.
//
// Restrição do projeto: NÃO pode ficar em cima do conteúdo. Por isso o painel é
// `fixed` à direita e o wrapper recebe `padding-right` igual à largura do painel
// quando aberto — o conteúdo é empurrado, nunca coberto. Sem overlay/backdrop.
export function PaletteInspector({ children }: { children: React.ReactNode }) {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const { theme } = useDocumentPreferences();

	const q = query.trim().toLowerCase();
	const filtered = q ? ALL_PALETTES.filter((p) => p.includes(q)) : ALL_PALETTES;

	return (
		<>
			<div
				className={cn(
					"transition-[padding] duration-300 ease-out",
					open && PANEL_PADDING,
				)}
			>
				{children}
			</div>

			{/* Gatilho (FAB) — canto inferior direito. Some quando o painel abre. */}
			<Clickable.Button
				variant="outline"
				size="sm"
				className={cn(
					"palette-brand fixed bottom-4 right-4 z-50 transition-opacity",
					open && "pointer-events-none opacity-0",
				)}
				onClick={() => setOpen(true)}
				aria-label="Abrir inspector de palettes"
			>
				<PaletteIcon />
				Palettes
			</Clickable.Button>

			{open && (
				<aside
					className={cn(
						"palette-raised fixed right-0 top-0 z-50 flex h-screen flex-col gap-4",
						"border-l border-palette-line bg-palette-base p-4",
						PANEL_WIDTH,
					)}
				>
					<header className="flex items-start justify-between gap-2">
						<div className="flex flex-col">
							<Text.Heading as="h3">Palettes</Text.Heading>
							<Text.Small>Tema: {theme}</Text.Small>
						</div>
						<Clickable.Button
							variant="ghost"
							shape="square"
							size="sm"
							onClick={() => setOpen(false)}
							aria-label="Fechar inspector"
						>
							<XIcon />
						</Clickable.Button>
					</header>

					<Field.Root>
						<Field.Row>
							<Field.Body>
								<Input
									placeholder="Filtrar (ex: orange, surface)..."
									value={query}
									onChange={(e) => setQuery(e.currentTarget.value)}
								/>
							</Field.Body>
						</Field.Row>
					</Field.Root>

					<div className="flex flex-col divide-y divide-palette-line gap-4 overflow-y-auto pe-1 *:pt-4 *:first:pt-0">
						{filtered.length === 0 ? (
							<Text.Small>Nenhuma palette corresponde a “{query}”.</Text.Small>
						) : (
							filtered.map((p) => (
								<PaletteRow key={`${p}-${theme}`} palette={p} />
							))
						)}
					</div>
				</aside>
			)}
		</>
	);
}
