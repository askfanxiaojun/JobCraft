import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MessageSquareText, Loader2, Download, Copy, Check } from 'lucide-react';
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
      <div className="flex flex-col items-center justify-center h-full text-center py-16 px-6">
        <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-4">
          <MessageSquareText className="w-8 h-8 text-teal-400" />
        </div>
        <h3 className="text-base font-semibold text-gray-700 mb-2">提取结果将在这里展示</h3>
        <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
          粘贴面试录音的 ASR 转录文本，点击「提取问答」，AI 将自动从对话中提取出结构化的问题与回答
        </p>
      </div>
    );
  }

  const canExport = content && !isLoading;

  return (
    <div className="flex flex-col h-full min-h-0">
      {canExport && (
        <div className="flex justify-end gap-2 mb-3 shrink-0">
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors ${
              copied
                ? 'text-green-600 bg-green-50 border-green-200'
                : 'text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border-gray-200'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? '已复制' : '复制'}
          </button>
          <button
            onClick={() => exportExtractionAsMarkdown(content)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            导出 Markdown
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto scrollbar-thin pb-4 min-h-0">
        <div className="rounded-xl border bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200 overflow-hidden">
          <div className="flex items-center gap-3 p-4">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white">
              <MessageSquareText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-900">面试问答提取</h3>
                {isLoading && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    提取中...
                  </span>
                )}
                {content && !isLoading && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 text-teal-700">已完成</span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">从面试对话中提取结构化问答内容</p>
            </div>
          </div>

          <div className="px-4 pb-4">
            {isLoading && !content && (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <Loader2 className="w-6 h-6 animate-spin mb-2" />
                <span className="text-sm">正在分析面试对话并提取问答...</span>
              </div>
            )}

            {content && (
              <div className="bg-white/70 rounded-lg p-4 prose prose-sm max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                {isLoading && (
                  <span className="inline-block w-1.5 h-4 bg-gray-500 animate-pulse ml-0.5 align-middle" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
