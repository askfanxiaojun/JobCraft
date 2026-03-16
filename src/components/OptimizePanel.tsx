import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PenLine, Loader2, Download, Copy, Check } from 'lucide-react';
import { useState, useCallback } from 'react';
import { exportOptimizeAsMarkdown } from '../utils/export';

interface OptimizePanelProps {
  content: string;
  isLoading: boolean;
}

export function OptimizePanel({ content, isLoading }: OptimizePanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: noop
    }
  }, [content]);

  const hasContent = content || isLoading;

  if (!hasContent) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-20 px-8">
        <div className="w-16 h-16 rounded-2xl bg-amber-muted flex items-center justify-center mb-6">
          <PenLine className="w-7 h-7 text-amber" />
        </div>
        <h3 className="text-base font-semibold text-text-primary mb-2 tracking-tight">优化结果将在这里展示</h3>
        <p className="text-[13px] text-text-tertiary max-w-[280px] leading-relaxed">
          输入面试题和你的回答，AI 将诊断问题并给出优化建议
        </p>
      </div>
    );
  }

  const canExport = content && !isLoading;

  return (
    <div className="flex flex-col h-full min-h-0">
      {canExport && (
        <div className="flex justify-end gap-2 mb-4 shrink-0">
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-3.5 py-2 text-[12px] font-medium rounded-xl border transition-all duration-300 ${
              copied
                ? 'text-success bg-success/10 border-success/20'
                : 'btn-ghost border-border-subtle'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? '已复制' : '复制'}
          </button>
          <button
            onClick={() => exportOptimizeAsMarkdown(content)}
            className="flex items-center gap-2 px-3.5 py-2 text-[12px] font-medium btn-ghost rounded-xl border border-border-subtle"
          >
            <Download className="w-3.5 h-3.5" />
            导出 Markdown
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto scrollbar-thin pb-4 min-h-0">
        <div className="glass-card rounded-2xl overflow-hidden animate-fade-in">
          <div className="flex items-center gap-3.5 p-5">
            <div className="w-9 h-9 bg-amber-muted rounded-xl flex items-center justify-center text-amber">
              <PenLine className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-[13px] font-semibold text-text-primary tracking-tight">回答优化报告</h3>
                {isLoading && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-muted text-amber flex items-center gap-1 font-medium">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    优化中
                  </span>
                )}
                {content && !isLoading && (
                  <span className="flex items-center gap-1.5 text-[10px] font-medium text-success">
                    <span className="w-1.5 h-1.5 rounded-full bg-success" />
                    已完成
                  </span>
                )}
              </div>
              <p className="text-[11px] text-text-tertiary mt-0.5">诊断问题、优化表达、给出进阶建议</p>
            </div>
          </div>

          <div className="px-5 pb-5">
            {isLoading && !content && (
              <div className="flex flex-col items-center justify-center py-12 text-text-tertiary">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-amber-muted flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin text-amber" />
                  </div>
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-amber rounded-full animate-pulse-glow" />
                </div>
                <span className="text-[13px] mt-4">正在分析回答并生成优化建议...</span>
              </div>
            )}

            {content && (
              <div className="bg-surface-inset rounded-xl p-5 prose prose-sm max-w-none prose-dark">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                {isLoading && (
                  <span className="inline-block w-0.5 h-4 bg-amber animate-pulse ml-0.5 align-middle rounded-full" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
