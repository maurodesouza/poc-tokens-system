// Família `field` — controle de entrada (root, choiceRoot, row, body, control,
// addon, inset, label, description, error).
// Origem: três formas de escrever campo no shadcn (Input, Field, InputGroup)
// reduzidas a uma só. Causa-raiz: o Input carregava o próprio corpo (borda,
// fundo, altura), o que forçava um segundo input sem borda para o InputGroup.
//
// Regra do Fragiola: o controle nunca carrega corpo. A caixa é sempre `row`.
// Por isso só existe um input — e criar um controle novo (numeric,
// multi-select, color picker) é escrever só o miolo.
//
// Decisões em docs/architecture.md §5.3 (comportamento vs aparência), §7.5
// (famílias ortogonais), §7.6 (tv, zero variantes), §7.7 (palette mata
// duplicação de cor). Padrão de menu.ts/popup.ts: namespace object, um único
// export, zero exports soltos.
//
// ─── A CAIXA É O `row`, NÃO O `body` ───────────────────────────────────────
// Correção sobre a primeira versão desta família, que punha borda/fundo no
// `body` e dava borda própria ao `addon`. Colar duas caixas com borda exige
// zerar borda e arredondamento no lado da junção — foi o que gerou os dois
// `!important` (`!rounded-l-none` / `!rounded-r-none`) no projeto de
// referência, e o `border-l-0`/`border-r-0` na versão anterior daqui.
//
// Com a borda no `row`: uma caixa só envolve corpo e addons, o addon vira um
// divisor interno, o `overflow-hidden` do row corta os cantos sem ninguém
// precisar declarar arredondamento, e o focus ring envolve o campo inteiro —
// que é o comportamento correto: focar o input destaca o campo todo, addon
// incluído.
//
//   row     → a caixa: borda, fundo, altura, arredondamento, focus ring
//   body    → área do controle dentro da caixa: padding, flex, gap
//   addon   → irmão do body dentro do row: sem borda própria, só divisor
//   inset   → filho do body: ícone dentro do padding, sem borda nem divisor
//
// ─── ESPAÇAMENTO ───────────────────────────────────────────────────────────
// Escala numérica do Tailwind (architecture.md §2.1). `gap-xs`/`px-sm` não
// existem neste projeto — a escala nomeada foi abandonada, e essas classes
// não compilavam nada.
//
// ─── ESTADO INVÁLIDO ───────────────────────────────────────────────────────
// Vem por herança de palette, não por classe. O Base UI Field emite
// `data-invalid` no Root, e os temas registram `[data-invalid]` como aplicador
// da palette danger — toda a subárvore fica danger sozinha.
// `aria-invalid:palette-danger` NÃO funciona: variants do Tailwind só se
// aplicam a utilities, e `palette-danger` é classe CSS. Verificado compilando.

import { tv } from "tailwind-variants";

// root — coluna vertical: label acima, caixa (row) no meio, description/error
// abaixo. `group/field` permite que row/body/addon reajam ao data-disabled que
// o Base UI emite no Root.
const root = tv({
	base: "group/field flex w-full flex-col gap-2",
});

// choiceRoot — linha horizontal: controle à esquerda, label à direita. Para
// checkbox, radio e switch, que não têm caixa. items-start alinha pelo topo —
// o label pode quebrar em duas linhas e a description fica alinhada com ele,
// não com o controle. Reusa label/description/error; não usa row/body/addon.
const choiceRoot = tv({
	base: "group/field flex w-full flex-row items-start gap-3",
});

// row — A CAIXA. Única peça com borda, fundo, arredondamento e focus ring.
// overflow-hidden corta os cantos dos addons: nenhum filho precisa declarar
// arredondamento. flex-wrap + w-full + order permitem addons nos quatro lados
// (architecture.md §8.4) — sem prop de orientação, sem nível extra de
// aninhamento. min-h-control mora no body (área do controle), não aqui: com
// addon em cima, o row já é mais alto por causa do conteúdo.
const row = tv({
	base: `
		flex w-full min-w-0 flex-wrap items-stretch overflow-hidden
		rounded-md border border-palette-line bg-palette-subtle
		text-sm text-palette-accent
		field-focus:outline-1 field-focus:outline-palette-solid
		group-data-[disabled]/field:cursor-not-allowed
		group-data-[disabled]/field:opacity-50
	`,
});

// body — área do controle dentro da caixa. Sem borda e sem fundo: quem
// desenha a caixa é o row. flex-1 + min-w-0 para encolher junto e não
// empurrar os addons. min-h-control (não h) para o textarea crescer sem
// variante — controle multilinha empurra a altura. Para input/select/numeric
// fica na altura do controle, porque o conteúdo é de uma linha.
const body = tv({
	base: "flex min-h-control min-w-0 flex-1 items-center gap-2 px-3",
});

// control — o miolo nu. Transparente: sem borda, sem fundo, sem focus ring,
// sem estado inválido, sem tema. Tudo isso mora no row. É esta propriedade
// que faz "criar um controle novo" ser escrever só o miolo.
const control = tv({
	base: `
		w-full min-w-0 bg-transparent text-sm text-palette-accent outline-none
		placeholder:text-palette-accent/60
		selection:bg-palette-solid selection:text-palette-contrast
		disabled:cursor-not-allowed
		file:border-0 file:bg-transparent file:text-sm file:font-semibold
	`,
});

// addon (FORA) — irmão do body, dentro do row. Prefixo/sufixo ("Kg",
// "https://") ou botão anexo. Não tem borda própria nem arredondamento: só
// um divisor do lado da junção, e o overflow-hidden do row corta os cantos.
//
// Quatro lados em vocabulário lógico (architecture.md §8.2, §8.4):
//   inline-start / inline-end — eixo inline, border-s/border-e (inverte em RTL)
//   block-start / block-end   — eixo block, border-b/border-t (não inverte)
//                                + w-full + order-first/order-last
//
// Lado é data-side, NÃO variante (§7.6, §8.4). Zero variantes na família.
const addon = tv({
	base: `
		flex shrink-0 items-center self-stretch px-3 text-sm text-palette-accent
		border-palette-line
		data-[side=inline-start]:border-e
		data-[side=inline-end]:border-s
		data-[side=block-start]:w-full data-[side=block-start]:order-first data-[side=block-start]:border-b
		data-[side=block-end]:w-full data-[side=block-end]:order-last data-[side=block-end]:border-t
		[&>kbd]:rounded-[calc(var(--radius-md)-2px)] [&>button]:rounded-[calc(var(--radius-md)-2px)]
	`,
});

// inset (DENTRO) — filho direto do body, dentro do padding. Ícone de busca,
// botão de olho na senha. Conceito DISTINTO do addon: não tem divisor nem
// borda, vive dentro da área do controle. Sem os dois nomes separados isso
// vira a mesma confusão do InputGroup do shadcn.
const inset = tv({
	base: `
		flex shrink-0 items-center justify-center text-palette-accent
		[&>kbd]:rounded-[calc(var(--radius-md)-2px)] [&>button]:rounded-[calc(var(--radius-md)-2px)]
	`,
});

// label / description / error — apontam para Text (a composição costura via
// render). A família só declara palette e estado, NÃO tipografia: Text.Label
// traz block/text-sm/font-semibold, Text traz text-sm, Text.Error traz
// palette-danger/text-xs. Redefinir tipografia aqui violaria §5.3 — a mesma
// regra do DialogTitle. data-disabled vem do próprio Base UI nestes elementos.
const label = tv({
	base: "text-palette-accent data-disabled:opacity-50",
});

const description = tv({
	base: "text-palette-accent data-disabled:opacity-50",
});

const error = tv({
	base: "data-disabled:opacity-50",
});

export const field = {
	root,
	choiceRoot,
	row,
	body,
	control,
	addon,
	inset,
	label,
	description,
	error,
};
