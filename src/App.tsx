import { useState, useCallback, useRef, useEffect } from 'react';
import { Sparkles, AlertCircle, X, StopCircle, CheckCircle2, FileText, Mic, PenLine } from 'lucide-react';
import { Header } from './components/Header';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ResumeEditor } from './components/ResumeEditor';
import { TranscriptEditor } from './components/TranscriptEditor';
import { AnswerEditor } from './components/AnswerEditor';
import { QuestionPanel } from './components/QuestionPanel';
import { ExtractionPanel } from './components/ExtractionPanel';
import { OptimizePanel } from './components/OptimizePanel';
import { HistoryPanel } from './components/HistoryPanel';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useVolcanoApi } from './hooks/useVolcanoApi';
import { useTheme } from './hooks/useTheme';
import { getPhase1Prompt, getPhase2Prompt, getTranscriptPrompt, getOptimizePrompt } from './utils/prompts';
import type { ApiConfig, AppMode, OptimizeInput, InterviewResult, GenerationState, ExtractionState } from './types';

const DEFAULT_CONFIG: ApiConfig = { apiKey: '', endpointId: '' };
const MAX_HISTORY = 20;
const DEFAULT_OPTIMIZE_INPUT: OptimizeInput = { question: '', answer: '', extra: '' };

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

const INITIAL_OPTIMIZE_STATE: ExtractionState = {
  content: '',
  isLoading: false,
  error: null,
};

const TAB_CONFIG = [
  { key: 'resume' as AppMode, label: '根据简历出题', shortLabel: '出题', icon: FileText },
  { key: 'transcript' as AppMode, label: '面试录音提取', shortLabel: '提取', icon: Mic },
  { key: 'optimize' as AppMode, label: '回答优化', shortLabel: '优化', icon: PenLine },
];

export default function App() {
  const [apiConfig, setApiConfig] = useLocalStorage<ApiConfig>('jc_api_key', DEFAULT_CONFIG);
  const [resume, setResume] = useLocalStorage<string>('jc_resume', '');
  const [transcript, setTranscript] = useLocalStorage<string>('jc_transcript', '');
  const [optimizeInput, setOptimizeInput] = useLocalStorage<OptimizeInput>('jc_optimize_input', DEFAULT_OPTIMIZE_INPUT);
  const [history, setHistory] = useLocalStorage<InterviewResult[]>('jc_history', []);

  const [mode, setMode] = useState<AppMode>('resume');
  const [showApiModal, setShowApiModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [genState, setGenState] = useState<GenerationState>(INITIAL_GEN_STATE);
  const [extractState, setExtractState] = useState<ExtractionState>(INITIAL_EXTRACT_STATE);
  const [optimizeState, setOptimizeState] = useState<ExtractionState>(INITIAL_OPTIMIZE_STATE);
  const [successToast, setSuccessToast] = useState(false);

  const { streamText } = useVolcanoApi();
  const { theme, toggleTheme } = useTheme();
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!apiConfig.apiKey || !apiConfig.endpointId) {
      setShowApiModal(true);
    }
  }, []);

  const isResumeLoading = genState.isLoadingPhase1 || genState.isLoadingPhase2;
  const isTranscriptLoading = extractState.isLoading;
  const isOptimizeLoading = optimizeState.isLoading;
  const isLoading = mode === 'resume' ? isResumeLoading : mode === 'transcript' ? isTranscriptLoading : isOptimizeLoading;

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

  const handleOptimize = useCallback(async () => {
    if (!optimizeInput.question.trim() || !optimizeInput.answer.trim()) return;
    if (!apiConfig.apiKey || !apiConfig.endpointId) {
      setShowApiModal(true);
      return;
    }

    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    setOptimizeState({ content: '', isLoading: true, error: null });

    let result = '';

    try {
      await streamText(
        apiConfig,
        getOptimizePrompt(optimizeInput.question, optimizeInput.answer, optimizeInput.extra),
        (chunk) => {
          result += chunk;
          setOptimizeState((prev) => ({ ...prev, content: prev.content + chunk }));
        },
        signal
      );

      setOptimizeState((prev) => ({ ...prev, isLoading: false }));
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3000);

      const snippet = optimizeInput.question.slice(0, 60).replace(/\s+/g, ' ').trim() + (optimizeInput.question.length > 60 ? '...' : '');

      const newResult: InterviewResult = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        mode: 'optimize',
        resumeSnippet: '',
        phase1: '',
        phase2: '',
        optimizeSnippet: snippet,
        optimizedContent: result,
      };

      setHistory((prev) => [newResult, ...prev].slice(0, MAX_HISTORY));
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        setOptimizeState((prev) => ({ ...prev, isLoading: false }));
        return;
      }
      const msg = err instanceof Error ? err.message : '优化失败，请重试';
      setOptimizeState((prev) => ({ ...prev, isLoading: false, error: msg }));
    }
  }, [optimizeInput, apiConfig, streamText, setHistory]);

  const handleAbort = () => {
    abortRef.current?.abort();
    if (mode === 'resume') {
      setGenState((prev) => ({ ...prev, isLoadingPhase1: false, isLoadingPhase2: false }));
    } else if (mode === 'transcript') {
      setExtractState((prev) => ({ ...prev, isLoading: false }));
    } else {
      setOptimizeState((prev) => ({ ...prev, isLoading: false }));
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
    } else if (resultMode === 'transcript') {
      setExtractState({
        content: result.extractedContent || '',
        isLoading: false,
        error: null,
      });
    } else {
      setOptimizeState({
        content: result.optimizedContent || '',
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

  const currentError = mode === 'resume' ? genState.error : mode === 'transcript' ? extractState.error : optimizeState.error;
  const clearError = () => {
    if (mode === 'resume') {
      setGenState((prev) => ({ ...prev, error: null }));
    } else if (mode === 'transcript') {
      setExtractState((prev) => ({ ...prev, error: null }));
    } else {
      setOptimizeState((prev) => ({ ...prev, error: null }));
    }
  };

  // Determine button config based on mode
  const getActionButton = () => {
    if (isLoading) {
      return (
        <button
          onClick={handleAbort}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-3 text-[13px] font-semibold text-danger bg-danger-muted hover:bg-danger/20 border border-danger/20 rounded-2xl transition-all duration-300"
        >
          <StopCircle className="w-4 h-4" />
          停止生成
        </button>
      );
    }

    if (mode === 'resume') {
      return (
        <button
          onClick={handleGenerate}
          disabled={!resume.trim()}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-3 text-[13px] font-semibold btn-primary rounded-2xl"
        >
          <Sparkles className="w-4 h-4" />
          {genState.phase1 || genState.phase2 ? '重新生成' : '生成面试题'}
        </button>
      );
    }

    if (mode === 'transcript') {
      return (
        <button
          onClick={handleExtract}
          disabled={!transcript.trim()}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-3 text-[13px] font-semibold rounded-2xl bg-teal text-white transition-all duration-300 hover:bg-teal/90 hover:shadow-lg hover:shadow-teal/25 hover:-translate-y-0.5 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          <Sparkles className="w-4 h-4" />
          {extractState.content ? '重新提取' : '提取问答'}
        </button>
      );
    }

    return (
      <button
        onClick={handleOptimize}
        disabled={!optimizeInput.question.trim() || !optimizeInput.answer.trim()}
        className="w-full flex items-center justify-center gap-2.5 px-4 py-3 text-[13px] font-semibold rounded-2xl bg-amber text-black transition-all duration-300 hover:bg-amber/90 hover:shadow-lg hover:shadow-amber/20 hover:-translate-y-0.5 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
      >
        <Sparkles className="w-4 h-4" />
        {optimizeState.content ? '重新优化' : '优化回答'}
      </button>
    );
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-surface transition-colors duration-300">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orb-1 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orb-2 rounded-full blur-3xl" />
      </div>

      <Header
        onOpenSettings={() => setShowApiModal(true)}
        onToggleHistory={() => setShowHistory(!showHistory)}
        historyCount={history.length}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="relative flex-1 min-h-0 overflow-hidden">
        <div className="h-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 flex flex-col">

          {/* Tab 切换 */}
          <div className="shrink-0 mb-6 flex items-center gap-1 p-1 rounded-2xl bg-surface-card border border-border-subtle w-fit">
            {TAB_CONFIG.map((tab) => {
              const Icon = tab.icon;
              const isActive = mode === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setMode(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-surface-card-hover text-text-primary shadow-sm'
                      : 'text-text-tertiary hover:text-text-secondary hover:bg-surface-card'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Main content grid */}
          <div className="flex-1 min-h-0 flex flex-col lg:grid lg:grid-cols-[minmax(300px,1fr)_2fr] gap-5 lg:gap-6">

            {/* Left: Editor panel */}
            <div className="flex flex-col min-h-[260px] lg:min-h-0 gap-4">
              <div className="flex-1 min-h-0 flex flex-col glass-card rounded-2xl p-4 sm:p-5">
                {mode === 'resume' ? (
                  <ResumeEditor value={resume} onChange={setResume} isLoading={isResumeLoading} />
                ) : mode === 'transcript' ? (
                  <TranscriptEditor value={transcript} onChange={setTranscript} isLoading={isTranscriptLoading} />
                ) : (
                  <AnswerEditor value={optimizeInput} onChange={setOptimizeInput} isLoading={isOptimizeLoading} />
                )}
              </div>

              {/* Status indicators */}
              <div className="space-y-3 shrink-0">
                {mode === 'resume' && isResumeLoading && (
                  <div className="flex items-center gap-4 px-1">
                    <div className="flex items-center gap-2 text-[11px] text-text-tertiary">
                      <span className={`w-2 h-2 rounded-full ${genState.isLoadingPhase1 ? 'bg-accent animate-pulse-glow' : 'bg-success'}`} />
                      一面{genState.isLoadingPhase1 ? '生成中...' : '已完成'}
                    </div>
                    <div className="w-px h-3 bg-border-subtle" />
                    <div className="flex items-center gap-2 text-[11px] text-text-tertiary">
                      <span className={`w-2 h-2 rounded-full ${genState.isLoadingPhase2 ? 'bg-purple-400 animate-pulse-glow' : genState.phase2 ? 'bg-success' : 'bg-border-default'}`} />
                      二面{genState.isLoadingPhase2 ? '生成中...' : genState.phase2 ? '已完成' : '等待中'}
                    </div>
                  </div>
                )}
                {mode === 'transcript' && isTranscriptLoading && (
                  <div className="flex items-center gap-2 px-1 text-[11px] text-text-tertiary">
                    <span className="w-2 h-2 rounded-full bg-teal animate-pulse-glow" />
                    问答提取中...
                  </div>
                )}
                {mode === 'optimize' && isOptimizeLoading && (
                  <div className="flex items-center gap-2 px-1 text-[11px] text-text-tertiary">
                    <span className="w-2 h-2 rounded-full bg-amber animate-pulse-glow" />
                    回答优化中...
                  </div>
                )}

                {getActionButton()}
              </div>
            </div>

            {/* Right: Result panel */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              {/* Error */}
              {currentError && (
                <div className="mb-4 shrink-0 flex items-start gap-3 p-4 bg-danger-muted border border-danger/20 rounded-2xl text-[13px] text-danger animate-fade-in">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="flex-1 leading-relaxed">{currentError}</span>
                  <button
                    onClick={clearError}
                    className="shrink-0 text-danger/50 hover:text-danger transition-colors duration-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="flex-1 min-h-0 glass-card rounded-2xl p-5 sm:p-6 flex flex-col overflow-hidden">
                {mode === 'resume' ? (
                  <QuestionPanel
                    phase1Content={genState.phase1}
                    phase2Content={genState.phase2}
                    isLoadingPhase1={genState.isLoadingPhase1}
                    isLoadingPhase2={genState.isLoadingPhase2}
                  />
                ) : mode === 'transcript' ? (
                  <ExtractionPanel
                    content={extractState.content}
                    isLoading={extractState.isLoading}
                  />
                ) : (
                  <OptimizePanel
                    content={optimizeState.content}
                    isLoading={optimizeState.isLoading}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Loading progress bar */}
      {isLoading && (
        <div className="fixed bottom-0 left-0 right-0 z-30 h-[2px] bg-border-subtle">
          <div
            className={`h-full transition-all duration-700 ease-out ${
              mode === 'resume'
                ? `bg-gradient-to-r from-accent to-purple-400 ${genState.isLoadingPhase1 ? 'w-1/2' : 'w-full'}`
                : mode === 'transcript'
                  ? 'bg-gradient-to-r from-teal to-cyan-400 w-full animate-shimmer'
                  : 'bg-gradient-to-r from-amber to-orange-400 w-full animate-shimmer'
            }`}
          />
        </div>
      )}

      {/* Success Toast */}
      {successToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3.5 glass-card rounded-2xl text-[13px] text-text-primary animate-fade-in-toast border-border-default">
          <CheckCircle2 className="w-4 h-4 text-success" />
          {mode === 'resume' ? '面试题生成完成' : mode === 'transcript' ? '问答提取完成' : '回答优化完成'}
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
