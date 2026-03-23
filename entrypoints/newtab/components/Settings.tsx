import { motion, AnimatePresence } from 'motion/react';
import { Settings as SettingsIcon, X } from 'lucide-react';
import { useSettings } from '../hooks/use-settings';
import { useData } from '../hooks/use-data';
import { cn } from '../lib/utils';
import type { Level } from '../types';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Settings({ isOpen, onClose }: SettingsProps) {
  const { settings, updateSettings, resetSettings } = useSettings();
  const { switchLevel } = useData();

  const levelLabels: Record<Level, string> = {
    1: '初级 (Level 1)',
    2: '中级 (Level 2)',
    3: '高级 (Level 3)',
    4: '专业 (Level 4)',
    5: '精通 (Level 5)',
  };

  const levelColors = {
    1: 'bg-level-1',
    2: 'bg-level-2',
    3: 'bg-level-3',
    4: 'bg-level-4',
    5: 'bg-level-5',
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
                  <h2 className="text-2xl font-bold text-foreground">设置</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>

              {/* Mode Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-foreground">学习模式</h3>
                <div className="space-y-2">
                  {[
                    { value: 'random', label: '随机模式', desc: '随机显示单词，可重复学习' },
                    { value: 'ichigoichie', label: '一期一会', desc: '每个单词只出现一次' },
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

              {/* Level Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-foreground">难度级别</h3>
                <div className="space-y-2">
                  {settings.levels.map((item) => (
                    <button
                      key={item.level}
                      onClick={() => switchLevel(item.level)}
                      className={cn(
                        'w-full p-4 rounded-lg text-left transition-colors border-2 flex items-center gap-3',
                        item.enabled
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50 opacity-60'
                      )}
                    >
                      <div className={cn(
                        'w-4 h-4 rounded-full',
                        levelColors[item.level]
                      )} />
                      <span className="font-medium text-foreground">
                        {levelLabels[item.level]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pronunciation Toggle */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-foreground">显示选项</h3>
                <button
                  onClick={() => updateSettings({ pronunciation: !settings.pronunciation })}
                  className={cn(
                    'w-full p-4 rounded-lg text-left transition-colors border-2',
                    settings.pronunciation
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50 opacity-60'
                  )}
                >
                  <div className="font-medium text-foreground">显示音标</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    在单词下方显示国际音标
                  </div>
                </button>
              </div>

              {/* Reset */}
              <button
                onClick={resetSettings}
                className="w-full p-4 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors font-medium"
              >
                重置所有设置
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
