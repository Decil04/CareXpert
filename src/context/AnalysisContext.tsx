import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Medication {
  name: string;
  dosage: string;
  timing: string;
  duration: string;
}

export interface SideEffect {
  effect: string;
  action: string;
}

export interface AnalysisResult {
  _id?: string;
  diagnosis: string;
  medications: Medication[];
  sideEffects: SideEffect[];
  followUp: string[];
  familySummary: string;
  originalText?: string;
  createdAt?: string;
}

interface AnalysisContextType {
  result: AnalysisResult | null;
  history: AnalysisResult[];
  loading: boolean;
  error: string | null;
  setResult: (result: AnalysisResult | null) => void;
  setHistory: (history: AnalysisResult[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <AnalysisContext.Provider value={{ 
      result, 
      history, 
      loading, 
      error, 
      setResult, 
      setHistory,
      setLoading, 
      setError 
    }}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};
