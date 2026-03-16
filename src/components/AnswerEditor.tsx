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
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <PenLine className="w-4 h-4 text-amber-500" />
          <h2 className="text-sm font-semibold text-gray-900">回答优化</h2>
          {hasContent && (
            <span className="text-xs text-gray-400">{charCount} 字</span>
          )}
        </div>
        {hasContent && (
          <button
            onClick={handleClear}
            disabled={isLoading}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-3 h-3" />
            清空
          </button>
        )}
      </div>

      <div className="flex-1 min-h-0 flex flex-col gap-3 overflow-y-auto scrollbar-thin">
        <div className="flex flex-col gap-1.5 shrink-0">
          <label className="text-xs font-medium text-gray-600">面试题</label>
          <textarea
            value={value.question}
            onChange={(e) => onChange({ ...value, question: e.target.value })}
            placeholder="粘贴面试题，例如：请介绍一下你在上一家公司负责的核心项目"
            disabled={isLoading}
            rows={3}
            className="w-full px-3 py-2.5 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent focus:bg-white transition-colors placeholder:text-gray-300 disabled:opacity-60 disabled:cursor-not-allowed leading-relaxed"
          />
        </div>

        <div className="flex flex-col gap-1.5 flex-1 min-h-[120px]">
          <label className="text-xs font-medium text-gray-600">我的回答</label>
          <textarea
            value={value.answer}
            onChange={(e) => onChange({ ...value, answer: e.target.value })}
            placeholder="粘贴你的原始回答，口语化的内容也没关系"
            disabled={isLoading}
            className="flex-1 w-full px-3 py-2.5 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent focus:bg-white transition-colors placeholder:text-gray-300 disabled:opacity-60 disabled:cursor-not-allowed leading-relaxed"
          />
        </div>

        <div className="shrink-0">
          <button
            type="button"
            onClick={() => setShowExtra(!showExtra)}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors mb-1.5"
          >
            {showExtra ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            补充信息（可选）
          </button>
          {showExtra && (
            <textarea
              value={value.extra}
              onChange={(e) => onChange({ ...value, extra: e.target.value })}
              placeholder="岗位名称 / 公司背景 / 面试轮次等，有助于更精准地优化方向"
              disabled={isLoading}
              rows={2}
              className="w-full px-3 py-2.5 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent focus:bg-white transition-colors placeholder:text-gray-300 disabled:opacity-60 disabled:cursor-not-allowed leading-relaxed"
            />
          )}
        </div>
      </div>
    </div>
  );
}
