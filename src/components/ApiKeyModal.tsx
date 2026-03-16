import { useState, useEffect } from 'react';
import { X, Eye, EyeOff, ExternalLink } from 'lucide-react';
import type { ApiConfig } from '../types';

interface ApiKeyModalProps {
  isOpen: boolean;
  config: ApiConfig;
  onSave: (config: ApiConfig) => void;
  onClose: () => void;
}

export function ApiKeyModal({ isOpen, config, onSave, onClose }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState(config.apiKey);
  const [endpointId, setEndpointId] = useState(config.endpointId);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(config.apiKey);
      setEndpointId(config.endpointId);
    }
  }, [isOpen, config]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!apiKey.trim() || !endpointId.trim()) return;
    onSave({ apiKey: apiKey.trim(), endpointId: endpointId.trim() });
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-overlay backdrop-blur-md"
      onClick={handleBackdropClick}
    >
      <div className="glass-card rounded-3xl w-full max-w-md animate-fade-in border-border-default">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-0">
          <div>
            <h2 className="text-base font-semibold text-text-primary tracking-tight">API 配置</h2>
            <p className="text-[12px] text-text-tertiary mt-1">配置将保存在本地，不会上传服务器</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-surface-card-hover rounded-xl transition-all duration-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-[12px] font-semibold text-text-secondary mb-2 uppercase tracking-wider">
              API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="请输入火山引擎 API Key"
                className="w-full pr-10 pl-4 py-3 text-[13px] input-field rounded-2xl"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors duration-300"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-text-secondary mb-2 uppercase tracking-wider">
              模型 Endpoint ID
            </label>
            <input
              type="text"
              value={endpointId}
              onChange={(e) => setEndpointId(e.target.value)}
              placeholder="例如：ep-xxxxxxxx-xxxxx"
              className="w-full px-4 py-3 text-[13px] input-field rounded-2xl"
            />
            <p className="mt-2 text-[11px] text-text-tertiary">
              在火山引擎控制台「推理接入点」中获取
            </p>
          </div>

          <a
            href="https://console.volcengine.com/ark/region:ark+cn-beijing/endpoint"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[12px] text-accent hover:text-accent-hover transition-colors duration-300"
          >
            <ExternalLink className="w-3 h-3" />
            前往火山引擎控制台获取配置
          </a>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-[13px] font-medium btn-ghost rounded-2xl border border-border-subtle"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={!apiKey.trim() || !endpointId.trim()}
            className="flex-1 px-4 py-3 text-[13px] font-medium btn-primary rounded-2xl"
          >
            保存配置
          </button>
        </div>
      </div>
    </div>
  );
}
