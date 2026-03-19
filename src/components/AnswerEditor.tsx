import { PenLine, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { OptimizeInput } from '../types';

interface AnswerEditorProps {
  value: OptimizeInput;
  onChange: (value: OptimizeInput) => void;
  isLoading: boolean;
}

export function AnswerEditor({ value, onChange, isLoading }: AnswerEditorProps) {
  const [showExtra, setShowExtra] = useState(!!value.extra);

  const hasContent = value.question || value.answer || value.extra;
  const charCount = value.question.length + value.answer.length + value.extra.length;

  const handleClear = () => {
    onChange({ question: '', answer: '', extra: '' });
    setShowExtra(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-muted flex items-center justify-center">
            <PenLine className="w-3.5 h-3.5 text-amber" />
          </div>
          <h2 className="text-[13px] font-semibold text-text-primary tracking-tight">回答优化</h2>
          {hasContent && (
            <span className="text-[11px] text-text-tertiary font-medium tabular-nums">{charCount} 字</span>
          )}
        </div>
        {hasContent && (
          <button
            onClick={handleClear}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-[11px] text-text-tertiary hover:text-danger transition-colors duration-300 disabled:opacity-30"
          >
            <Trash2 className="w-3 h-3" />
            清空
          </button>
        )}
      </div>
      <p className="text-[11px] text-text-tertiary leading-relaxed mb-4">AI 诊断你的回答，保留真实经历，优化结构与表达</p>

      <div className="flex-1 min-h-0 flex flex-col gap-4 overflow-y-auto scrollbar-thin">
        {/* 面试题 */}
        <div className="flex flex-col gap-2 shrink-0">
          <label className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">面试题</label>
          <textarea
            value={value.question}
            onChange={(e) => onChange({ ...value, question: e.target.value })}
            placeholder="粘贴面试题，例如：请介绍一下你在上一家公司负责的核心项目"
            disabled={isLoading}
            rows={3}
            className="w-full px-4 py-3 text-[13px] leading-relaxed input-field rounded-2xl resize-none"
          />
        </div>

        {/* 我的回答 */}
        <div className="flex flex-col gap-2 flex-1 min-h-[120px]">
          <label className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">我的回答</label>
          <textarea
            value={value.answer}
            onChange={(e) => onChange({ ...value, answer: e.target.value })}
            placeholder="粘贴你的原始回答，口语化的内容也没关系"
            disabled={isLoading}
            className="flex-1 w-full px-4 py-3 text-[13px] leading-relaxed input-field rounded-2xl resize-none"
          />
        </div>

        {/* 补充信息 */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={() => setShowExtra(!showExtra)}
            className="flex items-center gap-1.5 text-[11px] font-medium text-text-tertiary hover:text-text-secondary transition-colors duration-300 mb-2"
          >
            {showExtra ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            补充信息（可选）
          </button>
          {showExtra && (
            <textarea
              value={value.extra}
              onChange={(e) => onChange({ ...value, extra: e.target.value })}
              placeholder="岗位名称 / 公司背景 / 面试轮次等"
              disabled={isLoading}
              rows={2}
              className="w-full px-4 py-3 text-[13px] leading-relaxed input-field rounded-2xl resize-none"
            />
          )}
        </div>
      </div>
    </div>
  );
}
