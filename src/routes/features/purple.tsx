import { createFileRoute } from "@tanstack/react-router";
import { Text } from "#/components/atoms/text";
import { FeaturePanel } from "#/components/feature-panel";

export const Route = createFileRoute("/features/purple")({
	component: FeaturePurple,
});

function FeaturePurple() {
	return (
		<div className="flex flex-col gap-6 p-8">
			<header className="flex flex-col gap-3">
				<Text.Heading as="h1">Analytics</Text.Heading>
				<Text.Paragraph>
					Feature purple isolada — superfície neutra com ring na cor da feature,
					CTA e controles marcados na palette cromática.
				</Text.Paragraph>
			</header>

			<FeaturePanel
				label="Analytics"
				accent="palette-purple"
				surface="palette-purple-surface"
			/>
		</div>
	);
}
