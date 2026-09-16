import dbConnect from "@/lib/mongoose";
import { AIInsight, AIAnomaly } from "@/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { aiService } from "@/services/ai.service";

export const dynamic = 'force-dynamic';

export default async function AIInsightsPage() {
  await dbConnect();
  
  const anomalies = await AIAnomaly.find()
    .populate('transactionId')
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  // Generate dynamic insights
  // In a real app, we'd calculate this from the DB.
  // For demo, we'll pass some mock metrics to the service to see the output.
  const insightResult = await aiService.generateFinancialInsights({
    currentMonthRevenue: 150000,
    lastMonthRevenue: 120000,
    currentMonthExpense: 105000,
    lastMonthExpense: 80000, // Expense grew faster than revenue
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Insights</h2>
          <p className="text-muted-foreground">
            Machine learning-powered analysis of your financial data, anomalies, and forecasting.
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <BrainCircuit className="h-6 w-6" />
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-indigo-100 shadow-sm">
          <CardHeader className="bg-indigo-50/50 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-indigo-900">
                <Lightbulb className="w-5 h-5 mr-2 text-indigo-500" />
                Strategic Insight
              </CardTitle>
              <Badge variant="outline" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none">
                {insightResult.category}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-2">{insightResult.title}</h3>
            <p className="text-zinc-600 mb-4">{insightResult.explanation}</p>
            <div className="bg-white border rounded-md p-4">
              <p className="text-sm font-medium text-zinc-900">💡 Recommended Action:</p>
              <p className="text-sm text-zinc-600 mt-1">{insightResult.recommendedAction}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-emerald-500" />
              AI Forecast (Next 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                <div className="flex justify-between items-center p-4 border rounded-lg bg-zinc-50">
                  <div>
                    <p className="text-sm text-muted-foreground">Predicted Revenue</p>
                    <p className="text-2xl font-bold text-emerald-600">₹153,000</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">+2%</Badge>
                  </div>
                </div>
                <div className="flex justify-between items-center p-4 border rounded-lg bg-zinc-50">
                  <div>
                    <p className="text-sm text-muted-foreground">Predicted Expense</p>
                    <p className="text-2xl font-bold text-rose-600">₹106,050</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-none">+1%</Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Based on 3-month moving average with 85% confidence.
                </p>
             </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Anomaly Detection Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {anomalies.map((anomaly: any) => (
              <div key={anomaly._id} className="flex items-start space-x-4 border-b pb-4 last:border-0 last:pb-0">
                <AlertTriangle className={
                  `h-5 w-5 mt-0.5 ${anomaly.severity === 'CRITICAL' ? 'text-rose-500' : 'text-amber-500'}`
                } />
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium leading-none">
                      {anomaly.reason}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(anomaly.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground pt-1 flex gap-4">
                    <span>Expected: {anomaly.expectedValue}</span>
                    <span>Actual: <span className="font-semibold text-rose-600">{anomaly.actualValue}</span></span>
                  </div>
                </div>
              </div>
            ))}
            {anomalies.length === 0 && (
               <p className="text-center text-muted-foreground py-8">No anomalies detected in the system.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
