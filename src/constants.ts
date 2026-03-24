import { Content, Language } from './types';

export const APP_CONTENT: Record<Language, Content> = {
  en: {
    title: "Lumina",
    subtitle: "Your companion for brighter days",
    stats: {
      streak: "Day Streak",
      completed: "Completed",
      today: "Today's Progress",
      mood: "Daily Mood"
    },
    nav: {
      home: "Home",
      exercises: "Exercises",
      journal: "Journal",
      affirmations: "Daily Words",
    },
    affirmations: [
      { text: "You are stronger than you think." },
      { text: "One step at a time is enough." },
      { text: "Your feelings are valid, but they are not your identity." },
      { text: "You deserve peace and happiness." },
      { text: "Healing is not linear, and that's okay." },
      { text: "Today is a new opportunity to be kind to yourself." },
      { text: "Consistency in your treatment is a sign of self-love." },
      { text: "It's okay to ask for help; it's a sign of strength." },
    ],
    compliments: [
      "You have a beautiful heart.",
      "Your resilience is inspiring.",
      "You make a difference in the world just by being in it.",
      "You are worthy of love and respect.",
      "Your courage to face each day is remarkable.",
      "You are a light in many people's lives.",
    ],
    exercises: [
      {
        id: 'p1',
        type: 'physical',
        title: 'Box Breathing',
        description: 'A simple technique to calm the nervous system.',
        instructions: 'Inhale for 4 seconds, hold for 4, exhale for 4, and hold for 4. Repeat 5 times.',
        duration: '2 mins'
      },
      {
        id: 'p2',
        type: 'physical',
        title: 'Gentle Stretching',
        description: 'Release physical tension and improve circulation.',
        instructions: 'Slowly reach for the sky, then touch your toes. Move with your breath. Focus on the sensation in your muscles.',
        duration: '5 mins'
      },
      {
        id: 'w1',
        type: 'written',
        title: 'Gratitude List',
        description: 'Shift your focus to the positive aspects of your day.',
        instructions: 'Write down three small things you are grateful for today. They can be as simple as a good cup of coffee or a kind word.',
      },
      {
        id: 'w2',
        type: 'written',
        title: 'Letter to Yourself',
        description: 'Practice self-compassion and future-oriented thinking.',
        instructions: 'Write a short letter of encouragement to your future self. Remind yourself of your strengths and the progress you have made.',
      },
      {
        id: 'p3',
        type: 'physical',
        title: 'Mindful Walk',
        description: 'Connect with your surroundings and ground yourself.',
        instructions: 'Walk slowly and notice 5 things you can see, 4 you can touch, 3 you can hear. Pay attention to the feeling of your feet on the ground.',
        duration: '10 mins'
      }
    ],
    actions: {
      next: "Next",
      back: "Back",
      done: "Done",
      start: "Start",
      save: "Save Entry",
      instructions: "Instructions",
      more: "More",
      less: "Less"
    }
  },
  pt: {
    title: "Lumina",
    subtitle: "Seu companheiro para dias mais claros",
    stats: {
      streak: "Dias Seguidos",
      completed: "Concluídos",
      today: "Progresso de Hoje",
      mood: "Humor do Dia"
    },
    nav: {
      home: "Início",
      exercises: "Exercícios",
      journal: "Diário",
      affirmations: "Palavras Diárias",
    },
    affirmations: [
      { text: "Você é mais forte do que imagina." },
      { text: "Um passo de cada vez é o suficiente." },
      { text: "Seus sentimentos são válidos, mas não são sua identidade." },
      { text: "Você merece paz e felicidade." },
      { text: "A cura não é linear, e está tudo bem." },
      { text: "Hoje é uma nova oportunidade para ser gentil consigo mesmo." },
      { text: "A consistência no seu tratamento é um ato de amor próprio." },
      { text: "Tudo bem pedir ajuda; é um sinal de força." },
    ],
    compliments: [
      "Você tem um coração lindo.",
      "Sua resiliência é inspiradora.",
      "Você faz a diferença no mundo apenas por estar nele.",
      "Você é digno de amor e respeito.",
      "Sua coragem para enfrentar cada dia é admirável.",
      "Você é uma luz na vida de muitas pessoas.",
    ],
    exercises: [
      {
        id: 'p1',
        type: 'physical',
        title: 'Respiração Quadrada',
        description: 'Uma técnica simples para acalmar o sistema nervoso.',
        instructions: 'Inspire por 4 segundos, segure por 4, expire por 4 e segure por 4. Repita 5 vezes.',
        duration: '2 min'
      },
      {
        id: 'p2',
        type: 'physical',
        title: 'Alongamento Suave',
        description: 'Libere a tensão física e melhore a circulação.',
        instructions: 'Alcance lentamente o céu e depois toque os dedos dos pés. Mova-se com sua respiração. Concentre-se na sensação em seus músculos.',
        duration: '5 min'
      },
      {
        id: 'w1',
        type: 'written',
        title: 'Lista de Gratidão',
        description: 'Mude seu foco para os aspectos positivos do seu dia.',
        instructions: 'Escreva três pequenas coisas pelas quais você é grato hoje. Podem ser tão simples quanto uma boa xícara de café ou uma palavra gentil.',
      },
      {
        id: 'w2',
        type: 'written',
        title: 'Carta para Si Mesmo',
        description: 'Pratique a autocompaixão e o pensamento orientado para o futuro.',
        instructions: 'Escreva uma curta carta de encorajamento para o seu eu do futuro. Lembre-se de seus pontos fortes e do progresso que você fez.',
      },
      {
        id: 'p3',
        type: 'physical',
        title: 'Caminhada Consciente',
        description: 'Conecte-se com o ambiente ao seu redor e sinta-se presente.',
        instructions: 'Caminhe devagar e observe 5 coisas que você pode ver, 4 que pode tocar, 3 que pode ouvir. Preste atenção na sensação dos seus pés no chão.',
        duration: '10 min'
      }
    ],
    actions: {
      next: "Próximo",
      back: "Voltar",
      done: "Concluído",
      start: "Começar",
      save: "Salvar Entrada",
      instructions: "Instruções",
      more: "Mais",
      less: "Menos"
    }
  }
};
