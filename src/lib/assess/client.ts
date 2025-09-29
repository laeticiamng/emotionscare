import type { InstrumentCode } from './types';

/**
 * Mock client for assessment system - simulates Supabase edge functions
 */

export async function startAssess(body: any) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    session_id: `mock-${Date.now()}`,
    items: [],
    expiry_ts: Date.now() + 30 * 60 * 1000
  };
}

export async function submitAssess(body: any) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    receipt_id: `receipt-${Date.now()}`,
    orchestration: {
      hints: ['Évaluation terminée avec succès']
    }
  };
}

export async function aggregateAssess(body: any) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return {
    ok: true as const,
    n: 1,
    text_summary: ['Résultats agrégés disponibles']
  };
}