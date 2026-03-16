export interface ApiConfig {
  apiKey: string;
  endpointId: string;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export type AppMode = 'resume' | 'transcript';

export type InterviewPhase = 'phase1' | 'phase2';

export interface InterviewResult {
  id: string;
  timestamp: number;
  mode?: AppMode;
  resumeSnippet: string;
  phase1: string;
  phase2: string;
  transcriptSnippet?: string;
  extractedContent?: string;
}

export interface GenerationState {
  phase1: string;
  phase2: string;
  isLoadingPhase1: boolean;
  isLoadingPhase2: boolean;
  error: string | null;
}

export interface ExtractionState {
  content: string;
  isLoading: boolean;
  error: string | null;
}
