// Família `field` — controle de entrada (root, row, body, control, addon,
// inset, label, description, error).
// Origem: três formas de escrever campo no shadcn (Input, Field, InputGroup)
// reduzidas a uma só. Causa-raiz: o Input carregava o próprio corpo (borda,
// fundo, altura), o que forçava um segundo input sem borda para o InputGroup.
//
// Regra do Fragiola: o controle nunca carrega corpo. O corpo é sempre a peça
// `body`. Por isso só existe um input — e criar um controle novo (numeric,
// multi-select, color picker) é escrever só o miolo.
//
// Decisões em docs/architecture.md §5.3 (comportamento vs aparência), §7.5
// (famílias ortogonais), §7.6 (tv, zero variantes), §7.7 (palette mata
// duplicação de cor). Padrão de menu.ts/popup.ts: namespace object, um único
// export, zero exports soltos.
//
// Epic #23 — Fase 1 (#25): zero variantes. Toda variação é membro nomeado.
// choiceRoot (controles marcáveis) entra na Fase 5 (#29) como membro adicional.

import { tv } from "tailwind-variants";

// root — coluna vertical: label acima, corpo (row) no meio, description/error
// abaixo. O espaçamento entre eles vem do gap; nada de margem em cada peça.
const root = tv({
	base: "flex flex-col gap-xs w-full",
});

// row — linha horizontal: body + addons "fora" anexados. items-stretch para o
// addon colar na altura do body. min-w-0 para o body poder encolher.
const row = tv({
	base: "flex items-stretch w-full min-w-0",
});

// body — A CAIXA. Única peça com borda, fundo, altura, padding, focus ring e
// estado inválido. Todos os outros membros são transparentes ou apontam para
// Text.
//
// Altura: min-h-control-height (não h-control-height fixo) para que o textarea
// (altura variável) cresça sem precisar de variante — o controle multilinha
// empurra a altura do body. Para input/select/numeric o body fica em
// control-height pois o conteúdo é de uma linha. Resolução do risco 2.2,
// registrada no field-report.md.
//
// Cor (§7.7): border-palette-line / bg-palette-subtle / text-palette-accent.
// Foco (Fase 0.2): field-focus:outline-palette-solid — uma regra, escrita uma
// vez. Estado inválido: aria-invalid:palette-danger — uma classe substitui as
// 6 declarações com variante de tema do shadcn.
const body = tv({
	base: `
		flex items-center gap-sm w-full min-w-0 min-h-control-height
		rounded-md border border-palette-line bg-palette-subtle
		px-sm text-sm text-palette-accent
		field-focus:outline-solid field-focus:outline-1 field-focus:outline-palette-solid
		aria-invalid:palette-danger
		data-disabled:opacity-50 data-disabled:cursor-not-allowed
	`,
});

// control — o miolo nu. Transparente: sem borda, sem fundo, sem focus ring,
// sem estado inválido, sem tema. Tudo isso mora no body. A cor de texto e
// placeholder vem da palette do body ancestral (text-palette-accent); o
// controle declara o mesmo token para o placeholder/selection herdarem o
// contrato, mas não引入 nenhum papel de caixa.
const control = tv({
	base: `
		w-full min-w-0 bg-transparent outline-none
		text-palette-accent text-sm
		placeholder:text-palette-accent/60
		selection:bg-palette-solid selection:text-palette-contrast
		disabled:opacity-50
		file:border-0 file:bg-transparent file:text-sm file:font-semibold
	`,
});

// addon (FORA) — irmão do body, dentro do row. Bloco anexado com borda própria
// e cantos arredondados só do lado externo (o lado colado ao body perde a
// borda e o arredondamento). Use para prefixo/sufixo "Kg", botão anexo.
// data-side indica o lado; a composição (Fase 3) repassa o atributo.
const addon = tv({
	base: `
		flex items-center shrink-0 self-stretch
		border border-palette-line bg-palette-subtle
		px-sm text-sm text-palette-accent
		data-[side=left]:rounded-l-md data-[side=left]:border-r-0
		data-[side=right]:rounded-r-md data-[side=right]:border-l-0
	`,
});

// inset (DENTRO) — filho direto do body, sem borda, dentro do padding. Use
// para ícone de busca, botão de olho na senha. É conceito DISTINTO do addon
// (fora): o inset não tem borda própria nem cantos — vive dentro da caixa do
// body. A composição posiciona (absoluto) e reserva padding no controle.
const inset = tv({
	base: `
		flex items-center justify-center shrink-0
		text-palette-accent
	`,
});

// label / description / error — apontam para Text (Fase 3 costura via render).
// Aqui a família só declara palette/estado, NÃO tipografia: Text.Label traz
// block/text-sm/font-semibold, Text traz text-sm, Text.Error traz
// palette-danger/text-xs. Redefinir tipografia aqui violaria §5.3 (a mesma
// regra do DialogTitle). O estado data-disabled vem do Base UI FieldLabel/
// FieldDescription/FieldError quando o field está desabilitado.
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
	row,
	body,
	control,
	addon,
	inset,
	label,
	description,
	error,
};
