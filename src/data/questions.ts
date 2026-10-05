import type { Level, Question } from "../types/quiz";

export const MSG_CORRECT = "Parabéns! Resposta correta!";
export const MSG_WRONG = "Não foi dessa vez! Vamos aprender.";

type Letter = "a" | "b" | "c";
const LETTERS: readonly Letter[] = ["a", "b", "c"];

/**
 * Caminhos PROVISÓRIOS dos vídeos em Libras (relativos à pasta `public`).
 * Para associar um vídeo, basta colocar o arquivo neste caminho — nenhum código muda.
 * Padrão: videos/nivel-<nível>/q<NN>-pergunta.mp4, q<NN>-alt-<a|b|c>.mp4 e q<NN>-explicacao.mp4
 * Se o arquivo não existir, o modal mostra uma mensagem informativa e o quiz segue normal.
 */
export function videoPath(
  level: number,
  questionNumber: number,
  part: "pergunta" | "explicacao" | Letter,
): string {
  const n = String(questionNumber).padStart(2, "0");
  const file =
    part === "pergunta" || part === "explicacao"
      ? `q${n}-${part}`
      : `q${n}-alt-${part}`;
  return `videos/nivel-${level}/${file}.mp4`;
}

function question(
  id: number,
  level: number,
  category: string,
  statement: string,
  options: readonly [string, string, string],
  correct: Letter,
  explanation: string,
): Question {
  return {
    id,
    level,
    category,
    statement,
    statementVideo: videoPath(level, id, "pergunta"),
    answers: LETTERS.map((letter, i) => ({
      id: letter,
      text: options[i],
      isCorrect: letter === correct,
      librasVideo: videoPath(level, id, letter),
    })),
    explanation,
    explanationVideo: videoPath(level, id, "explicacao"),
    successMessage: MSG_CORRECT,
    errorMessage: MSG_WRONG,
  };
}

export const levels: Level[] = [
  {
    id: 1,
    title: "Segurança digital básica",
    difficulty: "Básico",
    objective:
      "Conceitos fundamentais de proteção digital e situações comuns de risco.",
    minimumScore: 4,
    questions: [
      question(
        1,
        1,
        "Senhas e autenticação",
        "Você precisa criar uma senha para sua conta. Qual opção é mais segura?",
        [
          "12345678",
          "MeuNome123",
          "Uma senha longa, única e difícil de adivinhar.",
        ],
        "c",
        "Senhas longas e únicas dificultam o acesso indevido. Evite informações pessoais e não reutilize a mesma senha em várias contas.",
      ),
      question(
        2,
        1,
        "Phishing",
        "Você recebeu um link desconhecido no WhatsApp. O que fazer?",
        [
          "Clicar imediatamente.",
          "Verificar a origem e não abrir se houver suspeita.",
          "Enviar para todos os amigos.",
        ],
        "b",
        "Links suspeitos podem levar a páginas falsas ou instalar programas maliciosos. Verifique o remetente e a legitimidade da mensagem antes de abrir.",
      ),
      question(
        3,
        1,
        "Segurança em redes",
        "Você está em um shopping e encontra um Wi-Fi gratuito. Qual atitude é mais segura?",
        [
          "Acessar imediatamente o banco.",
          "Desativar todas as proteções do celular.",
          "Evitar operações sensíveis e verificar se a rede é legítima.",
        ],
        "c",
        "Redes públicas podem apresentar riscos. Evite acessar serviços bancários ou inserir informações sensíveis em redes desconhecidas.",
      ),
      question(
        4,
        1,
        "Privacidade e autenticação",
        "Um amigo pediu sua senha para acessar sua conta. O que fazer?",
        [
          "Compartilhar a senha.",
          "Não compartilhar e manter a conta protegida.",
          "Publicar a senha em um grupo privado.",
        ],
        "b",
        "Senhas são pessoais. Compartilhá-las aumenta o risco de acesso indevido e perda de controle da conta.",
      ),
      question(
        5,
        1,
        "Atualizações e vulnerabilidades",
        "Seu celular apresenta uma atualização de segurança. O que fazer?",
        [
          "Ignorar todas as atualizações.",
          "Instalar atualizações oficiais quando disponíveis.",
          "Baixar qualquer arquivo de atualização encontrado na internet.",
        ],
        "b",
        "Atualizações oficiais corrigem falhas e melhoram a proteção do dispositivo. Evite instalar arquivos de fontes desconhecidas.",
      ),
      question(
        6,
        1,
        "Proteção de dados",
        "Um site desconhecido pede seu CPF e endereço para liberar um prêmio. O que fazer?",
        [
          "Informar todos os dados.",
          "Compartilhar também os dados bancários.",
          "Desconfiar e verificar a legitimidade do site.",
        ],
        "c",
        "Golpistas podem utilizar dados pessoais para fraudes. Não forneça informações sem verificar a identidade e a finalidade do solicitante.",
      ),
      question(
        7,
        1,
        "Autenticação multifator",
        "Um aplicativo oferece autenticação em dois fatores. Qual atitude é mais segura?",
        [
          "Ativar a proteção adicional.",
          "Desativar a senha.",
          "Compartilhar os códigos recebidos.",
        ],
        "a",
        "A autenticação em dois fatores adiciona uma camada de proteção. Mesmo que alguém descubra sua senha, poderá encontrar outra barreira para acessar a conta.",
      ),
    ],
  },
  {
    id: 2,
    title: "Segurança digital intermediária",
    difficulty: "Intermediário",
    objective:
      "Situações que exigem mais atenção, análise de riscos e identificação de fraudes.",
    minimumScore: 3,
    questions: [
      question(
        8,
        2,
        "Phishing e engenharia social",
        "Você recebeu um SMS dizendo que sua conta bancária será bloqueada. Há um link para regularizar. O que fazer?",
        [
          "Clicar e informar sua senha.",
          "Acessar o aplicativo oficial ou ligar para o banco por um canal confiável.",
          "Responder a mensagem com seus dados.",
        ],
        "b",
        "Mensagens falsas podem simular comunicações bancárias. Utilize os canais oficiais para verificar qualquer problema na conta.",
      ),
      question(
        9,
        2,
        "Roubo de contas",
        "Uma pessoa se identifica como funcionário de uma empresa e pede seu código de verificação. O que fazer?",
        [
          "Enviar o código imediatamente.",
          "Publicar o código em uma rede social.",
          "Não compartilhar e verificar a solicitação por um canal oficial.",
        ],
        "c",
        "Códigos de verificação podem permitir que terceiros acessem suas contas. Empresas legítimas não precisam que você revele seus códigos secretos de autenticação.",
      ),
      question(
        10,
        2,
        "Malware",
        "Você recebeu um arquivo executável de uma pessoa desconhecida. Qual atitude é mais segura?",
        [
          "Abrir imediatamente.",
          "Não executar e verificar a origem do arquivo.",
          "Desativar o antivírus para abrir.",
        ],
        "b",
        "Arquivos desconhecidos podem conter programas maliciosos. Nunca desative suas proteções para executar arquivos suspeitos.",
      ),
      question(
        11,
        2,
        "Backup e recuperação",
        "Seu computador possui arquivos importantes. Como reduzir o risco de perdê-los?",
        [
          "Fazer cópias de segurança periódicas.",
          "Manter tudo em um único dispositivo.",
          "Excluir os arquivos antigos sem verificar.",
        ],
        "a",
        "O backup permite recuperar informações após falhas, perdas ou ataques. Mantenha cópias atualizadas e protegidas.",
      ),
      question(
        12,
        2,
        "Engenharia social e fraude digital",
        "Um perfil com a foto de um amigo pede dinheiro com urgência. O que fazer?",
        [
          "Transferir imediatamente.",
          "Enviar seus dados bancários.",
          "Confirmar a identidade por outro meio antes de agir.",
        ],
        "c",
        "Perfis podem ser clonados ou invadidos. Confirme a solicitação por ligação ou outro canal confiável antes de transferir dinheiro.",
      ),
    ],
  },
  {
    id: 3,
    title: "Segurança digital avançada",
    difficulty: "Avançado",
    objective:
      "Raciocínio preventivo em situações de privacidade, proteção de dados e incidentes digitais.",
    minimumScore: 3,
    questions: [
      question(
        13,
        3,
        "Privacidade e permissões",
        "Um aplicativo de lanterna solicita acesso aos seus contatos e localização. O que fazer?",
        [
          "Autorizar todas as permissões.",
          "Avaliar a necessidade das permissões e negar as desnecessárias.",
          "Compartilhar também suas senhas.",
        ],
        "b",
        "Aplicativos devem solicitar apenas permissões necessárias às suas funções. Revise os acessos concedidos para proteger sua privacidade.",
      ),
      question(
        14,
        3,
        "Ransomware e resposta a incidentes",
        "Seus arquivos foram bloqueados e apareceu uma mensagem exigindo pagamento. O que fazer?",
        [
          "Seguir imediatamente as instruções do criminoso.",
          "Compartilhar a mensagem com outras pessoas para que paguem.",
          "Desconectar o dispositivo da rede e procurar suporte especializado.",
        ],
        "c",
        "Esse comportamento pode indicar um ataque de ransomware. Isole o dispositivo para reduzir a propagação e procure suporte técnico. A existência de backup seguro pode ajudar na recuperação.",
      ),
      question(
        15,
        3,
        "Incidentes e proteção de contas",
        "Você descobriu que sua senha foi exposta em um vazamento. Qual atitude tomar?",
        [
          "Trocar a senha e proteger as contas relacionadas.",
          "Continuar utilizando a mesma senha.",
          "Publicar a senha para avisar os amigos.",
        ],
        "a",
        "Troque imediatamente a senha comprometida, especialmente em serviços que utilizam a mesma combinação. Ative a autenticação em dois fatores e verifique atividades suspeitas.",
      ),
      question(
        16,
        3,
        "Segurança em dispositivos móveis",
        "Você encontrou um QR Code desconhecido oferecendo um prêmio. O que fazer?",
        [
          "Abrir e informar seus dados bancários.",
          "Verificar o destino do link antes de acessar e não fornecer dados suspeitos.",
          "Compartilhar com todos os contatos.",
        ],
        "b",
        "QR Codes podem esconder links fraudulentos. Verifique o endereço de destino e não forneça informações pessoais ou financeiras sem confirmar a legitimidade.",
      ),
      question(
        17,
        3,
        "Engenharia social e acesso remoto",
        "Uma pessoa diz ser do suporte técnico e pede acesso remoto ao seu computador. O que fazer?",
        [
          "Conceder acesso imediatamente.",
          "Informar sua senha para facilitar o atendimento.",
          "Confirmar a identidade do suporte por um canal oficial antes de permitir qualquer acesso.",
        ],
        "c",
        "Criminosos podem se passar por técnicos para controlar dispositivos e roubar informações. Nunca conceda acesso remoto sem verificar a legitimidade da solicitação.",
      ),
    ],
  },
];

export const TOTAL_QUESTIONS = levels.reduce(
  (sum, level) => sum + level.questions.length,
  0,
);

export function getLevel(id: number | null): Level | undefined {
  return id == null ? undefined : levels.find((level) => level.id === id);
}

export function getNextLevel(id: number): Level | undefined {
  const index = levels.findIndex((level) => level.id === id);
  return index >= 0 ? levels[index + 1] : undefined;
}
