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
						// palettes de feature — duas por feature: a cromática e a
						// superfície com ring tematizado
						"orange",
						"orange-surface",
						"purple",
						"purple-surface",
						"green",
						"green-surface",
					],
				},
			],
		},
	},
});

export function cn(...inputs: ClassValue[]) {
	return customTwMerge(clsx(inputs));
}
