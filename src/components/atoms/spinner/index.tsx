import { Loader2Icon } from "lucide-react";
import { cn } from "#/utils/tailwind";

// `spinner` — ícone de carregamento. Reescrito do shadcn (importava
// IconPlaceholder de um caminho que não existe neste projeto) para usar
// lucide-react direto. text-palette-contrast herda a palette ativa.

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
	return (
		<Loader2Icon
			data-slot="spinner"
			role="status"
			aria-label="Loading"
			className={cn("size-4 animate-spin text-palette-contrast", className)}
			{...props}
		/>
	);
}

export { Spinner };
