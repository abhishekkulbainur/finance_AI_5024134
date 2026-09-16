import { ITransaction } from '@/models/Transaction';
import { IInvoice } from '@/models/Invoice';

export interface ExtractInvoiceResult {
  vendorName: string;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  gstin: string;
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  grandTotal: number;
  paymentTerms: string;
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
  }>;
  confidenceScore: number;
}

export interface CategorizeResult {
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER' | 'REFUND';
  categoryName: string;
  confidence: number;
}

export interface AnomalyResult {
  isAnomaly: boolean;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  reason?: string;
  expectedValue?: string;
  actualValue?: string;
  recommendedAction?: string;
}

export interface InsightResult {
  title: string;
  category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  explanation: string;
  recommendedAction: string;
}

export interface ForecastResult {
  period: string;
  predictedRevenue: number;
  predictedExpense: number;
  confidence: number;
}

class AIService {
  /**
   * Mocks OCR and information extraction from an uploaded invoice file.
   * In a real implementation, this would call AWS Textract, Google Document AI, or OpenAI.
   */
  public async extractInvoice(fileBuffer: Buffer, fileName: string): Promise<ExtractInvoiceResult> {
    // Simulating processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate pseudo-random deterministic data based on filename length
    const rand = (fileName.length % 10) + 1;
    const subtotal = 1000 * rand;
    const tax = subtotal * 0.18; // 18% GST

    return {
      vendorName: 'Acme Cloud Services Ltd',
      invoiceNumber: `INV-${Math.floor(Math.random() * 10000)}`,
      invoiceDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days later
      gstin: '27AADCB2230M1Z2',
      subtotal: subtotal,
      cgst: tax / 2,
      sgst: tax / 2,
      igst: 0,
      totalTax: tax,
      grandTotal: subtotal + tax,
      paymentTerms: 'Net 30',
      lineItems: [
        {
          description: 'Cloud Compute Instance (August)',
          quantity: 1,
          unitPrice: subtotal,
          totalAmount: subtotal,
        },
      ],
      confidenceScore: 0.92,
    };
  }

  /**
   * Automatically categorizes a transaction based on its description and amount.
   */
  public async categorizeTransaction(description: string, amount: number): Promise<CategorizeResult> {
    const descLower = description.toLowerCase();

    if (descLower.includes('aws') || descLower.includes('cloud') || descLower.includes('hosting')) {
      return { type: 'EXPENSE', categoryName: 'Cloud Services', confidence: 0.95 };
    }
    if (descLower.includes('salary') || descLower.includes('payroll')) {
      return { type: 'EXPENSE', categoryName: 'Salaries', confidence: 0.99 };
    }
    if (descLower.includes('client') || descLower.includes('payment') || descLower.includes('invoice')) {
      return { type: 'INCOME', categoryName: 'Client Revenue', confidence: 0.85 };
    }

    // Default fallback
    return { type: 'EXPENSE', categoryName: 'Miscellaneous', confidence: 0.6 };
  }

  /**
   * Detects unusual expenses or anomalies using statistical Z-score methods.
   */
  public async detectAnomalies(transaction: any, historicalTransactions: any[]): Promise<AnomalyResult> {
    if (historicalTransactions.length < 5) {
      return { isAnomaly: false }; // Not enough data
    }

    const amounts = historicalTransactions
      .filter((t) => t.type === transaction.type)
      .map((t) => t.amount);

    if (amounts.length === 0) return { isAnomaly: false };

    const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const stdDev = Math.sqrt(amounts.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / amounts.length);

    // Z-Score = (X - Mean) / StdDev
    const zScore = stdDev === 0 ? 0 : (transaction.amount - mean) / stdDev;

    if (Math.abs(zScore) > 2) {
      // Amount is more than 2 standard deviations away from the mean
      return {
        isAnomaly: true,
        severity: Math.abs(zScore) > 3 ? 'CRITICAL' : 'HIGH',
        reason: 'The transaction amount is significantly higher than historical averages.',
        expectedValue: `₹${Math.round(mean).toLocaleString()}`,
        actualValue: `₹${transaction.amount.toLocaleString()}`,
        recommendedAction: 'Review this transaction and verify the vendor invoice.',
      };
    }

    return { isAnomaly: false };
  }

  /**
   * Generates natural language insights based on financial trends.
   */
  public async generateFinancialInsights(metrics: { currentMonthRevenue: number; lastMonthRevenue: number; currentMonthExpense: number; lastMonthExpense: number }): Promise<InsightResult> {
    const revChange = metrics.lastMonthRevenue === 0 ? 0 : ((metrics.currentMonthRevenue - metrics.lastMonthRevenue) / metrics.lastMonthRevenue) * 100;
    const expChange = metrics.lastMonthExpense === 0 ? 0 : ((metrics.currentMonthExpense - metrics.lastMonthExpense) / metrics.lastMonthExpense) * 100;

    if (expChange > revChange && expChange > 10) {
      return {
        title: 'Rapid Expense Growth Detected',
        category: 'Expense',
        severity: 'MEDIUM',
        explanation: `Expenses increased by ${expChange.toFixed(1)}% compared to last month, outpacing the revenue growth of ${revChange.toFixed(1)}%.`,
        recommendedAction: 'Review major expense categories for cost-cutting opportunities.',
      };
    }

    if (revChange > 15) {
      return {
        title: 'Strong Revenue Growth',
        category: 'Revenue',
        severity: 'LOW',
        explanation: `Revenue grew by an impressive ${revChange.toFixed(1)}% compared to last month.`,
        recommendedAction: 'Analyze top performing sales channels to double down on success.',
      };
    }

    return {
      title: 'Stable Financial Performance',
      category: 'General',
      severity: 'LOW',
      explanation: 'Both revenue and expenses are tracking closely with historical averages.',
      recommendedAction: 'Continue monitoring budget utilization.',
    };
  }

  /**
   * Forecasts future revenue and expenses using simple moving averages.
   */
  public async forecastFinancialMetrics(historicalMonthlyData: Array<{ revenue: number; expense: number }>): Promise<ForecastResult> {
    if (historicalMonthlyData.length < 3) {
      throw new Error('Insufficient historical data for reliable forecasting.');
    }

    // Simple 3-month moving average
    const recentData = historicalMonthlyData.slice(-3);
    const avgRev = recentData.reduce((acc, val) => acc + val.revenue, 0) / 3;
    const avgExp = recentData.reduce((acc, val) => acc + val.expense, 0) / 3;

    return {
      period: 'Next Month',
      predictedRevenue: avgRev * (1 + 0.02), // Assume 2% baseline growth
      predictedExpense: avgExp * (1 + 0.01), // Assume 1% baseline inflation
      confidence: 0.85,
    };
  }
}

export const aiService = new AIService();
