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
- 主导了「一键开播」功能从 0 到 1 的设计与落地，上线后主播开播率提升 35%
- 推动跨部门协作（研发/运营/设计），项目周期压缩 20%

### 美团 · 产品经理（2019-2021）
- 负责外卖骑手端 App 核心功能迭代
- ...

## 教育背景
北京大学 · 计算机科学 · 本科（2015-2019）

## 技能
产品设计、数据分析、用户研究、Axure、SQL`;

export function ResumeEditor({ value, onChange, isLoading }: ResumeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-500" />
          <h2 className="text-sm font-semibold text-gray-900">我的简历</h2>
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
        className="flex-1 w-full px-4 py-3 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent focus:bg-white transition-colors scrollbar-thin placeholder:text-gray-300 disabled:opacity-60 disabled:cursor-not-allowed leading-relaxed"
      />
    </div>
  );
}
