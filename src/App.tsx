import { useState, useEffect, useMemo, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  BookOpen, 
  Activity, 
  Quote, 
  Languages, 
  ChevronRight, 
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Sparkles,
  Sun,
  Moon,
  Trophy,
  Calendar,
  Save
} from 'lucide-react';
import { Language, Exercise, UserProgress, ProgressLog } from './types';
import { APP_CONTENT } from './constants';
import { generatePersonalizedCompliment } from './services/geminiService';

const STORAGE_KEY = 'lumina_progress';

const getTodayStr = () => new Date().toISOString().split('T')[0];

const MOODS = [
  { emoji: '😔', label: { en: 'Low', pt: 'Baixo' } },
  { emoji: '😐', label: { en: 'Neutral', pt: 'Neutro' } },
  { emoji: '🙂', label: { en: 'Good', pt: 'Bom' } },
  { emoji: '✨', label: { en: 'Great', pt: 'Ótimo' } },
  { emoji: '💪', label: { en: 'Strong', pt: 'Forte' } },
];

export default function App() {
  const [lang, setLang] = useState<Language>('pt');
  const [activeTab, setActiveTab] = useState<'home' | 'exercises' | 'journal' | 'affirmations'>('home');
  const [complimentIndex, setComplimentIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [journalText, setJournalText] = useState('');
  const [personalizedCompliment, setPersonalizedCompliment] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Progress State
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse progress", e);
      }
    }
    return { logs: {}, streak: 0 };
  });

  const content = useMemo(() => APP_CONTENT[lang], [lang]);

  // Persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  // Streak Calculation & Daily Reset
  useEffect(() => {
    const today = getTodayStr();
    const lastDate = progress.lastDate;
    
    if (lastDate && lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      let newStreak = progress.streak;
      if (lastDate !== yesterdayStr) {
        // Streak broken
        newStreak = 0;
      }
      
      setProgress(prev => ({
        ...prev,
        streak: newStreak,
        lastDate: today
      }));
    } else if (!lastDate) {
      setProgress(prev => ({ ...prev, lastDate: today }));
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setComplimentIndex((prev) => (prev + 1) % content.compliments.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [content.compliments.length]);

  const toggleLang = () => setLang(prev => prev === 'en' ? 'pt' : 'en');

  const todayStr = getTodayStr();
  const todayLog: ProgressLog = progress.logs[todayStr] || { date: todayStr, exercises: [], journaled: false };

  const fetchPersonalizedCompliment = async () => {
    setIsGenerating(true);
    try {
      const compliment = await generatePersonalizedCompliment(lang, progress, todayLog);
      setPersonalizedCompliment(compliment);
    } catch (error) {
      console.error("Error fetching personalized compliment:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleExercise = (id: string) => {
    setProgress(prev => {
      const currentLog = prev.logs[todayStr] || { date: todayStr, exercises: [], journaled: false };
      const isCompleted = currentLog.exercises.includes(id);
      
      const newExercises = isCompleted 
        ? currentLog.exercises.filter(exId => exId !== id)
        : [...currentLog.exercises, id];
      
      const wasEmpty = currentLog.exercises.length === 0 && !currentLog.journaled && !currentLog.mood;
      const isNowActive = newExercises.length > 0 || currentLog.journaled || currentLog.mood;
      
      let newStreak = prev.streak;
      if (wasEmpty && isNowActive) {
        newStreak += 1;
      } else if (!isNowActive && !wasEmpty) {
        newStreak = Math.max(0, newStreak - 1);
      }

      return {
        ...prev,
        streak: newStreak,
        logs: {
          ...prev.logs,
          [todayStr]: { ...currentLog, exercises: newExercises }
        }
      };
    });
  };

  const handleSetMood = (moodEmoji: string) => {
    setProgress(prev => {
      const currentLog = prev.logs[todayStr] || { date: todayStr, exercises: [], journaled: false };
      const wasEmpty = currentLog.exercises.length === 0 && !currentLog.journaled && !currentLog.mood;
      
      return {
        ...prev,
        streak: wasEmpty ? prev.streak + 1 : prev.streak,
        logs: {
          ...prev.logs,
          [todayStr]: { ...currentLog, mood: moodEmoji }
        }
      };
    });
    // Fetch personalized compliment after state update
    setTimeout(fetchPersonalizedCompliment, 100);
  };

  const handleSaveJournal = () => {
    if (!journalText.trim()) return;
    
    setProgress(prev => {
      const currentLog = prev.logs[todayStr] || { date: todayStr, exercises: [], journaled: false };
      if (currentLog.journaled) return prev; // Already done

      const wasEmpty = currentLog.exercises.length === 0 && !currentLog.journaled && !currentLog.mood;
      
      return {
        ...prev,
        streak: wasEmpty ? prev.streak + 1 : prev.streak,
        logs: {
          ...prev.logs,
          [todayStr]: { ...currentLog, journaled: true }
        }
      };
    });
    setJournalText('');
  };

  const totalCompleted = Object.values(progress.logs).reduce((acc: number, log: ProgressLog) => acc + log.exercises.length + (log.journaled ? 1 : 0), 0);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-stone-950 text-stone-200' : 'bg-stone-50 text-stone-900'} font-sans`}>
      {/* Header */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-stone-200/20 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-700" />
          </div>
          <h1 className="text-xl font-serif italic tracking-tight">{content.title}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full hover:bg-stone-200/50 transition-colors"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button 
            onClick={toggleLang}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-stone-300 text-sm font-medium hover:bg-stone-100 transition-colors"
          >
            <Languages className="w-4 h-4" />
            {lang.toUpperCase()}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <section className="text-center space-y-4">
                <h2 className="text-4xl font-serif font-light leading-tight">
                  {content.subtitle}
                </h2>
                <div className="h-px w-12 bg-amber-400 mx-auto" />
              </section>

              {/* Mood Selection */}
              <section className="space-y-4">
                <h3 className="text-sm uppercase tracking-widest text-stone-400 font-semibold text-center">
                  {content.stats.mood}
                </h3>
                <div className="flex justify-between items-center bg-white dark:bg-stone-900 p-4 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm">
                  {MOODS.map((m) => (
                    <button 
                      key={m.emoji}
                      onClick={() => handleSetMood(m.emoji)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all ${todayLog.mood === m.emoji ? 'bg-amber-50 dark:bg-amber-900/20 scale-110' : 'hover:bg-stone-50 dark:hover:bg-stone-800'}`}
                    >
                      <span className="text-2xl">{m.emoji}</span>
                      <span className="text-[8px] uppercase font-bold text-stone-400">{m.label[lang]}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Stats Grid */}
              <section className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 shadow-sm flex flex-col items-center justify-center text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="text-2xl font-serif font-bold">{progress.streak}</span>
                  <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">{content.stats.streak}</span>
                </div>
                <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 shadow-sm flex flex-col items-center justify-center text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-2xl font-serif font-bold">{totalCompleted}</span>
                  <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">{content.stats.completed}</span>
                </div>
              </section>

              {/* Compliment Card */}
              <section className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-stone-900 dark:to-stone-800 border border-amber-100/50 shadow-xl shadow-amber-900/5">
                <div className="relative z-10 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-amber-600 font-bold">
                      {personalizedCompliment ? (lang === 'en' ? 'Personalized for you' : 'Personalizado para você') : (lang === 'en' ? 'A thought for you' : 'Um pensamento para você')}
                    </span>
                    {todayLog.mood && (
                      <button 
                        onClick={fetchPersonalizedCompliment}
                        disabled={isGenerating}
                        className="p-1.5 rounded-full hover:bg-amber-100/50 dark:hover:bg-stone-700 transition-colors disabled:opacity-50"
                      >
                        <Sparkles className={`w-3.5 h-3.5 text-amber-600 ${isGenerating ? 'animate-pulse' : ''}`} />
                      </button>
                    )}
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.p 
                      key={personalizedCompliment || complimentIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="text-2xl font-serif italic text-stone-800 dark:text-stone-100"
                    >
                      "{personalizedCompliment || content.compliments[complimentIndex]}"
                    </motion.p>
                  </AnimatePresence>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-10">
                  <Heart className="w-32 h-32 fill-amber-400" />
                </div>
              </section>

              {/* Daily Affirmation */}
              <section className="space-y-6">
                <h3 className="text-sm uppercase tracking-widest text-stone-400 font-semibold text-center">
                  {content.nav.affirmations}
                </h3>
                <div className="grid gap-4">
                  {content.affirmations.slice(0, 3).map((aff, i) => (
                    <div 
                      key={i}
                      className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <p className="text-lg text-stone-700 dark:text-stone-300">
                        {aff.text}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'exercises' && (
            <motion.div 
              key="exercises"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <header className="text-center">
                <h2 className="text-3xl font-serif">{content.nav.exercises}</h2>
                <p className="text-stone-500 mt-2">
                  {lang === 'en' ? 'Small actions, big changes.' : 'Pequenas ações, grandes mudanças.'}
                </p>
              </header>

              <div className="space-y-4">
                {content.exercises.filter(e => e.type === 'physical').map((ex) => (
                  <ExerciseCard 
                    key={ex.id} 
                    exercise={ex} 
                    actionLabel={content.actions.start} 
                    completed={todayLog.exercises.includes(ex.id)}
                    onToggle={() => handleToggleExercise(ex.id)}
                    labels={{
                      instructions: content.actions.instructions,
                      more: content.actions.more,
                      less: content.actions.less
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'journal' && (
            <motion.div 
              key="journal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <header className="text-center">
                <h2 className="text-3xl font-serif">{content.nav.journal}</h2>
                <p className="text-stone-500 mt-2">
                  {lang === 'en' ? 'Let your thoughts flow.' : 'Deixe seus pensamentos fluírem.'}
                </p>
              </header>

              <div className="space-y-4">
                {content.exercises.filter(e => e.type === 'written').map((ex) => (
                  <ExerciseCard 
                    key={ex.id} 
                    exercise={ex} 
                    actionLabel={content.actions.start} 
                    completed={todayLog.exercises.includes(ex.id)}
                    onToggle={() => handleToggleExercise(ex.id)}
                    labels={{
                      instructions: content.actions.instructions,
                      more: content.actions.more,
                      less: content.actions.less
                    }}
                  />
                ))}
              </div>

              <div className="space-y-4">
                <div className="p-8 rounded-3xl bg-stone-100 dark:bg-stone-900 border border-dashed border-stone-300 dark:border-stone-700">
                  <textarea 
                    value={journalText}
                    onChange={(e) => setJournalText(e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 text-lg min-h-[200px] resize-none"
                    placeholder={lang === 'en' ? 'Write here...' : 'Escreva aqui...'}
                  />
                </div>
                <button 
                  onClick={handleSaveJournal}
                  disabled={!journalText.trim() || todayLog.journaled}
                  className={`w-full py-4 rounded-full flex items-center justify-center gap-2 font-bold transition-all ${todayLog.journaled ? 'bg-green-500 text-white' : 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:scale-[1.02] active:scale-95 disabled:opacity-50'}`}
                >
                  {todayLog.journaled ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                  {todayLog.journaled ? (lang === 'en' ? 'Saved' : 'Salvo') : content.actions.save}
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'affirmations' && (
            <motion.div 
              key="affirmations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <header className="text-center">
                <h2 className="text-3xl font-serif">{content.nav.affirmations}</h2>
              </header>

              <div className="grid gap-6">
                {content.affirmations.map((aff, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 shadow-sm text-center italic text-xl font-serif"
                  >
                    "{aff.text}"
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation Bar */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
        <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl rounded-full p-2 shadow-2xl border border-stone-200/50 dark:border-stone-800/50 flex justify-between items-center">
          <NavButton 
            active={activeTab === 'home'} 
            onClick={() => setActiveTab('home')}
            icon={<Sun className="w-5 h-5" />}
            label={content.nav.home}
          />
          <NavButton 
            active={activeTab === 'exercises'} 
            onClick={() => setActiveTab('exercises')}
            icon={<Activity className="w-5 h-5" />}
            label={content.nav.exercises}
          />
          <NavButton 
            active={activeTab === 'journal'} 
            onClick={() => setActiveTab('journal')}
            icon={<BookOpen className="w-5 h-5" />}
            label={content.nav.journal}
          />
          <NavButton 
            active={activeTab === 'affirmations'} 
            onClick={() => setActiveTab('affirmations')}
            icon={<Quote className="w-5 h-5" />}
            label={content.nav.affirmations}
          />
        </div>
      </nav>
    </div>
  );
}

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}

function NavButton({ active, onClick, icon, label }: NavButtonProps) {
  return (
    <button 
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center w-16 h-16 rounded-full transition-all duration-300 ${active ? 'text-amber-600' : 'text-stone-400 hover:text-stone-600'}`}
    >
      {active && (
        <motion.div 
          layoutId="nav-bg"
          className="absolute inset-0 bg-amber-50 dark:bg-amber-900/20 rounded-full"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
        />
      )}
      <div className="relative z-10">
        {icon}
      </div>
      <span className="relative z-10 text-[9px] uppercase tracking-tighter font-bold mt-1">{label}</span>
    </button>
  );
}

interface ExerciseCardProps {
  exercise: Exercise;
  actionLabel: string;
  completed: boolean;
  onToggle: () => void;
  labels: {
    instructions: string;
    more: string;
    less: string;
  };
  key?: string | number;
}

function ExerciseCard({ exercise, actionLabel, completed, onToggle, labels }: ExerciseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className={`p-6 rounded-3xl transition-all duration-500 border cursor-pointer ${completed ? 'bg-green-50/50 border-green-200 dark:bg-green-900/10 dark:border-green-800' : 'bg-white dark:bg-stone-900 border-stone-100 dark:border-stone-800 shadow-sm'} hover:shadow-md`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-serif text-xl">{exercise.title}</h4>
            {completed && <CheckCircle2 className="w-5 h-5 text-green-500" />}
          </div>
          <p className="text-stone-500 text-sm leading-relaxed">{exercise.description}</p>
          
          <div className="flex items-center gap-3 mt-2">
            {exercise.duration && (
              <span className="inline-block px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-[10px] uppercase font-bold text-stone-400">
                {exercise.duration}
              </span>
            )}
            <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-amber-600">
              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              <span>{isExpanded ? labels.less : labels.more}</span>
            </div>
          </div>

          <AnimatePresence>
            {isExpanded && exercise.instructions && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800">
                  <h5 className="text-[10px] uppercase tracking-widest font-bold text-stone-400 mb-2">{labels.instructions}</h5>
                  <p className="text-stone-600 dark:text-stone-400 text-sm italic leading-relaxed">
                    {exercise.instructions}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all shrink-0 ${completed ? 'bg-green-500 text-white' : 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:scale-105'}`}
        >
          {completed ? <CheckCircle2 className="w-4 h-4" /> : actionLabel}
        </button>
      </div>
    </div>
  );
}
