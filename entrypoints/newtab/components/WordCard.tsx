import { motion } from 'motion/react';
import { Volume2, BookOpen, Check, RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';
import type { Word } from '../types';
import { getAudioUrl, getDictionaryUrl } from '../hooks/use-vocab';

interface WordCardProps {
  word: Word | null;
  showPronunciation: boolean;
  onLearn: () => void;
  onNext: () => void;
}

export function WordCard({ word, showPronunciation, onLearn, onNext }: WordCardProps) {
  if (!word) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center animate-fade-in">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2 text-foreground">
          ¡Felicidades!
        </h2>
        <p className="text-muted-foreground mb-6">
          你已经学完了所有单词！
        </p>
        <button
          onClick={onNext}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          重新开始
        </button>
      </div>
    );
  }

  const levelColors = {
    1: 'bg-level-1',
    2: 'bg-level-2',
    3: 'bg-level-3',
    4: 'bg-level-4',
    5: 'bg-level-5',
  };

  const playAudio = () => {
    const audio = new Audio(getAudioUrl(word.word));
    audio.play().catch(err => console.error('Failed to play audio:', err));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center gap-8"
    >
      {/* Level Badge */}
      <div className={cn(
        'px-4 py-1 rounded-full text-white text-sm font-medium',
        levelColors[word.level]
      )}>
        Level {word.level}
      </div>

      {/* Word */}
      <div className="text-center">
        <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-4 animate-fade-in">
          {word.word}
        </h1>
        
        {showPronunciation && (
          <p className="text-xl text-muted-foreground mb-2 animate-slide-in">
            {word.pronunciation}
          </p>
        )}
        
        <p className="text-3xl text-muted-foreground animate-fade-in">
          {word.meaning}
        </p>
      </div>

      {/* Example */}
      <div className="max-w-2xl text-center animate-fade-in">
        <p className="text-lg italic text-foreground mb-2">
          "{word.example}"
        </p>
        <p className="text-base text-muted-foreground">
          {word.exampleTranslation}
        </p>
      </div>

      {/* Category */}
      <div className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md text-sm">
        {word.category}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={playAudio}
          className="p-3 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
          title="播放发音"
        >
          <Volume2 className="w-5 h-5 text-foreground" />
        </button>
        
        <a
          href={getDictionaryUrl(word.word)}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
          title="查看词典"
        >
          <BookOpen className="w-5 h-5 text-foreground" />
        </a>
        
        <button
          onClick={onLearn}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          已学会
        </button>
        
        <button
          onClick={onNext}
          className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
        >
          下一个
        </button>
      </div>
    </motion.div>
  );
}
