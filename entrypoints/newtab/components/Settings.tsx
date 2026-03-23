import { motion, AnimatePresence } from 'motion/react';
import { Settings as SettingsIcon, X, Check, Sun, Moon } from 'lucide-react';
import { useSettings } from '../hooks/use-settings';
import { useData } from '../hooks/use-data';
import { cn } from '../lib/utils';
import type { CEFRLevel, ThemeMode } from '../types';
import { CEFR_LEVELS } from '../types';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

// CEFR Level Colors
const levelColors: Record<CEFRLevel, string> = {
  A1: 'bg-green-500',
  A2: 'bg-blue-500',
  B1: 'bg-yellow-500',
  B2: 'bg-orange-500',
  C1: 'bg-purple-500',
  C2: 'bg-red-500',
};

// Theme options
const themeOptions: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
];

export function Settings({ isOpen, onClose }: SettingsProps) {
  const { settings, updateSettings, resetSettings, setTheme } = useSettings();
  const { switchLevel } = useData();

  const currentTheme = settings.theme || 'light';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          
          {/* Settings Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card shadow-xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <SettingsIcon className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold text-foreground">Settings</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>

              {/* Theme Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Theme</h3>
                <div className="grid grid-cols-2 gap-3">
                  {themeOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = currentTheme === option.value;
                    
                    return (
                      <motion.button
                        key={option.value}
                        onClick={() => setTheme(option.value)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          'relative p-6 rounded-xl transition-all duration-200 border-2 flex flex-col items-center gap-3',
                          isSelected
                            ? 'border-primary bg-primary/10 shadow-lg'
                            : 'border-border hover:border-primary/50'
                        )}
                      >
                        <div className={cn(
                          'p-3 rounded-full transition-colors',
                          isSelected ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'
                        )}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="font-medium text-foreground">{option.label}</span>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2"
                          >
                            <Check className="w-5 h-5 text-primary" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* CEFR Info */}
              <div className="mb-8 p-4 bg-muted rounded-lg">
                <h3 className="text-sm font-semibold mb-2 text-foreground">About CEFR</h3>
                <p className="text-xs text-muted-foreground">
                  The Common European Framework of Reference (CEFR) is an international standard for language proficiency, divided into six levels from A1 to C2.
                </p>
              </div>

              {/* Mode Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Learning Mode</h3>
                <div className="space-y-2">
                  {[
                    { value: 'random', label: 'Random Mode', desc: 'Show words randomly, repeatable' },
                    { value: 'ichigoichie', label: 'Ichigo Ichie', desc: 'Each word appears only once' },
                  ].map((mode) => (
                    <button
                      key={mode.value}
                      onClick={() => updateSettings({ mode: mode.value as 'random' | 'ichigoichie' })}
                      className={cn(
                        'w-full p-4 rounded-lg text-left transition-colors border-2',
                        settings.mode === mode.value
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <div className="font-medium text-foreground">{mode.label}</div>
                      <div className="text-sm text-muted-foreground mt-1">{mode.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* CEFR Level Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-foreground">CEFR Difficulty Levels</h3>
                <div className="space-y-2">
                  {settings.levels.map((item) => {
                    const levelInfo = CEFR_LEVELS[item.level];
                    return (
                      <button
                        key={item.level}
                        onClick={() => switchLevel(item.level)}
                        className={cn(
                          'w-full p-4 rounded-lg text-left transition-colors border-2',
                          item.enabled
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50 opacity-60'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm',
                            levelColors[item.level]
                          )}>
                            {item.level}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">
                              {levelInfo.label}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {levelInfo.description}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Vocabulary: {levelInfo.vocabulary}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pronunciation Toggle */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-foreground">Display Options</h3>
                <button
                  onClick={() => updateSettings({ pronunciation: !settings.pronunciation })}
                  className={cn(
                    'w-full p-4 rounded-lg text-left transition-colors border-2',
                    settings.pronunciation
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50 opacity-60'
                  )}
                >
                  <div className="font-medium text-foreground">Show Pronunciation</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Display IPA phonetics below words
                  </div>
                </button>
              </div>

              {/* Reset */}
              <button
                onClick={resetSettings}
                className="w-full p-4 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors font-medium"
              >
                Reset All Settings
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
