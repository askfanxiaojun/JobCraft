import { useState, useCallback, useRef, useEffect } from 'react';
import { Sparkles, AlertCircle, X, StopCircle, CheckCircle2 } from 'lucide-react';
import { Header } from './components/Header';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ResumeEditor } from './components/ResumeEditor';
import { QuestionPanel } from './components/QuestionPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useVolcanoApi } from './hooks/useVolcanoApi';
import { getPhase1Prompt, getPhase2Prompt } from './utils/prompts';
import type { ApiConfig, InterviewResult, GenerationState } from './types';

const DEFAULT_CONFIG: ApiConfig = { apiKey: '', endpointId: '' };
const MAX_HISTORY = 20;

const INITIAL_STATE: GenerationState = {
  phase1: '',
  phase2: '',
  isLoadingPhase1: false,
  isLoadingPhase2: false,
  error: null,
};

export default function App() {
  const [apiConfig, setApiConfig] = useLocalStorage<ApiConfig>('jc_api_key', DEFAULT_CONFIG);
  const [resume, setResume] = useLocalStorage<string>('jc_resume', '');
  const [history, setHistory] = useLocalStorage<InterviewResult[]>('jc_history', []);

  const [showApiModal, setShowApiModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [genState, setGenState] = useState<GenerationState>(INITIAL_STATE);
  const [successToast, setSuccessToast] = useState(false);

  const { streamText } = useVolcanoApi();
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!apiConfig.apiKey || !apiConfig.endpointId) {
      setShowApiModal(true);
    }
  }, []);

  const isLoading = genState.isLoadingPhase1 || genState.isLoadingPhase2;

  const handleGenerate = useCallback(async () => {
    if (!resume.trim()) return;
    if (!apiConfig.apiKey || !apiConfig.endpointId) {
      setShowApiModal(true);
      return;
    }

    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    setGenState({
      phase1: '',
      phase2: '',
      isLoadingPhase1: true,
      isLoadingPhase2: false,
      error: null,
    });

    let phase1Result = '';
    let phase2Result = '';

    try {
      await streamText(
        apiConfig,
        getPhase1Prompt(resume),
        (chunk) => {
          phase1Result += chunk;
          setGenState((prev) => ({ ...prev, phase1: prev.phase1 + chunk }));
        },
        signal
      );

      setGenState((prev) => ({ ...prev, isLoadingPhase1: false, isLoadingPhase2: true }));

      await streamText(
        apiConfig,
        getPhase2Prompt(resume),
        (chunk) => {
          phase2Result += chunk;
          setGenState((prev) => ({ ...prev, phase2: prev.phase2 + chunk }));
        },
        signal
      );

      setGenState((prev) => ({ ...prev, isLoadingPhase2: false }));
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3000);

      const newResult: InterviewResult = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        resumeSnippet: resume.slice(0, 80).replace(/\s+/g, ' ').trim() + (resume.length > 80 ? '...' : ''),
        phase1: phase1Result,
        phase2: phase2Result,
      };

      setHistory((prev) => [newResult, ...prev].slice(0, MAX_HISTORY));
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        setGenState((prev) => ({ ...prev, isLoadingPhase1: false, isLoadingPhase2: false }));
        return;
      }
      const msg = err instanceof Error ? err.message : '生成失败，请重试';
      setGenState((prev) => ({
        ...prev,
        isLoadingPhase1: false,
        isLoadingPhase2: false,
        error: msg,
      }));
    }
  }, [resume, apiConfig, streamText, setHistory]);

  const handleAbort = () => {
    abortRef.current?.abort();
    setGenState((prev) => ({ ...prev, isLoadingPhase1: false, isLoadingPhase2: false }));
  };

  const handleSelectHistory = (result: InterviewResult) => {
    setGenState({
      phase1: result.phase1,
      phase2: result.phase2,
      isLoadingPhase1: false,
      isLoadingPhase2: false,
      error: null,
    });
    setShowHistory(false);
  };

  const handleDeleteHistory = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        onOpenSettings={() => setShowApiModal(true)}
        onToggleHistory={() => setShowHistory(!showHistory)}
        historyCount={history.length}
      />

      <main className="flex-1 max-w-screen-2xl mx-auto w-full px-4 py-4 sm:py-6">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 lg:gap-6 h-[calc(100vh-5rem)]">
          {/* 左侧：简历编辑器 */}
          <div className="flex flex-col min-h-[300px] lg:h-full">
            <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-5 overflow-hidden">
              <ResumeEditor
                value={resume}
                onChange={setResume}
                isLoading={isLoading}
              />
            </div>

            <div className="mt-3 space-y-2">
              {isLoading && (
                <div className="flex items-center gap-3 px-1">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className={`w-2 h-2 rounded-full ${genState.isLoadingPhase1 ? 'bg-indigo-500 animate-pulse' : 'bg-green-500'}`} />
                    一面题目{genState.isLoadingPhase1 ? '生成中...' : '已完成'}
                  </div>
                  <span className="text-gray-200">|</span>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className={`w-2 h-2 rounded-full ${genState.isLoadingPhase2 ? 'bg-purple-500 animate-pulse' : genState.phase2 ? 'bg-green-500' : 'bg-gray-200'}`} />
                    二面题目{genState.isLoadingPhase2 ? '生成中...' : genState.phase2 ? '已完成' : '等待中'}
                  </div>
                </div>
              )}
              {isLoading ? (
                <button
                  onClick={handleAbort}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors"
                >
                  <StopCircle className="w-4 h-4" />
                  停止生成
                </button>
              ) : (
                <button
                  onClick={handleGenerate}
                  disabled={!resume.trim()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed rounded-xl transition-all shadow-sm hover:shadow-indigo-200 hover:shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                  {genState.phase1 || genState.phase2 ? '重新生成' : '生成面试题'}
                </button>
              )}
            </div>
          </div>

          {/* 右侧：面试题展示 */}
          <div className="flex flex-col lg:h-full overflow-hidden">
            {genState.error && (
              <div className="mb-3 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span className="flex-1">{genState.error}</span>
                <button
                  onClick={() => setGenState((prev) => ({ ...prev, error: null }))}
                  className="shrink-0 text-red-400 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-5 overflow-hidden flex flex-col">
              <QuestionPanel
                phase1Content={genState.phase1}
                phase2Content={genState.phase2}
                isLoadingPhase1={genState.isLoadingPhase1}
                isLoadingPhase2={genState.isLoadingPhase2}
              />
            </div>
          </div>
        </div>
      </main>

      {/* 生成进度条 */}
      {isLoading && (
        <div className="fixed bottom-0 left-0 right-0 z-30 h-1 bg-gray-200">
          <div
            className={`h-full bg-indigo-500 transition-all duration-500 ${
              genState.isLoadingPhase1 ? 'w-1/2' : 'w-full'
            }`}
          />
        </div>
      )}

      {/* 成功 Toast */}
      {successToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 bg-gray-900 text-white text-sm rounded-xl shadow-lg animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-green-400" />
          面试题生成完成！
        </div>
      )}

      <ApiKeyModal
        isOpen={showApiModal}
        config={apiConfig}
        onSave={setApiConfig}
        onClose={() => setShowApiModal(false)}
      />

      <HistoryPanel
        isOpen={showHistory}
        history={history}
        onClose={() => setShowHistory(false)}
        onSelect={handleSelectHistory}
        onDelete={handleDeleteHistory}
        onClear={handleClearHistory}
      />
    </div>
  );
}
