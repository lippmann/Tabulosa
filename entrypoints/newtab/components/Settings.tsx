import { motion, AnimatePresence } from 'motion/react';
import { Settings as SettingsIcon, X } from 'lucide-react';
import { useSettings } from '../hooks/use-settings';
import { useData } from '../hooks/use-data';
import { cn } from '../lib/utils';
import type { CEFRLevel } from '../types';
import { CEFR_LEVELS } from '../types';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

// CEFR 级别对应的颜色
const levelColors: Record<CEFRLevel, string> = {
  A1: 'bg-green-500',
  A2: 'bg-blue-500',
  B1: 'bg-yellow-500',
  B2: 'bg-orange-500',
  C1: 'bg-purple-500',
  C2: 'bg-red-500',
};

export function Settings({ isOpen, onClose }: SettingsProps) {
  const { settings, updateSettings, resetSettings } = useSettings();
  const { switchLevel } = useData();

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

              {/* CEFR Info */}
              <div className="mb-8 p-4 bg-muted rounded-lg">
                <h3 className="text-sm font-semibold mb-2 text-foreground">关于 CEFR</h3>
                <p className="text-xs text-muted-foreground">
                  CEFR（欧洲语言共同参考框架）是国际通用的语言能力评估标准，分为 A1-C2 六个等级。
                </p>
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

              {/* CEFR Level Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-foreground">CEFR 难度级别</h3>
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
                              词汇量：{levelInfo.vocabulary}
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
