import { useEffect, useRef, useState } from "react";
import { Text } from "#/components/atoms/text";
import { ROLE_SWATCH, ROLES } from "./palette-data";

// Lê os valores resolvidos direto do DOM — mostra o que a cascata realmente
// entregou naquele escopo, não o que está escrito no arquivo de tema. É o que
// permite ver, por exemplo, um `ring` herdado indevidamente de um ancestral.
//
// A releitura na troca de tema vem da `key` no pai (`${palette}-${theme}`), que
// remonta o componente — por isso o useEffect não tem deps.
export function PaletteRow({ palette }: { palette: string }) {
	const ref = useRef<HTMLDivElement>(null);
	const [values, setValues] = useState<Record<string, string>>({});

	useEffect(() => {
		if (!ref.current) return;
		const cs = getComputedStyle(ref.current);
		setValues(
			Object.fromEntries(
				ROLES.map((r) => [r, cs.getPropertyValue(`--palette-${r}`).trim()]),
			),
		);
	}, []);

	return (
		<div ref={ref} className={palette}>
			<div className="flex flex-col gap-1.5">
				<Text.Small>{palette}</Text.Small>
				<div className="flex flex-wrap gap-1.5">
					{ROLES.map((role) => (
						<div key={role} className="flex w-28 flex-col gap-1">
							<div
								className={`h-9 rounded-md border border-palette-line ${ROLE_SWATCH[role]}`}
							/>
							<Text.Small>{role}</Text.Small>
							<span className="text-[10px] leading-tight opacity-60">
								{values[role] || "—"}
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
