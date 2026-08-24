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
import { Combobox } from "#/components/ui-frag/combobox";
import { ContextMenu } from "#/components/ui-frag/context-menu";
import { DropdownMenu } from "#/components/ui-frag/dropdown-menu";
import { Select } from "#/components/ui-frag/select";

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
				<Text.Link to="/field-playground">
					Ir para o Field Playground →
				</Text.Link>
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
				<div className="palette-raised flex flex-col gap-4 rounded-lg border border-palette-line bg-palette-base p-6">
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
				<DropdownMenu.Root>
					<DropdownMenu.Trigger
						render={
							<Clickable.Button className="palette-brand" variant="solid" />
						}
					>
						Abrir dropdown
					</DropdownMenu.Trigger>
					<DropdownMenu.Content>
						<DropdownMenu.Group>
							<DropdownMenu.Label>Opções</DropdownMenu.Label>
							<DropdownMenu.Separator />
							<DropdownMenu.Item className="palette-success">
								Novo arquivo <DropdownMenu.Shortcut>⌘N</DropdownMenu.Shortcut>
							</DropdownMenu.Item>
							<DropdownMenu.Item disabled>Desabilitado</DropdownMenu.Item>
							<DropdownMenu.Item className="palette-danger">
								Deletar
							</DropdownMenu.Item>
						</DropdownMenu.Group>
						<DropdownMenu.Separator />
						<DropdownMenu.Group>
							<DropdownMenu.Label>Submenu</DropdownMenu.Label>
							<DropdownMenu.Sub>
								<DropdownMenu.SubTrigger>Exportar como</DropdownMenu.SubTrigger>
								<DropdownMenu.SubContent>
									<DropdownMenu.Item className="palette-success">
										PDF
									</DropdownMenu.Item>
									<DropdownMenu.Item className="palette-warning">
										SVG
									</DropdownMenu.Item>
									<DropdownMenu.Item className="palette-danger">
										PNG
									</DropdownMenu.Item>
								</DropdownMenu.SubContent>
							</DropdownMenu.Sub>
						</DropdownMenu.Group>
						<DropdownMenu.Separator />
						<DropdownMenu.Group>
							<DropdownMenu.CheckboxItem checked>
								Mostrar grid
							</DropdownMenu.CheckboxItem>
							<DropdownMenu.CheckboxItem>
								Snap to grid
							</DropdownMenu.CheckboxItem>
						</DropdownMenu.Group>
						<DropdownMenu.Separator />
						<DropdownMenu.RadioGroup defaultValue="light">
							<DropdownMenu.Label>Tema</DropdownMenu.Label>
							<DropdownMenu.RadioItem value="light">
								Claro
							</DropdownMenu.RadioItem>
							<DropdownMenu.RadioItem value="dark">
								Escuro
							</DropdownMenu.RadioItem>
						</DropdownMenu.RadioGroup>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</section>

			{/* ContextMenu — right-click na área destacada */}
			<section className="flex flex-col gap-4">
				<Text.Heading as="h2">ContextMenu</Text.Heading>
				<ContextMenu.Root>
					<ContextMenu.Trigger
						render={
							<div className="palette-raised flex h-32 items-center justify-center rounded-lg border border-palette-line bg-palette-base text-sm">
								Clique com botão direito aqui
							</div>
						}
					/>
					<ContextMenu.Content>
						<ContextMenu.Group>
							<ContextMenu.Label>Ações</ContextMenu.Label>
							<ContextMenu.Separator />
							<ContextMenu.Item>
								Copiar <ContextMenu.Shortcut>⌘C</ContextMenu.Shortcut>
							</ContextMenu.Item>
							<ContextMenu.Item>
								Colar <ContextMenu.Shortcut>⌘V</ContextMenu.Shortcut>
							</ContextMenu.Item>
							<ContextMenu.Item disabled>Recortar</ContextMenu.Item>
							<ContextMenu.Item className="palette-danger">
								Excluir
							</ContextMenu.Item>
						</ContextMenu.Group>
						<ContextMenu.Separator />
						<ContextMenu.Group>
							<ContextMenu.Sub>
								<ContextMenu.SubTrigger>Alinhar</ContextMenu.SubTrigger>
								<ContextMenu.SubContent>
									<ContextMenu.Item>Esquerda</ContextMenu.Item>
									<ContextMenu.Item>Centro</ContextMenu.Item>
									<ContextMenu.Item>Direita</ContextMenu.Item>
								</ContextMenu.SubContent>
							</ContextMenu.Sub>
						</ContextMenu.Group>
						<ContextMenu.Separator />
						<ContextMenu.Group>
							<ContextMenu.CheckboxItem checked>
								Salvar automático
							</ContextMenu.CheckboxItem>
						</ContextMenu.Group>
						<ContextMenu.Separator />
						<ContextMenu.RadioGroup defaultValue="top">
							<ContextMenu.RadioItem value="top">Topo</ContextMenu.RadioItem>
							<ContextMenu.RadioItem value="bottom">Base</ContextMenu.RadioItem>
						</ContextMenu.RadioGroup>
					</ContextMenu.Content>
				</ContextMenu.Root>
			</section>

			{/* Select */}
			<section className="flex flex-col gap-4">
				<Text.Heading as="h2">Select</Text.Heading>
				<Select.Root defaultValue="apple">
					<Select.Trigger className="w-48">
						<Select.Value placeholder="Escolha uma fruta" />
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Label>Frutas</Select.Label>
							<Select.Item value="apple">Maçã</Select.Item>
							<Select.Item value="banana">Banana</Select.Item>
							<Select.Item value="cherry" disabled>
								Cereja (fora de estoque)
							</Select.Item>
							<Select.Item value="grape">Uva</Select.Item>
							<Select.Item value="mango">Manga</Select.Item>
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</section>

			{/* Combobox — filtro por input */}
			<section className="flex flex-col gap-4">
				<Text.Heading as="h2">Combobox</Text.Heading>
				<Combobox.Root defaultValue="react">
					<Combobox.Input
						placeholder="Buscar framework..."
						showTrigger
						showClear
					/>
					<Combobox.Content>
						<Combobox.List>
							<Combobox.Empty>Nenhum resultado</Combobox.Empty>
							<Combobox.Group>
								<Combobox.Label>Frontend</Combobox.Label>
								<Combobox.Item value="react">React</Combobox.Item>
								<Combobox.Item value="vue">Vue</Combobox.Item>
								<Combobox.Item value="svelte">Svelte</Combobox.Item>
								<Combobox.Item value="solid" disabled>
									Solid (indisponível)
								</Combobox.Item>
							</Combobox.Group>
							<Combobox.Separator />
							<Combobox.Group>
								<Combobox.Label>Backend</Combobox.Label>
								<Combobox.Item value="node">Node.js</Combobox.Item>
								<Combobox.Item value="deno">Deno</Combobox.Item>
								<Combobox.Item value="bun">Bun</Combobox.Item>
							</Combobox.Group>
						</Combobox.List>
					</Combobox.Content>
				</Combobox.Root>
			</section>
		</div>
	);
}
