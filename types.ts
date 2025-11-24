export enum AppView {
  HOME = 'HOME',
  PLANT_DOCTOR = 'PLANT_DOCTOR',
  ADVISOR = 'ADVISOR',
  MARKET = 'MARKET'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface AnalysisResult {
  diagnosis: string;
  treatment: string;
  confidence: string;
}
