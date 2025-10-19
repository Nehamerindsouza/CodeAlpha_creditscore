
export interface CreditFormData {
  income: number;
  debt: number;
  creditUtilization: number;
  latePayments: number;
  creditAge: number;
  numAccounts: number;
}

export interface ModelAnalysis {
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  modelUsed: string;
}

export interface PredictionResult {
  creditScore: number;
  creditRating: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Very Poor';
  justification: string;
  modelAnalysis: ModelAnalysis;
}
