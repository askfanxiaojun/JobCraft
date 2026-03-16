import { useState, useCallback, useRef } from 'react';
import type { ApiConfig, ChatMessage } from '../types';

const VOLCANO_API_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';

interface UseVolcanoApiReturn {
  streamText: (
    config: ApiConfig,
    messages: ChatMessage[],
    onChunk: (chunk: string) => void,
    signal?: AbortSignal
  ) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  abort: () => void;
}

export function useVolcanoApi(): UseVolcanoApiReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const abort = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const streamText = useCallback(
    async (
      config: ApiConfig,
      messages: ChatMessage[],
      onChunk: (chunk: string) => void,
      signal?: AbortSignal
    ) => {
      setIsLoading(true);
      setError(null);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const combinedSignal = signal
        ? (AbortSignal as unknown as { any: (signals: AbortSignal[]) => AbortSignal }).any([signal, controller.signal])
        : controller.signal;

      try {
        const response = await fetch(VOLCANO_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.apiKey}`,
          },
          body: JSON.stringify({
            model: config.endpointId,
            messages,
            stream: true,
          }),
          signal: combinedSignal,
        });

        if (!response.ok) {
          const errText = await response.text();
          let errMsg = `API 请求失败（${response.status}）`;
          try {
            const errJson = JSON.parse(errText);
            errMsg = errJson?.error?.message || errMsg;
          } catch {
            // ignore
          }
          throw new Error(errMsg);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('无法读取响应流');

        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed === 'data: [DONE]') continue;
            if (!trimmed.startsWith('data: ')) continue;

            try {
              const json = JSON.parse(trimmed.slice(6));
              const content = json?.choices?.[0]?.delta?.content;
              if (content) onChunk(content);
            } catch {
              // skip malformed SSE lines
            }
          }
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        const msg = err instanceof Error ? err.message : '未知错误';
        setError(msg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { streamText, isLoading, error, abort };
}
