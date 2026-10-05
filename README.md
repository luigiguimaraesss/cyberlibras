# CyberLibras

Plataforma educacional bilíngue (PT-BR e Libras) de segurança da informação. É um quiz com 17 situações do dia a dia em 3 níveis, com feedback imediato, explicações e botões de tradução em Libras para cada pergunta e cada alternativa.

Aplicação 100% estática (SPA): **sem backend, sem banco de dados, sem login e sem coleta de dados pessoais**.

## Tecnologias

React 18 · TypeScript · Vite 5 · Tailwind CSS 3 · Lucide (ícones) · Vitest (testes) · fonte Inter (`@fontsource-variable/inter`, hospedada junto com o app).

## Como rodar

Requisitos: Node.js 18 ou superior.

```bash
npm install        # instala as dependências
npm run dev        # servidor local em http://localhost:5173
```

Outros comandos:

```bash
npm run typecheck  # verifica os tipos (tsc)
npm test           # roda os testes (Vitest)
npm run build      # typecheck + build de produção na pasta dist/
npm run preview    # serve a pasta dist/ localmente para conferir o build
```

## Como publicar (hospedagem estática)

O build usa `base: './'`, então a pasta `dist/` funciona na raiz de um domínio ou em subpasta, sem configuração extra.

- **Vercel / Netlify:** importe o repositório. Build command: `npm run build`. Output directory: `dist`.
- **GitHub Pages:** rode `npm run build` e publique o conteúdo de `dist/` (por exemplo com a Action oficial `actions/deploy-pages`, ou copiando `dist/` para a branch `gh-pages`).
- **Qualquer servidor estático:** copie o conteúdo de `dist/`. Não é necessário servidor de aplicação nem regras de reescrita de rotas (o app não usa URLs diferentes por tela).

## Vídeos em Libras

Os vídeos **não vêm incluídos**. Cada pergunta e cada alternativa já aponta para um caminho provisório dentro de `public/`. Para associar um vídeo, basta colocar o arquivo no caminho certo, sem alterar código:

| Conteúdo | Caminho |
|---|---|
| Enunciado da questão NN | `public/videos/nivel-<N>/qNN-pergunta.mp4` |
| Alternativa A, B ou C da questão NN | `public/videos/nivel-<N>/qNN-alt-a.mp4` (`-alt-b`, `-alt-c`) |

Exemplos: `public/videos/nivel-1/q01-pergunta.mp4`, `public/videos/nivel-3/q17-alt-c.mp4`.

- Enquanto o arquivo não existir (ou não carregar), o modal mostra a mensagem “O vídeo em Libras ainda não está disponível” e o quiz continua normal.
- Para usar outro nome ou formato (ex.: `.webm`), edite `statementVideo` / `librasVideo` em `src/data/questions.ts` ou a função `videoPath`. Os caminhos são sempre relativos a `public/`; endereços externos (`http://...`) são ignorados de propósito.
- Os vídeos nunca iniciam sozinhos e têm controles nativos do navegador.
- O app não inclui nenhum vídeo ou imagem fictícia no lugar de traduções reais.

## Como editar as questões

Todo o conteúdo fica em `src/data/questions.ts`, separado da interface. Cada questão usa a função `question(id, nível, tema, enunciado, [A, B, C], correta, explicação)`. Os limites de aprovação ficam em `minimumScore` de cada nível (devem ser “mais da metade”: 7 → 4, 5 → 3). Os testes em `src/data/questions.test.ts` conferem a estrutura (3 alternativas, 1 correta, gabarito, limites) e vão falhar se algo sair do padrão.

## Regras implementadas

- Nível 1 sempre liberado. Cada nível seguinte só libera com aprovação no anterior.
- Aprovação: mínimo de **4/7** (nível 1), **3/5** (nível 2) e **3/5** (nível 3).
- 1 ponto por acerto; cada questão é pontuada uma única vez e não permite trocar a resposta após confirmar.
- A pontuação zera a cada nova tentativa do nível. A **melhor pontuação** e os níveis já liberados são preservados.
- Reprovação: mostra a pontuação, incentivo, revisão das explicações e botão “Tentar novamente”.
- Aprovação no nível 3 abre a tela final de conclusão da jornada (o total considera a melhor pontuação de cada nível).
- Abrir ou fechar o modal de Libras não altera a alternativa selecionada (o modal é estado local da tela).

## Persistência local

O progresso é salvo no `localStorage` (chave `cyberlibras:progress:v1`) e contém apenas, por nível, a melhor pontuação e o número de tentativas. **Nenhum dado pessoal é armazenado.** Níveis desbloqueados e conclusão da jornada são sempre **calculados** a partir desses resultados, e dados inválidos ou adulterados são descartados na leitura. Se o armazenamento estiver indisponível (ex.: aba privada), o app funciona normalmente, só sem salvar.

“Reiniciar” (no cabeçalho e na tela final) apaga o progresso depois de uma confirmação. Uma tentativa em andamento não é salva: ao recarregar a página, o usuário volta ao início com os níveis já conquistados.

## Acessibilidade

- HTML semântico, `lang="pt-BR"`, link “Ir para o conteúdo principal”, título da página atualizado a cada tela e foco movido para o título ao trocar de tela.
- Alternativas como grupo de botões de rádio nativos (setas do teclado funcionam); tudo é utilizável só com teclado, com foco sempre visível.
- Modais com o elemento nativo `<dialog>`: foco preso na janela, fecha com **ESC**, no botão **Fechar** ou clicando **fora**, e o foco volta ao botão que abriu.
- Acerto e erro nunca dependem só de cor: sempre há ícone e texto (“Resposta correta”, “Sua resposta (incorreta)”). O feedback recebe o foco para ser lido por leitores de tela.
- Botões de Libras com texto visível (“Libras” / “Ver em Libras”) e rótulo descritivo para leitores de tela.
- Barra de progresso com `role="progressbar"`; alvos de toque de pelo menos 44 px.
- Animações desativadas automaticamente com `prefers-reduced-motion`.
- Cores de texto escolhidas para contraste AA sobre o fundo escuro. Meta: WCAG 2.2 AA (recomenda-se uma auditoria com usuários surdos e com leitores de tela antes do uso em produção).

## Estrutura

```text
cyberlibras/
├── public/
│   ├── videos/nivel-1|2|3/     # coloque aqui os vídeos em Libras
│   ├── images/
│   └── favicon.svg
├── src/
│   ├── components/   Header, Logo, Modal, LibrasModal, LibrasButton, ProgressBar,
│   │                 QuestionCard, AnswerOption, FeedbackCard, LevelCard,
│   │                 ResultScreen, ConfirmDialog
│   ├── pages/        Home, Instructions, Levels, Quiz, LevelResult, Completion
│   ├── data/         questions.ts (+ testes)     ← conteúdo, independente da interface
│   ├── hooks/        useQuiz.ts (reducer + hook) ← regras de negócio e estado (+ testes)
│   ├── utils/        scoring.ts, storage.ts, assets.ts
│   ├── types/        quiz.ts
│   ├── App.tsx · main.tsx · index.css
├── index.html · vite.config.ts · tailwind.config.js · tsconfig.json · package.json
```

## Testes

`npm test` cobre: integridade das 17 questões e do gabarito; limites 4/3/3; desbloqueio e bloqueio de níveis; pontuação sem duplicidade; reprovação e nova tentativa; conclusão da jornada; reinício; e validação de dados salvos adulterados.
