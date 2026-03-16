export interface ApiConfig {
  apiKey: string;
  endpointId: string;
}

export type InterviewPhase = 'phase1' | 'phase2';

export interface InterviewResult {
  id: string;
  timestamp: number;
  resumeSnippet: string;
  phase1: string;
  phase2: string;
}

export interface GenerationState {
  phase1: string;
  phase2: string;
  isLoadingPhase1: boolean;
  isLoadingPhase2: boolean;
  error: string | null;
}
