# Fragiola — Projeto de Validation

## Contexto

Este projeto é um **spike de validation** para o Fragiola, um design system de componentes de UI inspirado no ShadCN, mas com melhorias arquiteturais. O Fragiola final será uma biblioteca pública com CLI, registry, site de docs, etc. — mas este projeto serve apenas para validar duas coisas antes de construir a lib definitiva.

## O que está sendo validado

### 1. Evitar duplicação de código entre componentes

No ShadCN, componentes que compartilham o mesmo "esqueleto" visual (ex: `context-menu`, `dropdown-menu`, `menubar`) têm o CSS duplicado em cada arquivo de estilo. Mudar o padding de um item de menu exige editar 3 componentes x 8 arquivos de estilo = 24 edições.

**Objetivo:** validar uma arquitetura com **primitivos de estilo compartilhados** — extrair classes base (ex: `.cn-menu-content`, `.cn-menu-item`) que os componentes específicos herdam e sobrescrevem apenas as diferenças.

**Pares duplicados mapeados no ShadCN:**
- `context-menu` ~= `dropdown-menu` (14/14 classes quase idênticas, 285 linhas cada)
- `menubar` ~= `dropdown-menu` (10/14 classes em comum)
- `select` ~= `combobox` (11/16 classes em comum)
- `dialog` ~= `sheet` ~= `drawer` (~8 classes similares)

### 2. Aplicar o design system ao conjunto inteiro de componentes

Pegar todos os ~62 componentes disponíveis na base UI do ShadCN, aplicar o design system do Fragiola, e verificar:
- O conjunto inteiro fica visualmente coerente?
- Alguns componentes quebram com a abstração de primitivos?
- A troca de variantes funciona em todos?
- Performance/bundle com ~62 componentes + Tailwind v4

## Sistema de tokens em 3 camadas (já validado em produção)

O Fragiola usa um sistema de tokens em 3 camadas que **já foi validado em projetos reais** (~60k acessos/mensais). Não precisa revalidar isso — só aplicá-lo ao conjunto completo de componentes.

```
Camada 3: Componentes          → usam bg-token-primary, text-token-fg, etc.
Camada 2: Tokens semânticos    → --token-primary, --token-accent, --token-bg (contrato fixo)
Camada 1: Variantes (N)        → --brand-primary, --brand-accent (troca para mudar tema)
```

Tokens apontam para variantes:
```css
--token-primary: var(--brand-primary);
--token-accent: var(--brand-accent);
```

Para trocar de variante, reatribui o ponteiro. Mesmo esquema se aplica a espaçamentos.

## Estado atual do projeto

### Estrutura

```
validation/src/
├── components/ui/          ← 62 componentes .tsx (copiados da base UI do ShadCN)
├── lib/utils.ts            ← cn() helper (clsx + tailwind-merge)
├── hooks/use-mobile.ts     ← hook de detecção mobile
└── styles/
    └── style-nova.css      ← CSS do estilo "nova" do ShadCN (referência, ainda não convertido)
```

### O que já foi feito

- [x] Scaffold do projeto: Vite + React + TanStack Router + Biome + Tailwind v4
- [x] 62 componentes .tsx copiados de `shadcn-ui/apps/v4/registry/bases/base/ui/`
- [x] `lib/utils.ts` (cn) copiado
- [x] `hooks/use-mobile.ts` copiado
- [x] `style-nova.css` copiado como referência
- [x] Imports ajustados: `@/registry/bases/base/ui/` → `@/components/ui/`, etc.
- [x] `sink.tsx` removido (agregador de demos, irrelevante aqui)

### O que falta fazer

- [ ] Instalar dependências npm dos componentes:
  - `@base-ui/react` (principal — todos os primitivos)
  - `@shadcn/react` (usado por questionnaire.tsx)
  - `class-variance-authority`
  - `cmdk`
  - `input-otp`
  - `react-resizable-panels`
  - `recharts`
  - `sonner`
  - `next-themes` (usado por sonner.tsx e toast.tsx)
- [ ] Configurar Tailwind v4 (globals.css com @theme inline, CSS variables, custom variants)
- [ ] Definir o contrato de tokens semânticos (camada 2)
- [ ] Criar 2-3 variantes de exemplo (camada 1)
- [ ] Converter os componentes para usar o sistema de tokens do Fragiola
- [ ] Extrair primitivos de estilo compartilhados (menu, dialog/sheet/drawer, select/combobox)
- [ ] Montar um playground que renderiza todos os componentes e troca variantes em runtime

## Stack

- **Framework:** Vite + React 19 + TanStack Router
- **Linter/Formatter:** Biome
- **CSS:** Tailwind CSS v4 (via @tailwindcss/vite)
- **Package manager:** pnpm
- **Node:** ver `.nvmrc` se existir

## Referência do ShadCN

O projeto original do ShadCN está em `/home/maurodesouza/organizations/fragiola/shadcn-ui`. Pontos de referência úteis:

- `apps/v4/registry/bases/base/ui/` — fonte original dos componentes (já copiados)
- `apps/v4/registry/styles/style-nova.css` — CSS do estilo nova (já copiado como referência)
- `apps/v4/registry/themes.ts` — CSS variables de cor (OKLCH, light/dark)
- `apps/v4/registry/config.ts` — config central do registry (DEFAULT_CONFIG, PRESETS)
- `apps/v4/registry/fonts.ts` + `apps/v4/lib/font-definitions.ts` — definições de fontes
- `apps/v4/app/globals.css` — como o Tailwind v4 é configurado no app de docs

## Decisões arquiteturais

1. **Não usar Turborepo/monorepo neste MVP** — projeto único, migra para monorepo depois
2. **Não usar Next.js neste MVP** — Vite é mais rápido para iterar em componentes
3. **Só componentes da base UI** (não Radix, não Aria) — reduz escopo
4. **Tokens em 3 camadas já validados** — foco está em primitivos compartilhados e conjunto completo
