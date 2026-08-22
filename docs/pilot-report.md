# Relatório do Pilot — Observações da Validação

> Resultado da Fase 5 (#7). Respostas objetivas, não "funcionou".
> Cada pergunta do `docs/implementation-plan.md` é respondida abaixo.

---

## 1. Faltou algum papel?

**Não.** Os 5 papéis cobriram todos os casos de uso encontrados nos
componentes do pilot (Clickable, Text, Dialog):

| papel | onde foi usado |
|---|---|
| `subtle` | fundo do body, fundo do dialog, hover de ghost/outline/icon, fundo do footer |
| `line` | borda do dialog, borda do footer, borda do outline button |
| `solid` | fill do solid button, focus ring (`outline-palette-solid`) |
| `accent` | texto de todos os átomos, texto de ghost/outline/icon button |
| `contrast` | texto sobre solid button |

O token `--color-scrim` (overlay do dialog) é **fora do contrato de palette**
— é um token global, não um 6º papel de palette. Não houve necessidade de
um 6º token de palette.

---

## 2. Texto secundário

**Achado confirmado: título e descrição do dialog têm a mesma cor.**

`DialogTitle` usa `Text.Heading` (`text-palette-accent` + `font-semibold` +
`text-lg`) e `DialogDescription` usa `Text.Paragraph` (`text-palette-accent` +
`text-sm`). Ambos herdam `--palette-accent` da `palette-raised` do dialog.

A distinção visual fica por conta de **peso** (semibold vs normal) e
**tamanho** (lg vs sm), não de cor. O resultado é legível — a hierarquia
funciona pelo contraste de tamanho/peso — mas é visivelmente menos
hierárquico do que um `text-muted-foreground` ofereceria.

**Não foi contornado com 6º token.** Este é o achado esperado que o pilot
existe para produzir. Decisão sobre texto secundário fica para depois,
com dados reais na mesa.

---

## 3. Aninhamento de palettes

**Confirmado: `tone="default"` dentro de `palette-raised` pega as cores da
superfície elevada.**

**Correção feita durante o pilot:** o mapeamento original
`default: "palette-surface"` **quebrava o aninhamento** — a classe
`palette-surface` no botão sobrescrevia as custom properties do parent
`palette-raised`, fazendo o botão pegar as cores do chão do app em vez da
superfície elevada.

A fix foi mapear `default: ""` (string vazia). Assim, `tone="default"` não
declara nenhuma palette — o botão herda as custom properties do ancestral
mais próximo com palette. No body (`palette-surface`), pega surface. Dentro
de `palette-raised`, pega raised. **Este é o comportamento correto e
esperado pela arquitetura.**

> **Nota arquitetural:** o plano de implementação sugeriu
> `default: "palette-surface"`, mas isso contradiz o critério de aceite do
> Epic. A versão final usa `default: ""` (herança). O `body` sempre tem
> `palette-surface`, então o fallback natural existe.

---

## 4. Contraste (WCAG AA 4.5:1)

**Estimativa por análise de OKLCH — não medido com ferramenta automatizada.**

### Light theme

| palette | solid (L) | contrast (L) | ratio estimado | passa 4.5:1? |
|---|---|---|---|---|
| surface | 0.25 (escuro) | 1.0 (branco) | ~12:1 | ✅ |
| raised | 0.22 (escuro) | 1.0 (branco) | ~14:1 | ✅ |
| brand | 0.55 (médio) | 1.0 (branco) | ~4.5:1 | ⚠️ no limite |
| success | 0.52 (médio) | 1.0 (branco) | ~4:1 | ⚠️ pode reprovar |
| warning | 0.68 (claro) | 0.20 (escuro) | ~6:1 | ✅ |
| danger | 0.55 (médio) | 1.0 (branco) | ~4.5:1 | ⚠️ no limite |

### Dark theme

| palette | solid (L) | contrast (L) | ratio estimado | passa 4.5:1? |
|---|---|---|---|---|
| surface | 0.92 (claro) | 0.15 (escuro) | ~14:1 | ✅ |
| raised | 0.95 (claro) | 0.15 (escuro) | ~15:1 | ✅ |
| brand | 0.70 (médio-claro) | 0.12 (escuro) | ~6:1 | ✅ |
| success | 0.68 (médio-claro) | 0.12 (escuro) | ~6:1 | ✅ |
| warning | 0.75 (claro) | 0.12 (escuro) | ~8:1 | ✅ |
| danger | 0.68 (médio-claro) | 0.12 (escuro) | ~6:1 | ✅ |

**Achado:** no light theme, `brand`, `success` e `danger` com `contrast`
branco estão **no limite ou podem reprovar** 4.5:1. O `solid` nesses casos
tem L~0.52–0.55, que é a faixa onde branco começa a falhar para texto
pequeno. **Calibragem necessária**: ou escurecer o `solid` (baixar L para
~0.48) ou usar `contrast` escuro em algumas palettes no light.

**Não é stop condition** — é calibragem de valor, não mudança de contrato.
O contrato de 5 papéis funciona; os valores precisam de ajuste fino.

---

## 5. Hover derivado (`--palette-state-shift`)

**A derivação funciona, com uma ressalva.**

`--palette-state-shift` é -0.06 (light) / +0.06 (dark). A derivação
`oklch(from var(--palette-solid) calc(l + shift) c h)` ajusta lightness
mantendo chroma e hue.

| palette | solid L (light) | hover L | visível? |
|---|---|---|---|
| surface | 0.25 | 0.19 | ✅ sim |
| brand | 0.55 | 0.49 | ✅ sim |
| success | 0.52 | 0.46 | ✅ sim |
| warning | 0.68 | 0.62 | ✅ sim |
| danger | 0.55 | 0.49 | ✅ sim |

No dark theme, surface solid é L=0.92 → hover L=0.98 (quase branco).
**Satura** — a diferença é sutil porque já está muito claro. As palettes de
cor (brand, success, warning, danger) têm L=0.68–0.75, hover vai para
0.74–0.81, que é visível.

**Achado:** o shift de ±0.06 é adequado para a maioria dos casos. Surface
no dark theme satura (já é muito claro). O escape hatch
`--palette-solid-hover` existe para casos onde a derivação não serve — não
foi necessário usar no pilot, mas seria o caminho para surface no dark se
o hover invisível for problema.

---

## 6. Densidade

**Limitação confirmada: `--spacing` afeta tudo, não só padding.**

Com `data-density="compact"` (`--spacing: 0.2rem` vs default `0.25rem`):

- ✅ Padding de botões diminui (px-4 py-2 → 0.8rem/0.4rem em vez de 1rem/0.5rem)
- ✅ Gaps de layout diminuem
- ⚠️ **Ícones encolhem**: `size-8` vira 1.6rem em vez de 2rem (porque
  `size-*` usa `calc(var(--spacing) * n)`)
- ⚠️ **Larguras encolhem**: `w-*` também usa `--spacing`

**Avaliação:** para um dashboard denso, encolher ícones junto pode ser
aceitável (ícones menores combinam com padding menor). Para um CRM onde
você quer cortar padding mas manter ícones legíveis, **não serve**.

**Não justifica tokens semânticos de spacing agora.** A limitação é
conhecida e documentada (architecture.md §2.2). Se casos reais pedirem
densidade não-linear, a solução é eixo ortogonal (ex: `--icon-size`), não
camada semântica de spacing. Registrar para depois.

---

## 7. Tipografia

**A falta de 14px é notável mas não bloqueante no pilot.**

A escala atual: xs=12px, sm=16px, md=20px, lg=28px, xl=40px.

- `Text.Paragraph` usa `text-sm` (16px) — adequado para corpo de texto.
- `Text.Small` usa `text-xs` (12px) — adequado para texto pequeno.
- `DialogDescription` usa `text-sm` (16px) — funciona, mas 14px seria mais
  natural para uma descrição de dialog (text secundário visualmente menor).
- `Text.Error` usa `text-xs` (12px) — funciona.

**Sem 14px**, o salto de 12px para 16px é grande. Descrições de dialog,
labels de form, e texto de menu item tipicamente usam 14px. No pilot,
usar 16px para descrição de dialog funciona porque a distinção com o
título (28px) é clara. Mas em componentes densos (menu item, badge,
célula de tabela), 16px é grande demais e 12px é pequeno demais.

**Line-heights:** Tailwind v4 gera line-heights automáticos
(`--text-sm--line-height: calc(1.25 / 0.875)`), então não foi um problema
no pilot. Mas a escala não tem line-heights explícitos calibrados.

**Achado:** adicionar 14px à escala (`--text-sm: 0.875rem` ou um novo
`--text-sm-2`) é necessário antes de converter os 62 componentes. Não é
mudança de contrato — é calibragem de escala.

---

## 8. `!important`

**Nenhum `!important` restante.**

Verificado em:
- `src/components/atoms/clickable/index.tsx` — zero `!`
- `src/components/atoms/text/index.tsx` — zero `!`
- `src/components/ui/dialog.tsx` — zero `!`
- `src/routes/index.tsx` — zero `!`

O sistema anterior tinha `!` em quase toda classe do `buttonVariants`
(existiam para arbitrar a briga de especificidade entre variant e
`data-[tone=default]`). Sem o caso especial de `default`, a briga
desaparece e os `!` deixam de ser necessários. **A arquitetura cumpre o
que promete.**

---

## Resumo

| pergunta | resposta | ação |
|---|---|---|
| Faltou papel? | Não | — |
| Texto secundário? | Título e descrição com mesma cor; legível mas menos hierárquico | Decidir depois |
| Aninhamento? | Funciona (após fix `default: ""`) | Aplicado |
| Contraste AA? | Dark: ✅. Light: brand/success/danger no limite | Calibrar valores |
| Hover derivado? | Funciona; surface dark satura | Escape hatch existe |
| Densidade? | Ícones/larguras encolhem junto | Aceitável por agora |
| Tipografia? | Falta 14px; line-heights auto ok | Adicionar 14px antes dos 62 |
| `!important`? | Zero | — |

**Conclusão:** o contrato de 5 papéis e a arquitetura de composição via
`render` funcionam. Nenhuma stop condition disparada. Os achados são de
**calibragem** (valores de cor, escala de texto), não de **contrato**.
