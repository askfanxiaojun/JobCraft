import { X, Clock, Trash2, ChevronRight, FileText, Mic } from 'lucide-react';
import type { InterviewResult } from '../types';

interface HistoryPanelProps {
  isOpen: boolean;
  history: InterviewResult[];
  onClose: () => void;
  onSelect: (result: InterviewResult) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return `今天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  } else if (diffDays === 1) {
    return '昨天';
  } else if (diffDays < 7) {
    return `${diffDays}天前`;
  }
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

export function HistoryPanel({ isOpen, history, onClose, onSelect, onDelete, onClear }: HistoryPanelProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed top-0 right-0 z-40 h-full w-80 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <h2 className="text-sm font-semibold text-gray-900">历史记录</h2>
            {history.length > 0 && (
              <span className="text-xs text-gray-400">共 {history.length} 条</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <button
                onClick={onClear}
                className="flex items-center gap-1 px-2 py-1 text-xs text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                清空
              </button>
            )}
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6 py-10">
              <Clock className="w-10 h-10 text-gray-200 mb-3" />
              <p className="text-sm text-gray-400">暂无历史记录</p>
              <p className="text-xs text-gray-300 mt-1">生成面试题后将自动保存</p>
            </div>
          ) : (
            <ul className="p-2 space-y-1">
              {history.map((item) => (
                <li
                  key={item.id}
                  className="group relative flex items-start gap-2 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => onSelect(item)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      {item.mode === 'transcript' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                          <Mic className="w-2.5 h-2.5" />
                          录音提取
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                          <FileText className="w-2.5 h-2.5" />
                          简历出题
                        </span>
                      )}
                      <span className="text-xs text-gray-400">{formatDate(item.timestamp)}</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-snug line-clamp-2">
                      {item.mode === 'transcript' ? item.transcriptSnippet : item.resumeSnippet}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 rounded transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <ChevronRight className="w-3 h-3 text-gray-300" />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}
