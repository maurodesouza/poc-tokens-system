import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "#/components/atoms/fields";
import { Text } from "#/components/atoms/text";
import { ALL_PALETTES, PaletteRow } from "#/components/palette-inspector";
import { Field } from "#/components/ui-frag/field";
import { useDocumentPreferences } from "#/hooks/use-preferences";

export const Route = createFileRoute("/palettes")({
	component: PalettesPage,
});

function PalettesPage() {
	const [query, setQuery] = useState("");
	const { theme } = useDocumentPreferences();

	const q = query.trim().toLowerCase();
	const filtered = q ? ALL_PALETTES.filter((p) => p.includes(q)) : ALL_PALETTES;

	return (
		<div className="flex flex-col gap-6 p-8">
			<header className="flex flex-col gap-3">
				<Text.Heading as="h1">Palettes</Text.Heading>
				<Text.Paragraph>
					Os 6 papéis de cada palette, com o valor resolvido pela cascata para o
					tema atual. Use o filtro para isolar uma palette.
				</Text.Paragraph>
			</header>

			<Field.Root>
				<Field.Label>Filtrar palettes</Field.Label>
				<Field.Row>
					<Field.Body>
						<Input
							placeholder="ex: orange, surface, brand..."
							value={query}
							onChange={(e) => setQuery(e.currentTarget.value)}
						/>
					</Field.Body>
				</Field.Row>
			</Field.Root>

			<div className="flex flex-col divide-y divide-palette-line gap-4 *:pt-4 *:first:pt-0">
				{filtered.length === 0 ? (
					<Text.Paragraph>
						Nenhuma palette corresponde a “{query}”.
					</Text.Paragraph>
				) : (
					filtered.map((p) => <PaletteRow key={`${p}-${theme}`} palette={p} />)
				)}
			</div>
		</div>
	);
}
