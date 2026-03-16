import { useState, useCallback, useRef, useEffect } from 'react';
import { Sparkles, AlertCircle, X, StopCircle, CheckCircle2, FileText, Mic } from 'lucide-react';
import { Header } from './components/Header';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ResumeEditor } from './components/ResumeEditor';
import { TranscriptEditor } from './components/TranscriptEditor';
import { QuestionPanel } from './components/QuestionPanel';
import { ExtractionPanel } from './components/ExtractionPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useVolcanoApi } from './hooks/useVolcanoApi';
import { getPhase1Prompt, getPhase2Prompt, getTranscriptPrompt } from './utils/prompts';
import type { ApiConfig, AppMode, InterviewResult, GenerationState, ExtractionState } from './types';

const DEFAULT_CONFIG: ApiConfig = { apiKey: '', endpointId: '' };
const MAX_HISTORY = 20;

const INITIAL_GEN_STATE: GenerationState = {
  phase1: '',
  phase2: '',
  isLoadingPhase1: false,
  isLoadingPhase2: false,
  error: null,
};

const INITIAL_EXTRACT_STATE: ExtractionState = {
  content: '',
  isLoading: false,
  error: null,
};

export default function App() {
  const [apiConfig, setApiConfig] = useLocalStorage<ApiConfig>('jc_api_key', DEFAULT_CONFIG);
  const [resume, setResume] = useLocalStorage<string>('jc_resume', '');
  const [transcript, setTranscript] = useLocalStorage<string>('jc_transcript', '');
  const [history, setHistory] = useLocalStorage<InterviewResult[]>('jc_history', []);

  const [mode, setMode] = useState<AppMode>('resume');
  const [showApiModal, setShowApiModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [genState, setGenState] = useState<GenerationState>(INITIAL_GEN_STATE);
  const [extractState, setExtractState] = useState<ExtractionState>(INITIAL_EXTRACT_STATE);
  const [successToast, setSuccessToast] = useState(false);

  const { streamText } = useVolcanoApi();
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!apiConfig.apiKey || !apiConfig.endpointId) {
      setShowApiModal(true);
    }
  }, []);

  const isResumeLoading = genState.isLoadingPhase1 || genState.isLoadingPhase2;
  const isTranscriptLoading = extractState.isLoading;
  const isLoading = mode === 'resume' ? isResumeLoading : isTranscriptLoading;

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
        mode: 'resume',
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

  const handleExtract = useCallback(async () => {
    if (!transcript.trim()) return;
    if (!apiConfig.apiKey || !apiConfig.endpointId) {
      setShowApiModal(true);
      return;
    }

    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    setExtractState({ content: '', isLoading: true, error: null });

    let result = '';

    try {
      await streamText(
        apiConfig,
        getTranscriptPrompt(transcript),
        (chunk) => {
          result += chunk;
          setExtractState((prev) => ({ ...prev, content: prev.content + chunk }));
        },
        signal
      );

      setExtractState((prev) => ({ ...prev, isLoading: false }));
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3000);

      const newResult: InterviewResult = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        mode: 'transcript',
        resumeSnippet: '',
        phase1: '',
        phase2: '',
        transcriptSnippet: transcript.slice(0, 80).replace(/\s+/g, ' ').trim() + (transcript.length > 80 ? '...' : ''),
        extractedContent: result,
      };

      setHistory((prev) => [newResult, ...prev].slice(0, MAX_HISTORY));
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        setExtractState((prev) => ({ ...prev, isLoading: false }));
        return;
      }
      const msg = err instanceof Error ? err.message : '提取失败，请重试';
      setExtractState((prev) => ({ ...prev, isLoading: false, error: msg }));
    }
  }, [transcript, apiConfig, streamText, setHistory]);

  const handleAbort = () => {
    abortRef.current?.abort();
    if (mode === 'resume') {
      setGenState((prev) => ({ ...prev, isLoadingPhase1: false, isLoadingPhase2: false }));
    } else {
      setExtractState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleSelectHistory = (result: InterviewResult) => {
    const resultMode = result.mode || 'resume';
    setMode(resultMode);

    if (resultMode === 'resume') {
      setGenState({
        phase1: result.phase1,
        phase2: result.phase2,
        isLoadingPhase1: false,
        isLoadingPhase2: false,
        error: null,
      });
    } else {
      setExtractState({
        content: result.extractedContent || '',
        isLoading: false,
        error: null,
      });
    }
    setShowHistory(false);
  };

  const handleDeleteHistory = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const currentError = mode === 'resume' ? genState.error : extractState.error;
  const clearError = () => {
    if (mode === 'resume') {
      setGenState((prev) => ({ ...prev, error: null }));
    } else {
      setExtractState((prev) => ({ ...prev, error: null }));
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      <Header
        onOpenSettings={() => setShowApiModal(true)}
        onToggleHistory={() => setShowHistory(!showHistory)}
        historyCount={history.length}
      />

      <main className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full max-w-screen-2xl mx-auto px-4 py-4 sm:py-6 flex flex-col">
          {/* Tab 切换 */}
          <div className="shrink-0 mb-4 flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-fit">
            <button
              onClick={() => setMode('resume')}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                mode === 'resume'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              根据简历出题
            </button>
            <button
              onClick={() => setMode('transcript')}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                mode === 'transcript'
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Mic className="w-4 h-4" />
              面试录音提取
            </button>
          </div>

          <div className="flex-1 min-h-0 flex flex-col lg:grid lg:grid-cols-[minmax(280px,1fr)_2fr] gap-4 lg:gap-5">
            {/* 左侧编辑器 */}
            <div className="flex flex-col min-h-[240px] lg:min-h-0">
              <div className="flex-1 min-h-0 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 p-3 sm:p-4">
                {mode === 'resume' ? (
                  <ResumeEditor
                    value={resume}
                    onChange={setResume}
                    isLoading={isResumeLoading}
                  />
                ) : (
                  <TranscriptEditor
                    value={transcript}
                    onChange={setTranscript}
                    isLoading={isTranscriptLoading}
                  />
                )}
              </div>

              <div className="mt-2 space-y-2 shrink-0">
                {mode === 'resume' && isResumeLoading && (
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
                {mode === 'transcript' && isTranscriptLoading && (
                  <div className="flex items-center gap-3 px-1">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                      问答提取中...
                    </div>
                  </div>
                )}
                {isLoading ? (
                  <button
                    onClick={handleAbort}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors"
                  >
                    <StopCircle className="w-4 h-4" />
                    停止生成
                  </button>
                ) : mode === 'resume' ? (
                  <button
                    onClick={handleGenerate}
                    disabled={!resume.trim()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed rounded-xl transition-all shadow-sm hover:shadow-indigo-200 hover:shadow-md"
                  >
                    <Sparkles className="w-4 h-4" />
                    {genState.phase1 || genState.phase2 ? '重新生成' : '生成面试题'}
                  </button>
                ) : (
                  <button
                    onClick={handleExtract}
                    disabled={!transcript.trim()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 disabled:cursor-not-allowed rounded-xl transition-all shadow-sm hover:shadow-teal-200 hover:shadow-md"
                  >
                    <Sparkles className="w-4 h-4" />
                    {extractState.content ? '重新提取' : '提取问答'}
                  </button>
                )}
              </div>
            </div>

            {/* 右侧结果展示 */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              {currentError && (
                <div className="mb-3 shrink-0 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="flex-1">{currentError}</span>
                  <button
                    onClick={clearError}
                    className="shrink-0 text-red-400 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="flex-1 min-h-0 bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-5 flex flex-col overflow-hidden">
                {mode === 'resume' ? (
                  <QuestionPanel
                    phase1Content={genState.phase1}
                    phase2Content={genState.phase2}
                    isLoadingPhase1={genState.isLoadingPhase1}
                    isLoadingPhase2={genState.isLoadingPhase2}
                  />
                ) : (
                  <ExtractionPanel
                    content={extractState.content}
                    isLoading={extractState.isLoading}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 生成进度条 */}
      {isLoading && (
        <div className="fixed bottom-0 left-0 right-0 z-30 h-1 bg-gray-200">
          <div
            className={`h-full transition-all duration-500 ${
              mode === 'resume'
                ? `bg-indigo-500 ${genState.isLoadingPhase1 ? 'w-1/2' : 'w-full'}`
                : 'bg-teal-500 w-full animate-pulse'
            }`}
          />
        </div>
      )}

      {/* 成功 Toast */}
      {successToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 bg-gray-900 text-white text-sm rounded-xl shadow-lg animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-green-400" />
          {mode === 'resume' ? '面试题生成完成！' : '问答提取完成！'}
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
