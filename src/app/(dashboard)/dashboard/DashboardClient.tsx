"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

interface DashboardClientProps {
  totalRevenue: number;
  totalExpense: number;
  netIncome: number;
  cashBalance: number;
  anomalies: any[];
  chartData: any[];
  aiInsight?: any;
  aiForecast?: any;
}

export const DashboardClient = ({
  totalRevenue,
  totalExpense,
  netIncome,
  cashBalance,
  anomalies,
  chartData,
  aiInsight,
  aiForecast
}: DashboardClientProps) => {

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Overview</h2>
        <p className="text-sm text-zinc-500 mt-1">
          Your financial summary and recent AI insights.
        </p>
      </div>

      {aiInsight && (
        <Card className="bg-zinc-900 text-white shadow-none border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              AI Insight: {aiInsight.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-300">{aiInsight.explanation}</p>
            <p className="text-sm text-zinc-400 mt-2">Recommended: {aiInsight.recommendedAction}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-none border-zinc-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-zinc-900 tracking-tight">₹{totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs mt-2 text-emerald-600 font-medium">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>{aiForecast ? `Predicted Next: ₹${Math.round(aiForecast.predictedRevenue).toLocaleString()}` : 'Tracking steady'}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-none border-zinc-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-zinc-900 tracking-tight">₹{totalExpense.toLocaleString()}</div>
            <div className="flex items-center text-xs mt-2 text-amber-600 font-medium">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>{aiForecast ? `Predicted Next: ₹${Math.round(aiForecast.predictedExpense).toLocaleString()}` : 'Tracking steady'}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none border-zinc-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Net Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-zinc-900 tracking-tight">₹{netIncome.toLocaleString()}</div>
            <div className="flex items-center text-xs mt-2 text-zinc-500 font-medium">
              <Activity className="h-3 w-3 mr-1" />
              <span>Healthy margin</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none border-zinc-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Cash Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-zinc-900 tracking-tight">₹{cashBalance.toLocaleString()}</div>
            <div className="flex items-center text-xs mt-2 text-zinc-500 font-medium">
              <span>Available liquidity</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-none border-zinc-200">
          <CardHeader className="border-b border-zinc-100 pb-4 mb-4">
            <CardTitle className="text-base font-semibold text-zinc-900">Cash Flow</CardTitle>
          </CardHeader>
          <CardContent className="pl-0 pr-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#71717a', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#71717a', fontSize: 12 }}
                    tickFormatter={(value) => `₹${value / 1000}k`}
                    dx={-10}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '6px', border: '1px solid #e4e4e7', boxShadow: 'none' }}
                    formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, '']}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                  <Line type="monotone" name="Revenue" dataKey="revenue" stroke="#0f172a" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                  <Line type="monotone" name="Expense" dataKey="expense" stroke="#a1a1aa" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 shadow-none border-zinc-200">
          <CardHeader className="border-b border-zinc-100 pb-4 mb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-zinc-900">AI Anomalies</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col">
              {anomalies.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-zinc-500">
                  <p className="text-sm">No anomalies detected.</p>
                </div>
              ) : (
                anomalies.map((anomaly, index) => (
                  <div key={anomaly._id} className={`flex items-start space-x-4 p-4 ${index !== anomalies.length - 1 ? 'border-b border-zinc-100' : ''}`}>
                    <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${anomaly.severity === 'CRITICAL' ? 'bg-red-500' : 'bg-amber-400'}`} />
                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-medium text-zinc-900 leading-tight">
                        {anomaly.reason}
                      </p>
                      <div className="text-xs text-zinc-500 pt-1 flex flex-col gap-0.5">
                        <span className="flex justify-between">
                          <span>Expected range:</span>
                          <span className="font-mono">{anomaly.expectedValue}</span>
                        </span>
                        <span className="flex justify-between">
                          <span>Detected value:</span>
                          <span className="font-mono text-zinc-900 font-medium">{anomaly.actualValue}</span>
                        </span>
                      </div>
                      {anomaly.recommendedAction && (
                        <p className="text-xs text-zinc-600 font-medium pt-2 mt-2 border-t border-zinc-100">
                          Action: {anomaly.recommendedAction}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
