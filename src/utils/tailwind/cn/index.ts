import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const customTwMerge = extendTailwindMerge<"palette">({
	extend: {
		classGroups: {
			palette: [
				{
					palette: [
						"surface",
						"raised",
						"brand",
						"success",
						"warning",
						"danger",
						// palettes de feature (tematização por página)
						"feature-orange",
						"feature-purple",
						"feature-green",
					],
				},
			],
		},
	},
});

export function cn(...inputs: ClassValue[]) {
	return customTwMerge(clsx(inputs));
}
