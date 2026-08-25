import { createFileRoute } from "@tanstack/react-router";
import { Text } from "#/components/atoms/text";
import { FeaturePanel } from "#/components/feature-panel";

export const Route = createFileRoute("/features/orange")({
	component: FeatureOrange,
});

function FeatureOrange() {
	return (
		<div className="flex flex-col gap-6 p-8">
			<header className="flex flex-col gap-3">
				<Text.Heading as="h1">Faturamento</Text.Heading>
				<Text.Paragraph>
					Feature orange isolada — superfície neutra com ring na cor da feature,
					CTA e controles marcados na palette cromática.
				</Text.Paragraph>
			</header>

			<FeaturePanel
				label="Faturamento"
				accent="palette-orange"
				surface="palette-orange-surface"
			/>
		</div>
	);
}
