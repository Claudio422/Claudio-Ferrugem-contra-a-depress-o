
export type Language = 'en' | 'pt';

export interface Affirmation {
  text: string;
  author?: string;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  instructions?: string;
  type: 'physical' | 'written';
  duration?: string;
}

export interface ProgressLog {
  date: string; // YYYY-MM-DD
  exercises: string[]; // Array of exercise IDs
  journaled: boolean;
  mood?: string; // Emoji or identifier
}

export interface UserProgress {
  logs: Record<string, ProgressLog>;
  streak: number;
  lastDate?: string;
}

export interface Content {
  title: string;
  subtitle: string;
  stats: {
    streak: string;
    completed: string;
    today: string;
    mood: string;
  };
  affirmations: Affirmation[];
  compliments: string[];
  exercises: Exercise[];
  nav: {
    home: string;
    exercises: string;
    journal: string;
    affirmations: string;
  };
  actions: {
    next: string;
    back: string;
    done: string;
    start: string;
    save: string;
    instructions: string;
    more: string;
    less: string;
  };
}
