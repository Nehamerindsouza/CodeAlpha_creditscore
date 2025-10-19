
import React from 'react';
import { CreditFormData } from '../types';

interface CreditFormProps {
  formData: CreditFormData;
  setFormData: React.Dispatch<React.SetStateAction<CreditFormData>>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const InputField: React.FC<{
  label: string;
  id: keyof CreditFormData;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  step?: string;
  min?: string;
  max?: string;
  adornment?: string;
}> = ({ label, id, value, onChange, type = 'number', step = '1', min = '0', max, adornment }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-300">
      {label}
    </label>
    <div className="relative mt-1">
      {adornment && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="text-slate-400 sm:text-sm">{adornment}</span>
        </div>
      )}
      <input
        type={type}
        name={id}
        id={id}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        className={`block w-full rounded-md border-slate-700 bg-slate-800 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm ${adornment ? 'pl-7' : 'pl-3'}`}
        placeholder="0"
      />
    </div>
  </div>
);


export const CreditForm: React.FC<CreditFormProps> = ({ formData, setFormData, onSubmit, isLoading }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === '' ? 0 : parseFloat(value),
    }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 rounded-lg bg-slate-800/50 p-8 shadow-2xl backdrop-blur-sm">
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
        <InputField
            label="Annual Income"
            id="income"
            value={formData.income}
            onChange={handleChange}
            step="1000"
            adornment="$"
        />
        <InputField
            label="Total Debt (excluding mortgage)"
            id="debt"
            value={formData.debt}
            onChange={handleChange}
            step="500"
            adornment="$"
        />
        <InputField
            label="Credit Utilization"
            id="creditUtilization"
            value={formData.creditUtilization}
            onChange={handleChange}
            max="100"
            adornment="%"
        />
        <InputField
            label="Late Payments (last 12 mos.)"
            id="latePayments"
            value={formData.latePayments}
            onChange={handleChange}
        />
        <InputField
            label="Age of Oldest Account (years)"
            id="creditAge"
            value={formData.creditAge}
            onChange={handleChange}
        />
        <InputField
            label="Total Number of Open Accounts"
            id="numAccounts"
            value={formData.numAccounts}
            onChange={handleChange}
        />
      </div>
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full justify-center rounded-md border border-transparent bg-sky-600 py-3 px-4 text-sm font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:bg-sky-800 disabled:opacity-60 transition-all duration-200"
        >
          {isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Assessing...
            </div>
          ) : (
            'Assess Creditworthiness'
          )}
        </button>
      </div>
    </form>
  );
};
