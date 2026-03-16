import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Brain, Target, Loader2, ChevronDown, ChevronUp, Download, Copy, Check } from 'lucide-react';
import { useState, useCallback } from 'react';
import { exportAsMarkdown } from '../utils/export';

interface PhaseCardProps {
  phase: 1 | 2;
  content: string;
  isLoading: boolean;
}

function PhaseCard({ phase, content, isLoading }: PhaseCardProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: noop
    }
  }, [content]);

  const isPhase1 = phase === 1;
  const icon = isPhase1 ? <Target className="w-4 h-4" /> : <Brain className="w-4 h-4" />;
  const title = isPhase1 ? '一面 · 专业执行力' : '二面 · 思维力';
  const subtitle = isPhase1
    ? '聚焦过往经历、项目落地与执行力'
    : '聚焦思考框架、问题发现与认知深度';
  const accentColor = isPhase1 ? 'text-accent' : 'text-purple-400';
  const accentBg = isPhase1 ? 'bg-accent-muted' : 'bg-purple-500/15';
  const dotColor = isPhase1 ? 'bg-accent' : 'bg-purple-400';

  return (
    <div className="glass-card rounded-2xl overflow-hidden animate-fade-in">
      <div
        className="flex items-center justify-between p-5 cursor-pointer select-none transition-colors duration-300 hover:bg-surface-inset"
        onClick={() => content && setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-3.5">
          <div className={`w-9 h-9 ${accentBg} rounded-xl flex items-center justify-center ${accentColor}`}>
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-[13px] font-semibold text-text-primary tracking-tight">{title}</h3>
              {isLoading && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${accentBg} ${accentColor} flex items-center gap-1 font-medium`}>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  生成中
                </span>
              )}
              {content && !isLoading && (
                <span className="flex items-center gap-1.5 text-[10px] font-medium text-success">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" />
                  已完成
                </span>
              )}
            </div>
            <p className="text-[11px] text-text-tertiary mt-0.5">{subtitle}</p>
          </div>
        </div>
        {content && (
          <div className="flex items-center gap-0.5">
            <button
              onClick={handleCopy}
              className={`p-2 rounded-xl transition-all duration-300 ${copied ? 'text-success bg-success/10' : 'text-text-tertiary hover:text-text-secondary hover:bg-surface-card-hover'}`}
              title={copied ? '已复制' : '复制 Markdown'}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              className="text-text-tertiary hover:text-text-secondary transition-all duration-300 p-2 rounded-xl hover:bg-surface-card-hover"
              onClick={(e) => { e.stopPropagation(); setCollapsed(!collapsed); }}
            >
              {collapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>

      {!collapsed && (
        <div className="px-5 pb-5">
          {isLoading && !content && (
            <div className="flex flex-col items-center justify-center py-12 text-text-tertiary">
              <div className="relative">
                <div className={`w-10 h-10 rounded-full ${accentBg} flex items-center justify-center`}>
                  <Loader2 className={`w-5 h-5 animate-spin ${accentColor}`} />
                </div>
                <span className={`absolute -top-0.5 -right-0.5 w-3 h-3 ${dotColor} rounded-full animate-pulse-glow`} />
              </div>
              <span className="text-[13px] mt-4 text-text-tertiary">正在分析简历并生成面试题...</span>
            </div>
          )}

          {content && (
            <div className="bg-surface-inset rounded-xl p-5 prose prose-sm max-w-none prose-dark">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              {isLoading && (
                <span className="inline-block w-0.5 h-4 bg-accent animate-pulse ml-0.5 align-middle rounded-full" />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface QuestionPanelProps {
  phase1Content: string;
  phase2Content: string;
  isLoadingPhase1: boolean;
  isLoadingPhase2: boolean;
}

export function QuestionPanel({
  phase1Content,
  phase2Content,
  isLoadingPhase1,
  isLoadingPhase2,
}: QuestionPanelProps) {
  const hasAnyContent = phase1Content || phase2Content || isLoadingPhase1 || isLoadingPhase2;
  const isLoading = isLoadingPhase1 || isLoadingPhase2;
  const canExport = (phase1Content || phase2Content) && !isLoading;

  if (!hasAnyContent) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-20 px-8">
        <div className="w-16 h-16 rounded-2xl bg-accent-muted flex items-center justify-center mb-6">
          <Brain className="w-7 h-7 text-accent" />
        </div>
        <h3 className="text-base font-semibold text-text-primary mb-2 tracking-tight">面试题将在这里展示</h3>
        <p className="text-[13px] text-text-tertiary max-w-[280px] leading-relaxed">
          填写简历内容，点击「生成面试题」，AI 将为你量身定制面试问题
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {canExport && (
        <div className="flex justify-end mb-4 shrink-0">
          <button
            onClick={() => exportAsMarkdown(phase1Content, phase2Content)}
            className="flex items-center gap-2 px-3.5 py-2 text-[12px] font-medium btn-ghost rounded-xl border border-border-subtle"
          >
            <Download className="w-3.5 h-3.5" />
            导出 Markdown
          </button>
        </div>
      )}

      <div className="flex-1 flex flex-col gap-4 overflow-y-auto scrollbar-thin pb-4 min-h-0">
        <PhaseCard phase={1} content={phase1Content} isLoading={isLoadingPhase1} />
        <PhaseCard phase={2} content={phase2Content} isLoading={isLoadingPhase2} />
      </div>
    </div>
  );
}
