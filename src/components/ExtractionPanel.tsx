import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MessageSquareText, Loader2, Download, Copy, Check, Sparkles, ShieldCheck, ListOrdered, GitMerge } from 'lucide-react';
import { useState, useCallback } from 'react';
import { exportExtractionAsMarkdown } from '../utils/export';

interface ExtractionPanelProps {
  content: string;
  isLoading: boolean;
}

export function ExtractionPanel({ content, isLoading }: ExtractionPanelProps) {
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
      <div className="flex flex-col h-full overflow-y-auto scrollbar-thin">
        <div className="flex flex-col gap-5 py-6 px-2 max-w-lg mx-auto w-full">
          {/* 核心主张 */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-2xl bg-teal-muted flex items-center justify-center shrink-0">
                <MessageSquareText className="w-5 h-5 text-teal" />
              </div>
              <h3 className="text-[15px] font-semibold text-text-primary tracking-tight leading-snug">面试完，别让记忆替你复盘</h3>
            </div>
            <p className="text-[13px] text-text-secondary leading-relaxed pl-[52px]">
              面试结束后，大多数人只记得模糊的感受，却记不清具体问了什么、自己是怎么回答的——靠印象复盘往往抓不到真正的问题。
            </p>
          </div>

          {/* 分割线 */}
          <div className="h-px bg-border-subtle" />

          {/* 价值亮点 */}
          <div className="flex flex-col gap-3">
            <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">AI 帮你做的事</p>

            <div className="flex flex-col gap-2.5">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-teal-muted/50">
                <div className="w-6 h-6 rounded-lg bg-teal-muted flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal" />
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-text-primary mb-0.5">忠实还原，不做改写</p>
                  <p className="text-[11px] text-text-tertiary leading-relaxed">保留候选人的原始回答，只整理结构，不润色内容</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-inset">
                <div className="w-6 h-6 rounded-lg bg-surface-card-hover flex items-center justify-center shrink-0 mt-0.5">
                  <ListOrdered className="w-3.5 h-3.5 text-text-secondary" />
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-text-primary mb-0.5">智能纠错 ASR 识别偏差</p>
                  <p className="text-[11px] text-text-tertiary leading-relaxed">自动修正同音字、专业术语等语音识别错误</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-inset">
                <div className="w-6 h-6 rounded-lg bg-surface-card-hover flex items-center justify-center shrink-0 mt-0.5">
                  <GitMerge className="w-3.5 h-3.5 text-text-secondary" />
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-text-primary mb-0.5">追问归属 + 反问归类</p>
                  <p className="text-[11px] text-text-tertiary leading-relaxed">追问自动挂在主问题下，候选人反问单独整理</p>
                </div>
              </div>
            </div>
          </div>

          {/* 操作提示 */}
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-border-subtle bg-surface-card">
            <Sparkles className="w-3.5 h-3.5 text-teal shrink-0" />
            <p className="text-[11px] text-text-tertiary">在左侧粘贴录音转录文本，点击「提取问答」即可开始</p>
          </div>
        </div>
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
            onClick={() => exportExtractionAsMarkdown(content)}
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
            <div className="w-9 h-9 bg-teal-muted rounded-xl flex items-center justify-center text-teal">
              <MessageSquareText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-[13px] font-semibold text-text-primary tracking-tight">面试问答提取</h3>
                {isLoading && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-muted text-teal flex items-center gap-1 font-medium">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    提取中
                  </span>
                )}
                {content && !isLoading && (
                  <span className="flex items-center gap-1.5 text-[10px] font-medium text-success">
                    <span className="w-1.5 h-1.5 rounded-full bg-success" />
                    已完成
                  </span>
                )}
              </div>
              <p className="text-[11px] text-text-tertiary mt-0.5">从面试对话中提取结构化问答内容</p>
            </div>
          </div>

          <div className="px-5 pb-5">
            {isLoading && !content && (
              <div className="flex flex-col items-center justify-center py-12 text-text-tertiary">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-teal-muted flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin text-teal" />
                  </div>
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-teal rounded-full animate-pulse-glow" />
                </div>
                <span className="text-[13px] mt-4">正在分析面试对话并提取问答...</span>
              </div>
            )}

            {content && (
              <div className="bg-surface-inset rounded-xl p-5 prose prose-sm max-w-none prose-dark">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                {isLoading && (
                  <span className="inline-block w-0.5 h-4 bg-teal animate-pulse ml-0.5 align-middle rounded-full" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
