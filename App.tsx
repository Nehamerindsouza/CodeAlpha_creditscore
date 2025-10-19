
import React, { useState } from 'react';
import { CreditForm } from './components/CreditForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { assessCreditWorthiness } from './services/geminiService';
import type { CreditFormData, PredictionResult } from './types';

const App: React.FC = () => {
  const [formData, setFormData] = useState<CreditFormData>({
    income: 50000,
    debt: 10000,
    creditUtilization: 30,
    latePayments: 0,
    creditAge: 8,
    numAccounts: 5,
  });

  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const prediction = await assessCreditWorthiness(formData);
      setResult(prediction);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <div className="container mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            AI Credit Scoring Model
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400">
            Predict creditworthiness using an AI-powered classification model simulator.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="lg:pr-6">
            <h2 className="text-2xl font-bold text-white mb-4">Financial Profile Input</h2>
            <CreditForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
          
          <div className="lg:pl-6">
             <h2 className="text-2xl font-bold text-white mb-4">Creditworthiness Assessment</h2>
            {error && (
              <div className="rounded-md bg-red-900/50 border border-red-700 p-4 text-center">
                <h3 className="text-sm font-medium text-red-300">An Error Occurred</h3>
                <div className="mt-2 text-sm text-red-400">
                  <p>{error}</p>
                </div>
              </div>
            )}
            
            {!error && <ResultsDisplay result={result} />}

          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
