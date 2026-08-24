import { createFileRoute } from "@tanstack/react-router";
import {
	AtSignIcon,
	ChevronDownIcon,
	CopyIcon,
	DollarSignIcon,
	ExpandIcon,
	EyeIcon,
	EyeOffIcon,
	GlobeIcon,
	HashIcon,
	MailIcon,
	SearchIcon,
	SendIcon,
} from "lucide-react";
import { useState } from "react";
import { Checkbox } from "#/components/atoms/choice/checkbox";
import { Switch } from "#/components/atoms/choice/switch";
import { Clickable } from "#/components/atoms/clickable";
import { Input, Numeric, Textarea } from "#/components/atoms/fields";
import { Kbd, KbdGroup } from "#/components/atoms/kbd";
import { Spinner } from "#/components/atoms/spinner";
import { Text } from "#/components/atoms/text";
import { field } from "#/components/families/field";
import { DropdownMenu } from "#/components/ui-frag/dropdown-menu";
import { Field } from "#/components/ui-frag/field";
import { RadioGroup } from "#/components/ui-frag/radio-group";
import { Select } from "#/components/ui-frag/select";

export const Route = createFileRoute("/field-playground")({
	component: FieldPlayground,
});

const THEMES = ["light", "dark"] as const;
const DENSITIES = ["default", "compact"] as const;
const DIRECTIONS = ["ltr", "rtl"] as const;

function FieldPlayground() {
	const [theme, setTheme] = useState<(typeof THEMES)[number]>("light");
	const [density, setDensity] = useState<(typeof DENSITIES)[number]>("default");
	const [direction, setDirection] =
		useState<(typeof DIRECTIONS)[number]>("ltr");
	const [showPassword, setShowPassword] = useState(false);

	function applyTheme(next: (typeof THEMES)[number]) {
		document.documentElement.dataset.theme = next;
		setTheme(next);
	}

	function applyDensity(next: (typeof DENSITIES)[number]) {
		document.documentElement.dataset.density = next;
		setDensity(next);
	}

	function applyDirection(next: (typeof DIRECTIONS)[number]) {
		document.documentElement.dir = next;
		setDirection(next);
	}

	return (
		<div className="flex flex-col gap-8 p-8 max-w-2xl">
			<header className="flex flex-col gap-4">
				<Text.Heading as="h1">Field Playground</Text.Heading>
				<Text.Link to="/">← Voltar para a home</Text.Link>
				<div className="flex flex-wrap gap-4">
					<div className="flex gap-2">
						{THEMES.map((t) => (
							<Clickable.Button
								key={t}
								variant={theme === t ? "solid" : "outline"}
								onClick={() => applyTheme(t)}
							>
								{t}
							</Clickable.Button>
						))}
					</div>
					<div className="flex gap-2">
						{DENSITIES.map((d) => (
							<Clickable.Button
								key={d}
								variant={density === d ? "solid" : "outline"}
								onClick={() => applyDensity(d)}
							>
								{d}
							</Clickable.Button>
						))}
					</div>
					<div className="flex gap-2">
						{DIRECTIONS.map((d) => (
							<Clickable.Button
								key={d}
								variant={direction === d ? "solid" : "outline"}
								onClick={() => applyDirection(d)}
							>
								{d}
							</Clickable.Button>
						))}
					</div>
				</div>
			</header>

			{/* ═══ F4 — Inset vs Addon lado a lado ═══ */}
			<section className="flex flex-col gap-6">
				<Text.Heading as="h2">Inset vs Addon</Text.Heading>
				<Text.Paragraph>
					<strong>Inset</strong> — dentro do padding do body, sem divisor. Ícone
					de busca, botão de olho. Faz parte da área do controle.
				</Text.Paragraph>
				<Text.Paragraph>
					<strong>Addon</strong> — irmão do body, com divisor. Prefixo
					"https://", botão anexo, dropdown de unidade. É uma região própria.
				</Text.Paragraph>
				<div className="grid grid-cols-2 gap-4">
					<Field.Root>
						<Field.Label>Inset (sem divisor)</Field.Label>
						<Field.Row>
							<Field.Body>
								<span className={field.inset()}>
									<SearchIcon />
								</span>
								<Input placeholder="Buscar" />
							</Field.Body>
						</Field.Row>
					</Field.Root>
					<Field.Root>
						<Field.Label>Addon (com divisor)</Field.Label>
						<Field.Row>
							<Field.Addon side="inline-start">https://</Field.Addon>
							<Field.Body>
								<Input placeholder="site.com" />
							</Field.Body>
						</Field.Row>
					</Field.Root>
				</div>
			</section>

			{/* ═══ F5 — Matriz de exemplos ═══ */}
			<section className="flex flex-col gap-6">
				<Text.Heading as="h2">Matriz de exemplos</Text.Heading>

				{/* 5.1 Ícones */}
				<Text.Heading as="h3">5.1 Ícones</Text.Heading>
				<Field.Root>
					<Field.Label>Ícone no início (inset)</Field.Label>
					<Field.Row>
						<Field.Body>
							<span className={field.inset()}>
								<SearchIcon />
							</span>
							<Input placeholder="Pesquisar" />
						</Field.Body>
					</Field.Row>
				</Field.Root>
				<Field.Root>
					<Field.Label>Ícone no fim (inset)</Field.Label>
					<Field.Row>
						<Field.Body>
							<Input placeholder="seu@email" type="email" />
							<span className={field.inset()}>
								<MailIcon />
							</span>
						</Field.Body>
					</Field.Row>
				</Field.Root>
				<Field.Root>
					<Field.Label>Ícone em ambos os lados (inset)</Field.Label>
					<Field.Row>
						<Field.Body>
							<span className={field.inset()}>
								<DollarSignIcon />
							</span>
							<Input placeholder="0.00" />
							<span className={field.inset()}>
								<HashIcon />
							</span>
						</Field.Body>
					</Field.Row>
				</Field.Root>
				<Field.Root>
					<Field.Label>Dois ícones no fim (inset)</Field.Label>
					<Field.Row>
						<Field.Body>
							<Input
								placeholder={showPassword ? "senha" : "••••••••"}
								type={showPassword ? "text" : "password"}
							/>
							<span className={field.inset()}>
								<button
									type="button"
									onClick={() => setShowPassword((v) => !v)}
									className="cursor-pointer"
									aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
								>
									{showPassword ? <EyeOffIcon /> : <EyeIcon />}
								</button>
							</span>
							<span className={field.inset()}>
								<SearchIcon />
							</span>
						</Field.Body>
					</Field.Row>
				</Field.Root>
				<Field.Root>
					<Field.Label>Ícone no início como addon (com divisor)</Field.Label>
					<Field.Row>
						<Field.Addon side="inline-start">
							<SearchIcon />
						</Field.Addon>
						<Field.Body>
							<Input placeholder="Pesquisar" />
						</Field.Body>
					</Field.Row>
				</Field.Root>

				{/* 5.2 Texto */}
				<Text.Heading as="h3">5.2 Texto</Text.Heading>
				<Field.Root>
					<Field.Label>Texto no início</Field.Label>
					<Field.Row>
						<Field.Addon side="inline-start">https://</Field.Addon>
						<Field.Body>
							<Input placeholder="site.com" />
						</Field.Body>
					</Field.Row>
				</Field.Root>
				<Field.Root>
					<Field.Label>Texto no fim</Field.Label>
					<Field.Row>
						<Field.Body>
							<Input type="number" placeholder="70" />
						</Field.Body>
						<Field.Addon side="inline-end">Kg</Field.Addon>
					</Field.Row>
				</Field.Root>
				<Field.Root>
					<Field.Label>Texto em ambos os lados</Field.Label>
					<Field.Row>
						<Field.Addon side="inline-start">R$</Field.Addon>
						<Field.Body>
							<Input placeholder="0,00" inputMode="decimal" />
						</Field.Body>
						<Field.Addon side="inline-end">,00</Field.Addon>
					</Field.Row>
				</Field.Root>

				{/* 5.3 Botões */}
				<Text.Heading as="h3">5.3 Botões</Text.Heading>
				<Field.Root>
					<Field.Label>Botão no fim</Field.Label>
					<Field.Row>
						<Field.Body>
							<Input placeholder="seu@email" type="email" />
						</Field.Body>
						<Field.Addon side="inline-end">
							<Clickable.Button variant="ghost" shape="square" size="sm">
								<SendIcon />
							</Clickable.Button>
						</Field.Addon>
					</Field.Row>
				</Field.Root>
				<Field.Root>
					<Field.Label>Botão no início</Field.Label>
					<Field.Row>
						<Field.Addon side="inline-start">
							<Clickable.Button variant="ghost" shape="square" size="sm">
								<SearchIcon />
							</Clickable.Button>
						</Field.Addon>
						<Field.Body>
							<Input placeholder="Pesquisar" />
						</Field.Body>
					</Field.Row>
				</Field.Root>
				<Field.Root>
					<Field.Label>Botão em ambos os lados</Field.Label>
					<Field.Row>
						<Field.Addon side="inline-start">
							<Clickable.Button variant="ghost" shape="square" size="sm">
								<SearchIcon />
							</Clickable.Button>
						</Field.Addon>
						<Field.Body>
							<Input placeholder="Pesquisar" />
						</Field.Body>
						<Field.Addon side="inline-end">
							<Clickable.Button variant="ghost" shape="square" size="sm">
								<SendIcon />
							</Clickable.Button>
						</Field.Addon>
					</Field.Row>
				</Field.Root>
				<Field.Root>
					<Field.Label>Dois botões no fim</Field.Label>
					<Field.Row>
						<Field.Body>
							<Input placeholder="seu@email" type="email" />
						</Field.Body>
						<Field.Addon side="inline-end">
							<div className="flex items-center gap-1">
								<Clickable.Button variant="ghost" shape="square" size="sm">
									<EyeIcon />
								</Clickable.Button>
								<Clickable.Button variant="ghost" shape="square" size="sm">
									<SendIcon />
								</Clickable.Button>
							</div>
						</Field.Addon>
					</Field.Row>
				</Field.Root>

				{/* 5.4 Outros */}
				<Text.Heading as="h3">5.4 Outros</Text.Heading>
				<Field.Root>
					<Field.Label>Kbd no fim</Field.Label>
					<Field.Row>
						<Field.Body>
							<Input placeholder="Buscar..." />
						</Field.Body>
						<Field.Addon side="inline-end">
							<KbdGroup>
								<Kbd>⌘</Kbd>
								<Kbd>K</Kbd>
							</KbdGroup>
						</Field.Addon>
					</Field.Row>
				</Field.Root>
				<Field.Root>
					<Field.Label>Spinner no fim</Field.Label>
					<Field.Row>
						<Field.Body>
							<Input placeholder="Carregando..." disabled />
						</Field.Body>
						<Field.Addon side="inline-end">
							<Spinner />
						</Field.Addon>
					</Field.Row>
				</Field.Root>
				<Field.Root>
					<Field.Label>DropdownMenu no fim (seletor de moeda)</Field.Label>
					<Field.Row>
						<Field.Body>
							<Input placeholder="100.00" inputMode="decimal" />
						</Field.Body>
						<Field.Addon side="inline-end">
							<DropdownMenu.Root>
								<DropdownMenu.Trigger
									render={
										<Clickable.Button variant="ghost">
											USD <ChevronDownIcon />
										</Clickable.Button>
									}
								/>
								<DropdownMenu.Content>
									<DropdownMenu.Item>USD — Dólar</DropdownMenu.Item>
									<DropdownMenu.Item>EUR — Euro</DropdownMenu.Item>
									<DropdownMenu.Item>BRL — Real</DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</Field.Addon>
					</Field.Row>
				</Field.Root>

				{/* 5.5 Combinações */}
				<Text.Heading as="h3">5.5 Combinações</Text.Heading>
				<Field.Root>
					<Field.Label>Texto no início + dropdown no fim</Field.Label>
					<Field.Row>
						<Field.Addon side="inline-start">https://</Field.Addon>
						<Field.Body>
							<Input placeholder="site.com" />
						</Field.Body>
						<Field.Addon side="inline-end">
							<DropdownMenu.Root>
								<DropdownMenu.Trigger
									render={
										<Clickable.Button variant="ghost" shape="square" size="sm">
											<GlobeIcon />
										</Clickable.Button>
									}
								/>
								<DropdownMenu.Content>
									<DropdownMenu.Item>.com</DropdownMenu.Item>
									<DropdownMenu.Item>.org</DropdownMenu.Item>
									<DropdownMenu.Item>.dev</DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</Field.Addon>
					</Field.Row>
				</Field.Root>
				<Field.Root>
					<Field.Label>Botão + texto de um lado, dropdown do outro</Field.Label>
					<Field.Row>
						<Field.Addon side="inline-start">
							<Clickable.Button variant="ghost" shape="square" size="sm">
								<AtSignIcon />
							</Clickable.Button>
						</Field.Addon>
						<Field.Body>
							<Input placeholder="usuario" />
						</Field.Body>
						<Field.Addon side="inline-end">
							<DropdownMenu.Root>
								<DropdownMenu.Trigger
									render={
										<Clickable.Button variant="ghost">
											.com <ChevronDownIcon />
										</Clickable.Button>
									}
								/>
								<DropdownMenu.Content>
									<DropdownMenu.Item>.com</DropdownMenu.Item>
									<DropdownMenu.Item>.org</DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</Field.Addon>
					</Field.Row>
				</Field.Root>
				<Field.Root>
					<Field.Label>Ícone (inset) + texto (addon) no mesmo lado</Field.Label>
					<Field.Row>
						<Field.Addon side="inline-start">R$</Field.Addon>
						<Field.Body>
							<span className={field.inset()}>
								<DollarSignIcon />
							</span>
							<Input placeholder="0,00" inputMode="decimal" />
						</Field.Body>
					</Field.Row>
				</Field.Root>
				<Field.Root>
					<Field.Label>
						Ícone (inset) + botão (addon) + spinner (inset)
					</Field.Label>
					<Field.Row>
						<Field.Body>
							<span className={field.inset()}>
								<SearchIcon />
							</span>
							<Input placeholder="Buscando..." />
							<span className={field.inset()}>
								<Spinner />
							</span>
						</Field.Body>
						<Field.Addon side="inline-end">
							<Clickable.Button variant="ghost" shape="square" size="sm">
								<SendIcon />
							</Clickable.Button>
						</Field.Addon>
					</Field.Row>
				</Field.Root>
			</section>

			{/* ═══ F6 — Exemplos compostos (eixo block) ═══ */}
			<section className="flex flex-col gap-6">
				<Text.Heading as="h2">Exemplos compostos (eixo block)</Text.Heading>

				{/* 6.1 Mini editor de código */}
				<Field.Root>
					<Field.Label>6.1 — Mini editor de código (block-start)</Field.Label>
					<Field.Row>
						<Field.Addon side="block-start">
							<div className="flex w-full items-center justify-between py-2">
								<span className="text-xs font-medium">app.tsx</span>
								<div className="flex items-center gap-1">
									<Clickable.Button variant="ghost" shape="square" size="sm">
										<CopyIcon />
									</Clickable.Button>
									<Clickable.Button variant="ghost" shape="square" size="sm">
										<ExpandIcon />
									</Clickable.Button>
								</div>
							</div>
						</Field.Addon>
						<Field.Body>
							<Textarea
								rows={4}
								className="font-mono text-xs"
								placeholder={"function App() {\n  return <div>hello</div>\n}"}
								defaultValue={"function App() {\n  return <div>hello</div>\n}"}
							/>
						</Field.Body>
					</Field.Row>
				</Field.Root>

				{/* 6.2 Textarea com barra inferior */}
				<Field.Root>
					<Field.Label>
						6.2 — Textarea com barra inferior (block-end)
					</Field.Label>
					<Field.Row>
						<Field.Body>
							<Textarea rows={3} placeholder="Escreva algo..." />
						</Field.Body>
						<Field.Addon side="block-end">
							<div className="flex w-full items-center justify-between py-2">
								<span className="text-xs">0 / 200</span>
								<Clickable.Button variant="solid" size="sm">
									<SendIcon />
									Enviar
								</Clickable.Button>
							</div>
						</Field.Addon>
					</Field.Row>
				</Field.Root>

				{/* 6.3 block-start + block-end no mesmo campo */}
				<Field.Root>
					<Field.Label>
						6.3 — block-start + block-end no mesmo campo
					</Field.Label>
					<Field.Row>
						<Field.Addon side="block-start">
							<div className="flex w-full items-center gap-2 py-2">
								<HashIcon />
								<span className="text-xs font-medium">Comentário</span>
							</div>
						</Field.Addon>
						<Field.Body>
							<Textarea rows={2} placeholder="Seu comentário..." />
						</Field.Body>
						<Field.Addon side="block-end">
							<div className="flex w-full items-center justify-between py-2">
								<KbdGroup>
									<Kbd>⌘</Kbd>
									<Kbd>Enter</Kbd>
								</KbdGroup>
								<Clickable.Button variant="solid" shape="square" size="sm">
									<SendIcon />
								</Clickable.Button>
							</div>
						</Field.Addon>
					</Field.Row>
				</Field.Root>

				{/* 6.4 Os quatro lados simultâneos */}
				<Field.Root>
					<Field.Label>
						6.4 — Os quatro lados simultâneos (teste que o shadcn não passa)
					</Field.Label>
					<Field.Row>
						<Field.Addon side="block-start">
							<div className="flex w-full items-center justify-between py-2">
								<span className="text-xs font-medium">Editor</span>
								<Clickable.Button variant="ghost" shape="square" size="sm">
									<CopyIcon />
								</Clickable.Button>
							</div>
						</Field.Addon>
						<Field.Addon side="inline-start">
							<SearchIcon />
						</Field.Addon>
						<Field.Body>
							<Input placeholder="Conteúdo..." />
						</Field.Body>
						<Field.Addon side="inline-end">
							<Clickable.Button variant="ghost" shape="square" size="sm">
								<ExpandIcon />
							</Clickable.Button>
						</Field.Addon>
						<Field.Addon side="block-end">
							<div className="flex w-full items-center justify-between py-2">
								<span className="text-xs">Pronto</span>
								<Spinner />
							</div>
						</Field.Addon>
					</Field.Row>
				</Field.Root>
			</section>

			{/* ═══ F7 — Validação: estados ═══ */}
			<section className="flex flex-col gap-6">
				<Text.Heading as="h2">Validação — estados</Text.Heading>

				{/* Estado inválido com addon */}
				<Field.Root invalid>
					<Field.Label>
						Estado inválido (palette danger herda addon)
					</Field.Label>
					<Field.Row>
						<Field.Addon side="inline-start">R$</Field.Addon>
						<Field.Body>
							<Input placeholder="0,00" defaultValue="abc" />
						</Field.Body>
						<Field.Addon side="inline-end">,00</Field.Addon>
					</Field.Row>
					<Field.Error>Valor inválido</Field.Error>
				</Field.Root>

				{/* Disabled com addon */}
				<Field.Root disabled>
					<Field.Label>Disabled (alcança os addons)</Field.Label>
					<Field.Row>
						<Field.Addon side="inline-start">
							<SearchIcon />
						</Field.Addon>
						<Field.Body>
							<Input placeholder="Desativado" />
						</Field.Body>
						<Field.Addon side="inline-end">
							<Clickable.Button variant="ghost" shape="square" size="sm">
								<SendIcon />
							</Clickable.Button>
						</Field.Addon>
					</Field.Row>
				</Field.Root>

				{/* Foco com addon — o outline envolve o campo inteiro */}
				<Field.Root>
					<Field.Label>Foco (outline envolve o campo inteiro)</Field.Label>
					<Field.Row>
						<Field.Addon side="inline-start">https://</Field.Addon>
						<Field.Body>
							<Input placeholder="Clique para focar" />
						</Field.Body>
						<Field.Addon side="inline-end">
							<Clickable.Button variant="ghost" shape="square" size="sm">
								<SendIcon />
							</Clickable.Button>
						</Field.Addon>
					</Field.Row>
				</Field.Root>
			</section>

			{/* ═══ Composition (existente) ═══ */}
			<section className="flex flex-col gap-6">
				<Text.Heading as="h2">Composition</Text.Heading>

				{/* Input com label, description, error */}
				<Field.Root
					validate={() => {
						return null;
					}}
					validationMode="onChange"
				>
					<Field.Label>Nome</Field.Label>
					<Field.Row>
						<Field.Body>
							<Input placeholder="Seu nome" required />
						</Field.Body>
					</Field.Row>
					<Field.Description>Como aparece no perfil.</Field.Description>
					<Field.Error>Campo obrigatório</Field.Error>
				</Field.Root>

				{/* Input com addon fora */}
				<Field.Root>
					<Field.Label>Peso</Field.Label>
					<Field.Row>
						<Field.Body>
							<Input type="number" placeholder="70" />
						</Field.Body>
						<Field.Addon side="inline-end">Kg</Field.Addon>
					</Field.Row>
				</Field.Root>

				{/* Input com inset (lucide-react, não emoji) */}
				<Field.Root>
					<Field.Label>Buscar</Field.Label>
					<Field.Row>
						<Field.Body>
							<span className={field.inset()}>
								<SearchIcon />
							</span>
							<Input placeholder="Pesquisar..." />
						</Field.Body>
					</Field.Row>
				</Field.Root>

				{/* Textarea */}
				<Field.Root>
					<Field.Label>Bio</Field.Label>
					<Field.Row>
						<Field.Body>
							<Textarea rows={3} placeholder="Sobre você" />
						</Field.Body>
					</Field.Row>
					<Field.Description>Máx 200 caracteres.</Field.Description>
				</Field.Root>

				{/* Numeric */}
				<Field.Root>
					<Field.Label>Idade</Field.Label>
					<Field.Row>
						<Field.Body>
							<Numeric min={0} max={120} step={1} placeholder="25" />
						</Field.Body>
					</Field.Row>
				</Field.Root>

				{/* Select */}
				<Field.Root>
					<Field.Label>País</Field.Label>
					<Select.Root defaultValue="br">
						<Field.Row>
							<Field.Body>
								<Select.Trigger>
									<Select.Value />
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="br">Brasil</Select.Item>
									<Select.Item value="us">Estados Unidos</Select.Item>
									<Select.Item value="pt">Portugal</Select.Item>
								</Select.Content>
							</Field.Body>
						</Field.Row>
					</Select.Root>
				</Field.Root>

				{/* Checkbox via ChoiceRoot */}
				<Field.ChoiceRoot>
					<Checkbox />
					<div className="flex flex-col gap-1">
						<Field.Label>Aceito os termos</Field.Label>
						<Field.Description>Leia antes de aceitar.</Field.Description>
					</div>
				</Field.ChoiceRoot>

				{/* Switch via ChoiceRoot */}
				<Field.ChoiceRoot>
					<Switch />
					<div className="flex flex-col gap-1">
						<Field.Label>Notificações</Field.Label>
					</div>
				</Field.ChoiceRoot>

				{/* RadioGroup */}
				<Field.Root>
					<Field.Label>Plano</Field.Label>
					<RadioGroup.Root defaultValue="free">
						<div className={field.choiceRoot()}>
							<RadioGroup.Item value="free" />
							<Field.Label>Free</Field.Label>
						</div>
						<div className={field.choiceRoot()}>
							<RadioGroup.Item value="pro" />
							<Field.Label>Pro</Field.Label>
						</div>
					</RadioGroup.Root>
				</Field.Root>
			</section>

			{/* ═══ Template (existente) ═══ */}
			<section className="flex flex-col gap-6">
				<Text.Heading as="h2">Template</Text.Heading>

				{/* Input.Template.Simple — completo */}
				<Input.Template.Simple
					label="Email"
					description="Não compartilhamos."
					error="Email inválido"
					required
					inset={<span>@</span>}
					addon=".com"
					type="email"
					placeholder="seu@email"
				/>

				{/* Input.Template.Simple — mínimo */}
				<Input.Template.Simple label="Telefone" placeholder="(11) 99999-9999" />

				{/* Input.Template.Simple — palette danger */}
				<Input.Template.Simple
					label="CPF"
					className="palette-danger"
					placeholder="000.000.000-00"
				/>
			</section>
		</div>
	);
}
