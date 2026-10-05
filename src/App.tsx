import { useEffect, useRef, useState } from 'react';
import { useQuiz } from './hooks/useQuiz';
import type { Screen } from './types/quiz';
import { ConfirmDialog } from './components/ConfirmDialog';
import { Header } from './components/Header';
import { Completion } from './pages/Completion';
import { Home } from './pages/Home';
import { Instructions } from './pages/Instructions';
import { LevelResult } from './pages/LevelResult';
import { Levels } from './pages/Levels';
import { Quiz } from './pages/Quiz';

const SCREEN_TITLES: Record<Screen, string> = {
  home: 'Início',
  instructions: 'Como jogar',
  levels: 'Escolha um nível',
  quiz: 'Pergunta',
  levelResult: 'Resultado do nível',
  completion: 'Jornada concluída',
};

type Pending = 'reset' | 'leave-quiz' | null;

export default function App() {
  const { state, level, question, actions, savedProgress, journeyComplete } = useQuiz();
  const [pending, setPending] = useState<Pending>(null);

  // Ao trocar de tela ou de pergunta: título da página, rolagem ao topo e foco no título da tela.
  const focusKey = `${state.screen}:${state.levelId}:${state.questionIndex}`;
  const firstRender = useRef(true);
  useEffect(() => {
    document.title = `${SCREEN_TITLES[state.screen]} — CyberLibras`;
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0 });
    document.getElementById('screen-title')?.focus({ preventScroll: true });
  }, [focusKey, state.screen]);

  const goToLevels = () => {
    if (state.screen === 'quiz') setPending('leave-quiz');
    else actions.goTo('levels');
  };

  const goHome = () => {
    if (state.screen === 'quiz') setPending('leave-quiz');
    else actions.goTo('home');
  };

  let content;
  switch (state.screen) {
    case 'home':
      content = (
        <Home hasProgress={savedProgress} onStart={() => actions.goTo('instructions')} onContinue={() => actions.goTo('levels')} />
      );
      break;
    case 'instructions':
      content = (
        <Instructions
          hasProgress={savedProgress}
          onBack={() => actions.goTo('home')}
          onBegin={() => (savedProgress ? actions.goTo('levels') : actions.startLevel(1))}
        />
      );
      break;
    case 'levels':
      content = (
        <Levels
          progress={state.progress}
          journeyComplete={journeyComplete}
          newlyUnlocked={state.newlyUnlocked}
          onStartLevel={actions.startLevel}
          onShowCompletion={() => actions.goTo('completion')}
        />
      );
      break;
    case 'quiz':
      content =
        level && question ? (
          <Quiz
            level={level}
            question={question}
            questionIndex={state.questionIndex}
            selectedAnswerId={state.selectedAnswerId}
            confirmed={state.confirmed}
            score={state.score}
            onSelect={actions.select}
            onConfirm={actions.confirm}
            onNext={actions.next}
          />
        ) : null;
      break;
    case 'levelResult':
      content = state.result ? (
        <LevelResult
          result={state.result}
          newlyUnlocked={state.newlyUnlocked}
          onContinue={actions.continueAfterResult}
          onRetry={() => actions.startLevel(state.result!.levelId)}
          onLevels={() => actions.goTo('levels')}
        />
      ) : null;
      break;
    case 'completion':
      content = (
        <Completion progress={state.progress} onLevels={() => actions.goTo('levels')} onRestart={() => setPending('reset')} />
      );
      break;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#conteudo"
        className="sr-only z-50 rounded-xl bg-brand px-4 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
      >
        Ir para o conteúdo principal
      </a>

      <Header
        screen={state.screen}
        hasProgress={savedProgress}
        onHome={goHome}
        onLevels={goToLevels}
        onReset={() => setPending('reset')}
      />

      <main id="conteudo" className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:py-12">
        {content}
      </main>

      <footer className="border-t border-white/10 px-4 py-6 text-center text-sm text-ink-soft">
        CyberLibras · Material educativo. Nenhum dado pessoal é coletado; seu progresso fica apenas neste navegador.
      </footer>

      {pending === 'reset' && (
        <ConfirmDialog
          title="Apagar progresso?"
          message="Isso apaga seus níveis concluídos e suas pontuações neste aparelho e volta para o início. Não dá para desfazer."
          confirmLabel="Apagar e reiniciar"
          onCancel={() => setPending(null)}
          onConfirm={() => {
            setPending(null);
            actions.reset();
          }}
        />
      )}
      {pending === 'leave-quiz' && (
        <ConfirmDialog
          title="Sair deste nível?"
          message="Suas respostas deste nível serão perdidas e você precisará começar o nível de novo. Seu progresso salvo continua."
          confirmLabel="Sair do nível"
          cancelLabel="Continuar no nível"
          onCancel={() => setPending(null)}
          onConfirm={() => {
            setPending(null);
            actions.goTo('levels');
          }}
        />
      )}
    </div>
  );
}
