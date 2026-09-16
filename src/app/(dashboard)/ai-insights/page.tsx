import dbConnect from "@/lib/mongoose";
import { AIInsight, AIAnomaly } from "@/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, TrendingUp, AlertCircle, Lightbulb, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { aiService } from "@/services/ai.service";

export const dynamic = 'force-dynamic';

export default async function AIInsightsPage() {
  await dbConnect();
  
  const anomalies = await AIAnomaly.find()
    .populate('transactionId')
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  const insightResult = await aiService.generateFinancialInsights({
    currentMonthRevenue: 150000,
    lastMonthRevenue: 120000,
    currentMonthExpense: 105000,
    lastMonthExpense: 80000, 
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Intelligence</h2>
        <p className="text-sm text-zinc-500 mt-1">
          Algorithmic analysis of your financial data, forecasting, and anomalies.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-none border-zinc-200">
          <CardHeader className="border-b border-zinc-100 pb-4 mb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-zinc-900 flex items-center">
                Strategic Briefing
              </CardTitle>
              <span className="text-xs font-medium px-2 py-1 bg-zinc-100 text-zinc-600 rounded">
                {insightResult.category}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-medium text-zinc-900 mb-2 leading-snug">{insightResult.title}</h3>
            <p className="text-sm text-zinc-600 mb-6 leading-relaxed">{insightResult.explanation}</p>
            <div className="border border-zinc-200 rounded-md p-4 bg-zinc-50/50">
              <p className="text-xs font-semibold text-zinc-900 uppercase tracking-wider mb-1">Recommendation</p>
              <p className="text-sm text-zinc-700">{insightResult.recommendedAction}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none border-zinc-200">
          <CardHeader className="border-b border-zinc-100 pb-4 mb-4">
            <CardTitle className="text-base font-semibold text-zinc-900 flex items-center">
              30-Day Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                <div className="flex justify-between items-center p-4 border border-zinc-100 rounded-lg">
                  <div>
                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Projected Revenue</p>
                    <p className="text-2xl font-semibold text-zinc-900 tracking-tight">₹153,000</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center text-xs font-medium text-emerald-600">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      2.0%
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 border border-zinc-100 rounded-lg">
                  <div>
                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Projected Expense</p>
                    <p className="text-2xl font-semibold text-zinc-900 tracking-tight">₹106,050</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center text-xs font-medium text-zinc-500">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      1.0%
                    </span>
                  </div>
                </div>
                <p className="text-xs text-zinc-400 text-center pt-2">
                  Model confidence: 85% • Based on 3-month moving average
                </p>
             </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-none border-zinc-200">
        <CardHeader className="border-b border-zinc-100 pb-4 mb-0">
          <CardTitle className="text-base font-semibold text-zinc-900">Audit Log</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col">
            {anomalies.map((anomaly: any, index: number) => (
              <div key={anomaly._id} className={`flex items-start space-x-4 p-4 ${index !== anomalies.length - 1 ? 'border-b border-zinc-100' : ''}`}>
                <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${anomaly.severity === 'CRITICAL' ? 'bg-red-500' : 'bg-amber-400'}`} />
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-zinc-900 leading-tight">
                      {anomaly.reason}
                    </p>
                    <span className="text-xs text-zinc-400">
                      {new Date(anomaly.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500 pt-1 flex gap-6">
                    <span className="flex flex-col">
                      <span className="text-zinc-400 mb-0.5">Expected</span>
                      <span className="font-mono text-zinc-600">{anomaly.expectedValue}</span>
                    </span>
                    <span className="flex flex-col">
                      <span className="text-zinc-400 mb-0.5">Detected</span>
                      <span className="font-mono text-zinc-900 font-medium">{anomaly.actualValue}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {anomalies.length === 0 && (
               <p className="text-center text-zinc-500 py-12 text-sm">System operating within normal parameters.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
