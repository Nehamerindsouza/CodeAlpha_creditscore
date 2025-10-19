import { CreditFormData, PredictionResult } from '../types';

// Note: Calling Google GenAI from the browser is not recommended.
// This file provides a deterministic simulated implementation so the UI
// can run in development without a server-side API key. Replace with a
// server-side implementation that calls the real API for production.

const clamp = (v: number, a = 300, b = 850) => Math.max(a, Math.min(b, Math.round(v)));

const scoreToRating = (score: number) => {
  if (score >= 800) return 'Excellent';
  if (score >= 740) return 'Good';
  if (score >= 670) return 'Fair';
  if (score >= 580) return 'Poor';
  return 'Very Poor';
};

const seededRand = (seed: number) => {
  // simple LCG
  let s = Math.abs(Math.floor(seed)) % 2147483647;
  return () => {
    s = (s * 48271) % 2147483647;
    return (s % 1000) / 1000;
  };
};

export const assessCreditWorthiness = async (data: CreditFormData): Promise<PredictionResult> => {
  // deterministic pseudo-randomness based on input so repeated calls return similar results
  const seed = Math.floor(data.income + data.debt + data.creditUtilization + data.latePayments * 37 + data.creditAge * 13 + data.numAccounts * 7);
  const rand = seededRand(seed);

  // Simple heuristic scoring to simulate an ML model
  const utilizationPenalty = (data.creditUtilization / 100) * 150; // up to -150
  const debtRatio = data.debt > 0 ? Math.min(1, data.debt / Math.max(1, data.income)) : 0;
  const debtPenalty = debtRatio * 200; // up to -200
  const latePenalty = Math.min(60, data.latePayments * 20);
  const ageBonus = Math.min(60, data.creditAge * 3);
  const accountsBonus = Math.min(40, data.numAccounts * 2);

  const base = 720;
  const noisy = (rand() - 0.5) * 20;
  const rawScore = base - utilizationPenalty - debtPenalty - latePenalty + ageBonus + accountsBonus + noisy;
  const creditScore = clamp(rawScore);

  const creditRating = scoreToRating(creditScore) as PredictionResult['creditRating'];

  const justification = `Based on income of $${data.income.toLocaleString()} and a credit utilization of ${data.creditUtilization}%, this profile results in a ${creditRating.toLowerCase()} score. Key factors: ${data.latePayments} late payments, debt-to-income ratio ~${(debtRatio * 100).toFixed(0)}%, and account history of ${data.creditAge} years.`;

  // Simulated model analysis (real values should come from a server/ML pipeline)
  const precision = 0.7 + rand() * 0.25; // 0.7 - 0.95
  const recall = 0.65 + rand() * 0.3; // 0.65 - 0.95
  const f1Score = (2 * precision * recall) / (precision + recall);
  const rocAuc = 0.7 + rand() * 0.25;

  // tiny artificial delay to mimic network
  await new Promise((res) => setTimeout(res, 500 + Math.round(rand() * 600)));

  return {
    creditScore,
    creditRating,
    justification,
    modelAnalysis: {
      precision,
      recall,
      f1Score,
      rocAuc,
      modelUsed: 'Simulated Random Forest',
    },
  };
};