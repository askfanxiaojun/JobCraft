import { Settings, History, Sparkles, Sun, Moon } from 'lucide-react';
import type { Theme } from '../hooks/useTheme';

interface HeaderProps {
  onOpenSettings: () => void;
  onToggleHistory: () => void;
  historyCount: number;
  theme: Theme;
  onToggleTheme: () => void;
}

export function Header({ onOpenSettings, onToggleHistory, historyCount, theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="shrink-0 border-b border-border-subtle bg-surface/80 backdrop-blur-xl sticky top-0 z-20 transition-colors duration-300">
      <div className="max-w-screen-2xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center shadow-lg shadow-accent/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-[15px] font-bold tracking-tight text-text-primary">
              JobCraft
            </span>
            <span className="text-xs text-text-tertiary font-medium hidden sm:inline">
              AI 面试助手
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            className="flex items-center justify-center w-9 h-9 btn-ghost rounded-xl"
            title={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 theme-toggle" />
            ) : (
              <Moon className="w-4 h-4 theme-toggle" />
            )}
          </button>

          <button
            onClick={onToggleHistory}
            className="relative flex items-center gap-2 px-3 py-2 text-[13px] font-medium btn-ghost rounded-xl"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">历史</span>
            {historyCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-accent text-white text-[10px] font-semibold rounded-full flex items-center justify-center leading-none">
                {historyCount > 9 ? '9+' : historyCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium btn-ghost rounded-xl"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">设置</span>
          </button>
        </div>
      </div>
    </header>
  );
}
