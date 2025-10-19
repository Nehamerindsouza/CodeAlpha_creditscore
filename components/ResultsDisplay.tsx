
import React from 'react';
import { PredictionResult } from '../types';

const getRatingColor = (rating: string) => {
  switch (rating) {
    case 'Excellent': return 'text-green-400';
    case 'Good': return 'text-sky-400';
    case 'Fair': return 'text-yellow-400';
    case 'Poor': return 'text-orange-400';
    case 'Very Poor': return 'text-red-500';
    default: return 'text-slate-400';
  }
};

interface CreditScoreGaugeProps {
  score: number;
}

const CreditScoreGauge: React.FC<CreditScoreGaugeProps> = ({ score }) => {
  const minScore = 300;
  const maxScore = 850;
  const percentage = (score - minScore) / (maxScore - minScore);
  const rotation = -90 + percentage * 180;
  
  const colorStops = [
    { stop: 0, color: '#ef4444' }, // red-500
    { stop: 0.35, color: '#f97316' }, // orange-500
    { stop: 0.58, color: '#facc15' }, // yellow-400
    { stop: 0.76, color: '#38bdf8' }, // sky-400
    { stop: 1, color: '#4ade80' }, // green-400
  ];
  
  const getNeedleColor = () => {
    if (score >= 800) return '#4ade80';
    if (score >= 740) return '#38bdf8';
    if (score >= 670) return '#facc15';
    if (score >= 580) return '#f97316';
    return '#ef4444';
  }

  return (
    <div className="relative flex justify-center items-center w-64 h-32">
       <svg width="256" height="128" viewBox="0 0 256 128" className="absolute">
         <defs>
           <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
             {colorStops.map(cs => <stop key={cs.stop} offset={`${cs.stop * 100}%`} stopColor={cs.color} />)}
           </linearGradient>
         </defs>
         <path
           d="M 28 128 A 100 100 0 0 1 228 128"
           stroke="url(#gaugeGradient)"
           strokeWidth="24"
           fill="none"
           strokeLinecap="round"
         />
       </svg>
       <div 
        className="absolute bottom-0 w-1.5 h-[100px] origin-bottom transition-transform duration-1000"
        style={{ transform: `rotate(${rotation}deg)`, backgroundColor: getNeedleColor() }}
       >
         <div className="w-4 h-4 bg-white rounded-full absolute -top-2 -left-[6.5px] border-2 border-slate-800"></div>
       </div>
    </div>
  );
};


const MetricCard: React.FC<{ label: string; value: string | number; }> = ({ label, value }) => (
    <div className="flex flex-col items-center justify-center rounded-lg bg-slate-900 p-4 text-center">
        <span className="text-2xl font-bold text-sky-400">{value}</span>
        <span className="text-sm text-slate-400">{label}</span>
    </div>
);


export const ResultsDisplay: React.FC<{ result: PredictionResult | null }> = ({ result }) => {
  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center text-center rounded-lg bg-slate-800/50 p-8 shadow-2xl backdrop-blur-sm min-h-[300px]">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-lg font-medium text-slate-300">Awaiting Analysis</h3>
        <p className="mt-1 text-sm text-slate-400">
          Please fill out the form to assess creditworthiness.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
        <div className="rounded-lg bg-slate-800/50 p-8 text-center shadow-2xl backdrop-blur-sm">
            <div className="flex flex-col items-center">
                <CreditScoreGauge score={result.creditScore} />
                <div className="mt-[-20px]">
                    <p className="text-6xl font-bold tracking-tight text-white">{result.creditScore}</p>
                    <p className={`text-2xl font-semibold ${getRatingColor(result.creditRating)}`}>{result.creditRating}</p>
                </div>
            </div>
            <div className="mt-6 text-left border-t border-slate-700 pt-6">
                <h4 className="text-lg font-medium text-slate-200">Justification</h4>
                <p className="mt-2 text-slate-400">{result.justification}</p>
            </div>
        </div>

        <div className="rounded-lg bg-slate-800/50 p-8 shadow-2xl backdrop-blur-sm">
            <h3 className="text-xl font-semibold tracking-tight text-white mb-4">Simulated Model Performance</h3>
            <p className="text-sm text-slate-400 mb-6">These metrics evaluate the accuracy of the underlying <strong>{result.modelAnalysis.modelUsed}</strong> used for this prediction.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard label="Precision" value={result.modelAnalysis.precision.toFixed(2)} />
                <MetricCard label="Recall" value={result.modelAnalysis.recall.toFixed(2)} />
                <MetricCard label="F1-Score" value={result.modelAnalysis.f1Score.toFixed(2)} />
                <MetricCard label="ROC-AUC" value={result.modelAnalysis.rocAuc.toFixed(2)} />
            </div>
        </div>
    </div>
  );
};
