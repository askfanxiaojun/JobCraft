import { X, Clock, Trash2, ChevronRight, FileText, Mic, PenLine } from 'lucide-react';
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
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-surface-overlay backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <aside
        className={`fixed top-0 right-0 z-40 h-full w-80 bg-surface-elevated/95 backdrop-blur-xl border-l border-border-subtle shadow-2xl flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border-subtle">
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-text-tertiary" />
            <h2 className="text-[13px] font-semibold text-text-primary tracking-tight">历史记录</h2>
            {history.length > 0 && (
              <span className="text-[11px] text-text-tertiary font-medium tabular-nums">
                {history.length} 条
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <button
                onClick={onClear}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-danger/70 hover:text-danger hover:bg-danger-muted rounded-lg transition-all duration-300"
              >
                <Trash2 className="w-3 h-3" />
                清空
              </button>
            )}
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-surface-card-hover rounded-lg transition-all duration-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6 py-10">
              <div className="w-12 h-12 rounded-2xl bg-surface-card flex items-center justify-center mb-4">
                <Clock className="w-5 h-5 text-text-tertiary" />
              </div>
              <p className="text-[13px] text-text-tertiary">暂无历史记录</p>
              <p className="text-[11px] text-text-tertiary mt-1.5">生成结果后将自动保存</p>
            </div>
          ) : (
            <ul className="p-3 space-y-1">
              {history.map((item) => (
                <li
                  key={item.id}
                  className="group relative flex items-start gap-3 p-3.5 rounded-2xl hover:bg-surface-card-hover cursor-pointer transition-all duration-300"
                  onClick={() => onSelect(item)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      {item.mode === 'transcript' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-teal bg-teal-muted px-2 py-0.5 rounded-md">
                          <Mic className="w-2.5 h-2.5" />
                          录音提取
                        </span>
                      ) : item.mode === 'optimize' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber bg-amber-muted px-2 py-0.5 rounded-md">
                          <PenLine className="w-2.5 h-2.5" />
                          回答优化
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-accent bg-accent-muted px-2 py-0.5 rounded-md">
                          <FileText className="w-2.5 h-2.5" />
                          简历出题
                        </span>
                      )}
                      <span className="text-[10px] text-text-tertiary tabular-nums">{formatDate(item.timestamp)}</span>
                    </div>
                    <p className="text-[12px] text-text-secondary leading-relaxed line-clamp-2">
                      {item.mode === 'transcript' ? item.transcriptSnippet : item.mode === 'optimize' ? item.optimizeSnippet : item.resumeSnippet}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 mt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center text-text-tertiary hover:text-danger hover:bg-danger-muted rounded-lg transition-all duration-300"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <ChevronRight className="w-3 h-3 text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
