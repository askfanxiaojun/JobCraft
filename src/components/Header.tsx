import { Settings, History, Briefcase } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  onToggleHistory: () => void;
  historyCount: number;
}

export function Header({ onOpenSettings, onToggleHistory, historyCount }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">JobCraft</span>
          <span className="hidden sm:inline text-xs text-gray-400 font-normal ml-1">求职面试助手</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleHistory}
            className="relative flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">历史记录</span>
            {historyCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center leading-none">
                {historyCount > 9 ? '9+' : historyCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">API 设置</span>
          </button>
        </div>
      </div>
    </header>
  );
}
