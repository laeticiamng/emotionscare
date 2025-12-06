// Types pour les composants assess
export type Instrument = 
  | 'WHO5' 
  | 'STAI6' 
  | 'PANAS10'
  | 'PSS10' 
  | 'UCLA3' 
  | 'MSPSS' 
  | 'AAQ2' 
  | 'POMS_SF' 
  | 'SSQ' 
  | 'ISI' 
  | 'GAS' 
  | 'GRITS' 
  | 'BRS' 
  | 'WEMWBS' 
  | 'SWEMWBS' 
  | 'UWES9' 
  | 'CBI' 
  | 'CVSQ' 
  | 'SAM' 
  | 'SUDS';

export interface AssessmentItem {
  id: string;
  prompt: string;
  type: 'scale' | 'choice' | 'slider';
  min?: number;
  max?: number;
  choices?: string[];
  reversed?: boolean;
  subscale?: string;
}

export interface StartOutput {
  session_id: string;
  instrument: Instrument;
  items: AssessmentItem[];
  expiry_at?: string;
}

export interface SubmitOutput {
  success: boolean;
  orchestration: {
    hints: string[];
  };
}
