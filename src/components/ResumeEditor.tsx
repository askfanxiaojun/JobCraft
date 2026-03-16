import { useRef } from 'react';
import { FileText, Trash2 } from 'lucide-react';

interface ResumeEditorProps {
  value: string;
  onChange: (value: string) => void;
  isLoading: boolean;
}

const PLACEHOLDER = `在此粘贴或填写你的简历内容（Markdown 格式或纯文本均可）

例如：

## 基本信息
姓名：张三
岗位：产品经理 / 5年经验

## 工作经历

### 字节跳动 · 高级产品经理（2021-2024）
- 负责抖音电商直播工具产品，DAU 从 200w 增长至 800w
- 主导了「一键开播」功能从 0 到 1 的设计与落地
- 推动跨部门协作，项目周期压缩 20%

## 教育背景
北京大学 · 计算机科学 · 本科（2015-2019）`;

export function ResumeEditor({ value, onChange, isLoading }: ResumeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-accent-muted flex items-center justify-center">
            <FileText className="w-3.5 h-3.5 text-accent" />
          </div>
          <h2 className="text-[13px] font-semibold text-text-primary tracking-tight">我的简历</h2>
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
