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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">火山引擎 API 配置</h2>
            <p className="text-sm text-gray-500 mt-0.5">配置将保存在本地，不会上传服务器</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="请输入火山引擎 API Key"
                className="w-full pr-10 pl-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              模型 Endpoint ID
            </label>
            <input
              type="text"
              value={endpointId}
              onChange={(e) => setEndpointId(e.target.value)}
              placeholder="例如：ep-xxxxxxxx-xxxxx"
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="mt-1.5 text-xs text-gray-400">
              在火山引擎控制台「推理接入点」中获取
            </p>
          </div>

          <a
            href="https://console.volcengine.com/ark/region:ark+cn-beijing/endpoint"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700"
          >
            <ExternalLink className="w-3 h-3" />
            前往火山引擎控制台获取配置
          </a>
        </div>

        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={!apiKey.trim() || !endpointId.trim()}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            保存配置
          </button>
        </div>
      </div>
    </div>
  );
}
