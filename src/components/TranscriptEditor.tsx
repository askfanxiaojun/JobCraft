import { useRef } from 'react';
import { Mic, Trash2 } from 'lucide-react';

interface TranscriptEditorProps {
  value: string;
  onChange: (value: string) => void;
  isLoading: boolean;
}

const PLACEHOLDER = `在此粘贴面试对话的 ASR 转录文本

例如：

面试官：先简单做个自我介绍吧，包括你的工作经历和负责的主要项目。

候选人：好的，我叫张三，之前在字节跳动做了三年产品经理，主要负责抖音电商的直播工具产品...

面试官：你提到一键开播这个功能，当时为什么会想到做这个？

候选人：这个其实是从数据上发现的...`;

export function TranscriptEditor({ value, onChange, isLoading }: TranscriptEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-teal-muted flex items-center justify-center">
            <Mic className="w-3.5 h-3.5 text-teal" />
          </div>
          <h2 className="text-[13px] font-semibold text-text-primary tracking-tight">面试录音文本</h2>
          {value && (
            <span className="text-[11px] text-text-tertiary font-medium tabular-nums">{value.length} 字</span>
          )}
        </div>
        {value && (
          <button
            onClick={() => onChange('')}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-[11px] text-text-tertiary hover:text-danger transition-colors duration-300 disabled:opacity-30"
          >
            <Trash2 className="w-3 h-3" />
            清空
          </button>
        )}
      </div>

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={PLACEHOLDER}
        disabled={isLoading}
        className="flex-1 w-full px-4 py-3.5 text-[13px] leading-relaxed input-field rounded-2xl resize-none scrollbar-thin"
      />
    </div>
  );
}
