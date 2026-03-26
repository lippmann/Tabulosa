import { motion, AnimatePresence } from 'motion/react';
import { Settings as SettingsIcon, X, Check, Sun, Moon, Trash2, Volume2, Bookmark, Download } from 'lucide-react';
import { useAtomValue } from 'jotai';
import * as XLSX from 'xlsx';
import { useSettings } from '../hooks/use-settings';
import { useData, savedWordsAtom, languageAtom } from '../hooks/use-data';
import { cn } from '../lib/utils';
import type { CEFRLevel, ThemeMode, Language, JLPTLevel } from '../types';
import { CEFR_LEVELS, LANGUAGES, JLPT_LEVEL_COLORS, JLPT_LEVELS } from '../types';
import { speakText } from '../hooks/use-vocab';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

// CEFR Level Colors - Soft minimal palette
const levelColors: Record<CEFRLevel, string> = {
  A1: 'bg-[#E0E0E0] text-[#4A4A4A]',
  A2: 'bg-[#D1D9CE] text-[#4A4A4A]',
  B1: 'bg-[#D2E0EB] text-[#4A4A4A]',
  B2: 'bg-[#EAD9C8] text-[#4A4A4A]',
  C1: 'bg-[#DAC9D2] text-[#4A4A4A]',
  C2: 'bg-[#C9D6D6] text-[#4A4A4A]',
};

// Combined level colors for both CEFR and JLPT
const combinedLevelColors: Record<CEFRLevel | JLPTLevel, string> = {
  ...levelColors,
  ...JLPT_LEVEL_COLORS,
};

// Theme options
const themeOptions: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
];

// Format translation: add space after semicolon if missing
function formatTranslation(text: string): string {
  return text.replace(/;(?!\s)/g, '; ');
}

export function Settings({ isOpen, onClose }: SettingsProps) {
  const { settings, updateSettings, resetSettings, setTheme, setLanguage } = useSettings();
  const { switchLevel, switchJLPTLevel, removeSaved } = useData();
  const savedWords = useAtomValue(savedWordsAtom) || [];
  const language = useAtomValue(languageAtom);

  const currentTheme = settings.theme || 'light';
  const currentLanguage = settings.language || 'spanish';
  const isJapanese = currentLanguage === 'japanese';

  const handlePlayWord = async (word: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await speakText(word, currentLanguage);
    } catch (err) {
      console.error('Failed to play audio:', err);
    }
  };

  const handleExportExcel = () => {
    if (savedWords.length === 0) return;

    // 准备导出数据
    const langName = LANGUAGES[currentLanguage]?.name || 'Language';
    const exportData = savedWords.map((word, index) => {
      const baseData: Record<string, unknown> = {
        'No.': index + 1,
        'Word': word.word,
        'Translation': word.english_translation,
      };

      // 根据语言添加不同的字段
      if (isJapanese) {
        baseData['JLPT Level'] = word.jlpt_level || word.cefr_level;
        baseData['Reading'] = word.word_reading || '';
      } else {
        baseData['CEFR Level'] = word.cefr_level;
        baseData['Part of Speech'] = word.pos;
      }

      baseData[`Example (${langName})`] = word.example_sentence_native;
      baseData['Example (English)'] = word.example_sentence_english;
      baseData['Frequency'] = word.word_frequency;

      return baseData;
    });

    // 创建工作簿和工作表
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // 设置列宽
    const cols = isJapanese ? [
      { wch: 5 },   // No.
      { wch: 15 },  // Word
      { wch: 30 },  // Translation
      { wch: 10 },  // JLPT Level
      { wch: 20 },  // Reading
      { wch: 50 },  // Example (Japanese)
      { wch: 50 },  // Example (English)
      { wch: 10 },  // Frequency
    ] : [
      { wch: 5 },   // No.
      { wch: 20 },  // Word
      { wch: 30 },  // Translation
      { wch: 12 },  // CEFR Level
      { wch: 15 },  // Part of Speech
      { wch: 50 },  // Example (Language)
      { wch: 50 },  // Example (English)
      { wch: 10 },  // Frequency
    ];
    ws['!cols'] = cols;

    XLSX.utils.book_append_sheet(wb, ws, 'Saved Words');

    // 下载文件
    XLSX.writeFile(wb, `${currentLanguage}-saved-words-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

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

              {/* Language Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-4">Languages</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.values(LANGUAGES).map((lang) => {
                    const isSelected = currentLanguage === lang.code;
                    return (
                      <motion.button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          'relative p-3 rounded-lg transition-all duration-200 border-2 flex items-center gap-2',
                          isSelected
                            ? 'border-primary bg-primary/10 shadow-md'
                            : 'border-border hover:border-primary/50'
                        )}
                      >
                        <img 
                          src={lang.flagSvg} 
                          alt={lang.name}
                          className="w-6 h-6"
                        />
                        <div className="flex-1 text-left min-w-0">
                          <div className="font-medium text-foreground text-sm truncate">{lang.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{lang.nativeName}</div>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-primary shrink-0" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
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

              {/* Level Selection - CEFR or JLPT based on language */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  {isJapanese ? 'JLPT Difficulty Levels' : 'CEFR Difficulty Levels'}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Select the difficulty levels you want to learn
                </p>
                <div className="space-y-2">
                  {isJapanese ? (
                    // JLPT Level Selection
                    (settings.jlptLevels || []).map((item) => {
                      const levelInfo = JLPT_LEVELS[item.level];
                      return (
                        <button
                          key={item.level}
                          onClick={() => switchJLPTLevel(item.level)}
                          className={cn(
                            'w-full p-4 rounded-lg text-left transition-colors border-2',
                            item.enabled
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary/50 opacity-60'
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                              combinedLevelColors[item.level]
                            )}>
                              {item.level}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-foreground">
                                {levelInfo.label}
                              </div>
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {levelInfo.description}
                              </div>
                            </div>
                            {item.enabled && (
                              <Check className="w-5 h-5 text-primary" />
                            )}
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    // CEFR Level Selection
                    (settings.levels || []).map((item) => {
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
                              'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                              combinedLevelColors[item.level]
                            )}>
                              {item.level}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-foreground">
                                {levelInfo.label}
                              </div>
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {levelInfo.description}
                              </div>
                            </div>
                            {item.enabled && (
                              <Check className="w-5 h-5 text-primary" />
                            )}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Level Info */}
              <div className="mb-8 p-4 bg-muted rounded-lg">
                <h3 className="text-sm font-semibold mb-2 text-foreground">
                  {isJapanese ? 'About JLPT' : 'About CEFR'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isJapanese 
                    ? 'The JLPT (Japanese Language Proficiency Test) has 5 levels: N5 (beginner) to N1 (advanced). N5-N4 test basic understanding of everyday Japanese. N3 tests intermediate communication. N2-N1 test advanced fluency for professional and academic contexts.'
                    : 'CEFR (Common European Framework of Reference) describes language proficiency from A1 (beginner) to C2 (mastery). A1-A2 cover basic survival needs. B1-B2 enable independent communication. C1-C2 represent advanced fluency.'
                  }
                </p>
              </div>

              {/* Reset */}
              <button
                onClick={resetSettings}
                className="w-full p-4 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors font-medium mb-8"
              >
                Reset All Settings
              </button>

              {/* Saved Words Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">
                      Saved Words
                      {savedWords.length > 0 && (
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                          ({savedWords.length})
                        </span>
                      )}
                    </h3>
                  </div>
                  {savedWords.length > 0 && (
                    <motion.button
                      onClick={handleExportExcel}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Export Excel
                    </motion.button>
                  )}
                </div>
                
                {savedWords.length === 0 ? (
                  <div className="p-6 bg-muted rounded-lg text-center">
                    <p className="text-muted-foreground text-sm">
                      No saved words yet. Click the bookmark icon on a word card to save it.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {savedWords.map((word) => (
                      <motion.div
                        key={word.word}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center justify-between p-3 bg-secondary rounded-lg group"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className={cn(
                            'px-2 py-0.5 rounded text-xs font-medium shrink-0',
                            combinedLevelColors[word.cefr_level]
                          )}>
                            {word.cefr_level}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-foreground truncate">
                              {word.word}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {formatTranslation(word.english_translation)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => handlePlayWord(word.word, e)}
                            className="p-2 hover:bg-background rounded-lg transition-colors"
                            title="Play pronunciation"
                          >
                            <Volume2 className="w-4 h-4 text-muted-foreground hover:text-primary" />
                          </button>
                          <button
                            onClick={() => removeSaved(word.word)}
                            className="p-2 hover:bg-destructive/20 rounded-lg transition-colors"
                            title="Remove from saved"
                          >
                            <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
