import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Clickable } from "#/components/atoms/clickable";
import { Text } from "#/components/atoms/text";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "#/components/ui/dialog";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxGroup,
	ComboboxInput,
	ComboboxItem,
	ComboboxLabel,
	ComboboxList,
	ComboboxSeparator,
} from "#/components/ui-frag/combobox";
import {
	ContextMenu,
	ContextMenuCheckboxItem,
	ContextMenuContent,
	ContextMenuGroup,
	ContextMenuItem,
	ContextMenuLabel,
	ContextMenuRadioGroup,
	ContextMenuRadioItem,
	ContextMenuSeparator,
	ContextMenuShortcut,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger,
} from "#/components/ui-frag/context-menu";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "#/components/ui-frag/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "#/components/ui-frag/select";

export const Route = createFileRoute("/")({ component: Home });

const THEMES = ["light", "dark"] as const;
const DENSITIES = ["default", "compact", "spacious"] as const;
const TONES = [
	"default",
	"raised",
	"brand",
	"success",
	"warning",
	"danger",
] as const;
const VARIANTS = ["solid", "ghost", "outline", "icon"] as const;

const toneClass = (tone: (typeof TONES)[number]) =>
	tone === "default" ? undefined : `palette-${tone}`;

function Home() {
	const [theme, setTheme] = useState<(typeof THEMES)[number]>("light");
	const [density, setDensity] = useState<(typeof DENSITIES)[number]>("default");

	function applyTheme(next: (typeof THEMES)[number]) {
		setTheme(next);
		document.documentElement.dataset.theme = next;
	}

	function applyDensity(next: (typeof DENSITIES)[number]) {
		setDensity(next);
		document.documentElement.dataset.density = next;
	}

	return (
		<div className="flex flex-col gap-8 p-8">
			<header className="flex flex-col gap-4">
				<Text.Heading as="h1">Fragiola Pilot — Playground</Text.Heading>
				<Text.Paragraph>
					Validação do contrato de 5 papéis de cor e composição via render.
				</Text.Paragraph>
			</header>

			{/* Controles: tema e densidade */}
			<section className="flex flex-wrap gap-6">
				<div className="flex flex-col gap-2">
					<Text.Label>Tema</Text.Label>
					<div className="flex gap-2">
						{THEMES.map((t) => (
							<Clickable.Button
								key={t}
								variant={theme === t ? "solid" : "outline"}
								className="palette-brand"
								onClick={() => applyTheme(t)}
							>
								{t}
							</Clickable.Button>
						))}
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<Text.Label>Densidade</Text.Label>
					<div className="flex gap-2">
						{DENSITIES.map((d) => (
							<Clickable.Button
								key={d}
								variant={density === d ? "solid" : "outline"}
								className="palette-brand"
								onClick={() => applyDensity(d)}
							>
								{d}
							</Clickable.Button>
						))}
					</div>
				</div>
			</section>

			{/* Grid de botões: 5 tones × 4 variants */}
			<section className="flex flex-col gap-4">
				<Text.Heading as="h2">
					Clickable.Button — 5 tones × 4 variants
				</Text.Heading>
				<div className="flex flex-col gap-4">
					{VARIANTS.map((variant) => (
						<div key={variant} className="flex flex-col gap-2">
							<Text.Strong>{variant}</Text.Strong>
							<div className="flex flex-wrap gap-3">
								{TONES.map((tone) => (
									<Clickable.Button
										key={`${tone}-${variant}`}
										className={toneClass(tone)}
										variant={variant}
									>
										{variant === "icon" ? "✕" : `${tone}`}
									</Clickable.Button>
								))}
							</div>
						</div>
					))}
				</div>
			</section>

			{/* Text members */}
			<section className="flex flex-col gap-4">
				<Text.Heading as="h2">Text — todos os membros</Text.Heading>
				<div className="flex flex-col gap-2">
					<Text.Heading as="h1">Heading h1</Text.Heading>
					<Text.Heading as="h2">Heading h2</Text.Heading>
					<Text.Heading as="h3">Heading h3</Text.Heading>
					<Text.Paragraph>Paragraph — texto padrão do corpo.</Text.Paragraph>
					<Text.Small>Small — texto pequeno itálico.</Text.Small>
					<Text.Label>Label — rótulo de formulário</Text.Label>
					<Text.Strong>Strong — texto em destaque.</Text.Strong>
					<Text.Highlight>
						Highlight — texto com cor de contexto.
					</Text.Highlight>
					<Text.Error>Error — mensagem de erro.</Text.Error>
					<Text.Clickable>Clickable — texto clicável.</Text.Clickable>
				</div>
			</section>

			{/* Dialog completo */}
			<section className="flex flex-col gap-4">
				<Text.Heading as="h2">Dialog — composição com átomos</Text.Heading>
				<Dialog>
					<DialogTrigger
						render={
							<Clickable.Button className="palette-brand" variant="solid" />
						}
					>
						Abrir dialog
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Título do dialog</DialogTitle>
							<DialogDescription>
								Descrição do dialog. Sem nível de texto secundário no contrato
								de 5 papéis — título e descrição têm a mesma cor.
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<DialogClose render={<Clickable.Button variant="outline" />}>
								Cancelar
							</DialogClose>
							<Clickable.Button className="palette-brand" variant="solid">
								Confirmar
							</Clickable.Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</section>

			{/* Dialog aberto inline dentro de palette-raised (aninhamento) */}
			<section className="flex flex-col gap-4">
				<Text.Heading as="h2">
					Aninhamento de palettes — botão default dentro de palette-raised
				</Text.Heading>
				<div className="palette-raised flex flex-col gap-4 rounded-lg border border-palette-line bg-palette-solid p-6">
					<Text.Paragraph>
						Esta seção está dentro de <Text.Strong>palette-raised</Text.Strong>.
						Os botões com tone="default" abaixo devem pegar as cores da
						superfície elevada, não as do chão do app.
					</Text.Paragraph>
					<div className="flex gap-3">
						<Clickable.Button variant="solid">
							default solid (raised)
						</Clickable.Button>
						<Clickable.Button variant="outline">
							default outline (raised)
						</Clickable.Button>
						<Clickable.Button variant="ghost">
							default ghost (raised)
						</Clickable.Button>
						<Clickable.Button className="palette-brand" variant="solid">
							brand solid (raised)
						</Clickable.Button>
					</div>
				</div>
			</section>

			{/* ============================================================ */}
			{/* FASE 4 — Famílias: dropdown-menu, context-menu, select, combobox */}
			{/* ============================================================ */}

			<Text.Heading as="h2">Famílias popup + menu — 4 componentes</Text.Heading>
			<Text.Paragraph>
				Cada seção exercita: item normal, destacado (navegar por teclado),
				desabilitado, destructive, checkbox, radio, submenu, separator e label.
				Testar em light/dark e com density compact.
			</Text.Paragraph>

			{/* DropdownMenu */}
			<section className="flex flex-col gap-4">
				<Text.Heading as="h2">DropdownMenu</Text.Heading>
				<DropdownMenu>
					<DropdownMenuTrigger
						render={
							<Clickable.Button className="palette-brand" variant="solid" />
						}
					>
						Abrir dropdown
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuGroup>
							<DropdownMenuLabel>Opções</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem className="palette-success">
								Novo arquivo <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
							</DropdownMenuItem>
							<DropdownMenuItem disabled>Desabilitado</DropdownMenuItem>
							<DropdownMenuItem className="palette-danger">
								Deletar
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuLabel>Submenu</DropdownMenuLabel>
							<DropdownMenuSub>
								<DropdownMenuSubTrigger>Exportar como</DropdownMenuSubTrigger>
								<DropdownMenuSubContent>
									<DropdownMenuItem className="palette-success">
										PDF
									</DropdownMenuItem>
									<DropdownMenuItem className="palette-warning">
										SVG
									</DropdownMenuItem>
									<DropdownMenuItem className="palette-danger">
										PNG
									</DropdownMenuItem>
								</DropdownMenuSubContent>
							</DropdownMenuSub>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuCheckboxItem checked>
								Mostrar grid
							</DropdownMenuCheckboxItem>
							<DropdownMenuCheckboxItem>Snap to grid</DropdownMenuCheckboxItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuRadioGroup defaultValue="light">
							<DropdownMenuLabel>Tema</DropdownMenuLabel>
							<DropdownMenuRadioItem value="light">Claro</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="dark">Escuro</DropdownMenuRadioItem>
						</DropdownMenuRadioGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</section>

			{/* ContextMenu — right-click na área destacada */}
			<section className="flex flex-col gap-4">
				<Text.Heading as="h2">ContextMenu</Text.Heading>
				<ContextMenu>
					<ContextMenuTrigger
						render={
							<div className="palette-raised flex h-32 items-center justify-center rounded-lg border border-palette-line bg-palette-solid text-sm">
								Clique com botão direito aqui
							</div>
						}
					/>
					<ContextMenuContent>
						<ContextMenuGroup>
							<ContextMenuLabel>Ações</ContextMenuLabel>
							<ContextMenuSeparator />
							<ContextMenuItem>
								Copiar <ContextMenuShortcut>⌘C</ContextMenuShortcut>
							</ContextMenuItem>
							<ContextMenuItem>
								Colar <ContextMenuShortcut>⌘V</ContextMenuShortcut>
							</ContextMenuItem>
							<ContextMenuItem disabled>Recortar</ContextMenuItem>
							<ContextMenuItem className="palette-danger">
								Excluir
							</ContextMenuItem>
						</ContextMenuGroup>
						<ContextMenuSeparator />
						<ContextMenuGroup>
							<ContextMenuSub>
								<ContextMenuSubTrigger>Alinhar</ContextMenuSubTrigger>
								<ContextMenuSubContent>
									<ContextMenuItem>Esquerda</ContextMenuItem>
									<ContextMenuItem>Centro</ContextMenuItem>
									<ContextMenuItem>Direita</ContextMenuItem>
								</ContextMenuSubContent>
							</ContextMenuSub>
						</ContextMenuGroup>
						<ContextMenuSeparator />
						<ContextMenuGroup>
							<ContextMenuCheckboxItem checked>
								Salvar automático
							</ContextMenuCheckboxItem>
						</ContextMenuGroup>
						<ContextMenuSeparator />
						<ContextMenuRadioGroup defaultValue="top">
							<ContextMenuRadioItem value="top">Topo</ContextMenuRadioItem>
							<ContextMenuRadioItem value="bottom">Base</ContextMenuRadioItem>
						</ContextMenuRadioGroup>
					</ContextMenuContent>
				</ContextMenu>
			</section>

			{/* Select */}
			<section className="flex flex-col gap-4">
				<Text.Heading as="h2">Select</Text.Heading>
				<Select defaultValue="apple">
					<SelectTrigger className="w-48">
						<SelectValue placeholder="Escolha uma fruta" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Frutas</SelectLabel>
							<SelectItem value="apple">Maçã</SelectItem>
							<SelectItem value="banana">Banana</SelectItem>
							<SelectItem value="cherry" disabled>
								Cereja (fora de estoque)
							</SelectItem>
							<SelectItem value="grape">Uva</SelectItem>
							<SelectItem value="mango">Manga</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</section>

			{/* Combobox — filtro por input */}
			<section className="flex flex-col gap-4">
				<Text.Heading as="h2">Combobox</Text.Heading>
				<Combobox defaultValue="react">
					<ComboboxInput
						placeholder="Buscar framework..."
						showTrigger
						showClear
					/>
					<ComboboxContent>
						<ComboboxList>
							<ComboboxEmpty>Nenhum resultado</ComboboxEmpty>
							<ComboboxGroup>
								<ComboboxLabel>Frontend</ComboboxLabel>
								<ComboboxItem value="react">React</ComboboxItem>
								<ComboboxItem value="vue">Vue</ComboboxItem>
								<ComboboxItem value="svelte">Svelte</ComboboxItem>
								<ComboboxItem value="solid" disabled>
									Solid (indisponível)
								</ComboboxItem>
							</ComboboxGroup>
							<ComboboxSeparator />
							<ComboboxGroup>
								<ComboboxLabel>Backend</ComboboxLabel>
								<ComboboxItem value="node">Node.js</ComboboxItem>
								<ComboboxItem value="deno">Deno</ComboboxItem>
								<ComboboxItem value="bun">Bun</ComboboxItem>
							</ComboboxGroup>
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
			</section>
		</div>
	);
}
