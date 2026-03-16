import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Brain, Target, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface PhaseCardProps {
  phase: 1 | 2;
  content: string;
  isLoading: boolean;
}

function PhaseCard({ phase, content, isLoading }: PhaseCardProps) {
  const [collapsed, setCollapsed] = useState(false);

  const isPhase1 = phase === 1;
  const icon = isPhase1 ? <Target className="w-4 h-4" /> : <Brain className="w-4 h-4" />;
  const title = isPhase1 ? '一面 · 专业执行力' : '二面 · 思维力';
  const subtitle = isPhase1
    ? '聚焦过往经历、项目落地与执行力'
    : '聚焦思考框架、问题发现与认知深度';
  const colorClass = isPhase1
    ? 'from-indigo-50 to-blue-50 border-indigo-200'
    : 'from-purple-50 to-pink-50 border-purple-200';
  const badgeClass = isPhase1
    ? 'bg-indigo-100 text-indigo-700'
    : 'bg-purple-100 text-purple-700';
  const headerIconBg = isPhase1 ? 'bg-indigo-600' : 'bg-purple-600';

  return (
    <div className={`rounded-xl border bg-gradient-to-br ${colorClass} overflow-hidden`}>
      <div
        className="flex items-center justify-between p-4 cursor-pointer select-none"
        onClick={() => content && setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 ${headerIconBg} rounded-lg flex items-center justify-center text-white`}>
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
              {isLoading && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${badgeClass} flex items-center gap-1`}>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  生成中...
                </span>
              )}
              {content && !isLoading && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${badgeClass}`}>已生成</span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
          </div>
        </div>
        {content && (
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        )}
      </div>

      {!collapsed && (
        <div className="px-4 pb-4">
          {isLoading && !content && (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin mb-2" />
              <span className="text-sm">正在分析简历并生成面试题...</span>
            </div>
          )}

          {content && (
            <div className="bg-white/70 rounded-lg p-4 prose prose-sm max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900 scrollbar-thin overflow-auto max-h-[60vh]">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              {isLoading && (
                <span className="inline-block w-1.5 h-4 bg-gray-500 animate-pulse ml-0.5 align-middle" />
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

  if (!hasAnyContent) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-16 px-6">
        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
          <Brain className="w-8 h-8 text-indigo-400" />
        </div>
        <h3 className="text-base font-semibold text-gray-700 mb-2">面试题将在这里展示</h3>
        <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
          填写你的简历内容，点击「生成面试题」，AI 将为你量身定制一面和二面的面试问题
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto scrollbar-thin pb-4">
      <PhaseCard phase={1} content={phase1Content} isLoading={isLoadingPhase1} />
      <PhaseCard phase={2} content={phase2Content} isLoading={isLoadingPhase2} />
    </div>
  );
}
