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

候选人：好的，我叫张三，之前在字节跳动做了三年产品经理，主要负责抖音电商的直播工具产品。核心做的事情就是提升主播的开播效率，比如我们做了一个一键开播的功能，上线之后主播的开播率提升了大概35%...

面试官：你提到一键开播这个功能，当时为什么会想到做这个？是怎么发现这个需求的？

候选人：这个其实是从数据上发现的，我们当时看到一个数据...`;

export function TranscriptEditor({ value, onChange, isLoading }: TranscriptEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Mic className="w-4 h-4 text-teal-500" />
          <h2 className="text-sm font-semibold text-gray-900">面试录音文本</h2>
          {value && (
            <span className="text-xs text-gray-400">{value.length} 字</span>
          )}
        </div>
        {value && (
          <button
            onClick={() => onChange('')}
            disabled={isLoading}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
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
        className="flex-1 w-full px-4 py-3 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent focus:bg-white transition-colors scrollbar-thin placeholder:text-gray-300 disabled:opacity-60 disabled:cursor-not-allowed leading-relaxed"
      />
    </div>
  );
}
