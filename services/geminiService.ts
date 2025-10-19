import { GoogleGenAI, Type } from "@google/genai";
import { CreditFormData, PredictionResult } from '../types';

// Securely reads the API key from the GitHub Codespaces secret you configured.
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  // This error will be shown if the secret is not set up correctly in your repository settings.
  throw new Error("GEMINI_API_KEY not set. Please go to your repository's Settings > Secrets and variables > Codespaces, and create a new secret named GEMINI_API_KEY with your API key as the value. You may need to rebuild the Codespace container for the change to take effect.");
}

const ai = new GoogleGenAI({ apiKey: apiKey });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    creditScore: {
      type: Type.INTEGER,
      description: "A credit score between 300 and 850.",
    },
    creditRating: {
      type: Type.STRING,
      enum: ['Excellent', 'Good', 'Fair', 'Poor', 'Very Poor'],
      description: "The credit rating category.",
    },
    justification: {
      type: Type.STRING,
      description: "A brief, 2-3 sentence justification for the score and rating, highlighting key influencing factors.",
    },
    modelAnalysis: {
      type: Type.OBJECT,
      properties: {
        precision: { type: Type.NUMBER },
        recall: { type: Type.NUMBER },
        f1Score: { type: Type.NUMBER },
        rocAuc: { type: Type.NUMBER },
        modelUsed: { type: Type.STRING, description: "The type of classification model simulated, e.g., 'Simulated Random Forest'." },
      },
      required: ['precision', 'recall', 'f1Score', 'rocAuc', 'modelUsed'],
      description: "Simulated performance metrics of the underlying classification model.",
    },
  },
  required: ['creditScore', 'creditRating', 'justification', 'modelAnalysis'],
};

export const assessCreditWorthiness = async (
  data: CreditFormData
): Promise<PredictionResult> => {
  const prompt = `
    Analyze the following financial profile to determine creditworthiness. Act as an expert credit risk analyst AI.

    Financial Profile:
    - Annual Income: $${data.income.toLocaleString()}
    - Total Debt: $${data.debt.toLocaleString()}
    - Credit Utilization: ${data.creditUtilization}%
    - Number of Late Payments (last 12 months): ${data.latePayments}
    - Age of Oldest Credit Account (years): ${data.creditAge}
    - Total Number of Open Accounts: ${data.numAccounts}

    Based on this profile, provide a JSON response containing:
    1. A credit score (300-850).
    2. A credit rating ('Excellent', 'Good', 'Fair', 'Poor', 'Very Poor').
    3. A brief justification for the assessment.
    4. A simulated performance analysis of the underlying classification model (Random Forest) including precision, recall, F1-score, and ROC-AUC metrics (generate realistic values for these).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);

    // Basic validation to ensure the result matches the expected structure
    if (
      typeof result.creditScore !== 'number' ||
      typeof result.creditRating !== 'string' ||
      typeof result.justification !== 'string' ||
      typeof result.modelAnalysis !== 'object'
    ) {
      throw new Error('Invalid response structure from API.');
    }

    return result as PredictionResult;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error(
      "Failed to assess creditworthiness. The API might be unavailable or the response was malformed."
    );
  }
};