"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  IndianRupee, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  BrainCircuit,
  Activity
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
}

export const DashboardClient = ({
  totalRevenue,
  totalExpense,
  netIncome,
  cashBalance,
  anomalies,
  chartData
}: DashboardClientProps) => {

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back to FinAI. Here is an overview of your financials.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalExpense.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+4% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
            <Activity className="h-4 w-4 text-sky-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{netIncome.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Strong performance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Balance</CardTitle>
            <IndianRupee className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{cashBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Available liquidity</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tickFormatter={(value) => `₹${value / 1000}k`}
                  />
                  <Tooltip 
                    formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, '']}
                  />
                  <Legend />
                  <Line type="monotone" name="Revenue" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 8 }} />
                  <Line type="monotone" name="Expense" dataKey="expense" stroke="#f43f5e" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>AI Anomalies & Alerts</CardTitle>
              <BrainCircuit className="h-5 w-5 text-indigo-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {anomalies.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <BrainCircuit className="h-8 w-8 mb-4 text-zinc-300" />
                  <p>AI is monitoring your transactions.</p>
                  <p className="text-sm">No anomalies detected recently.</p>
                </div>
              ) : (
                anomalies.map((anomaly) => (
                  <div key={anomaly._id} className="flex items-start space-x-4 border border-zinc-100 p-4 rounded-lg bg-zinc-50/50">
                    <AlertTriangle className={
                      `h-5 w-5 mt-0.5 ${anomaly.severity === 'CRITICAL' ? 'text-rose-500' : 'text-amber-500'}`
                    } />
                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-medium leading-none">
                        {anomaly.reason}
                      </p>
                      <div className="text-xs text-muted-foreground pt-1 flex flex-col gap-1">
                        <span>Expected: {anomaly.expectedValue}</span>
                        <span>Actual: <span className="font-semibold text-rose-600">{anomaly.actualValue}</span></span>
                      </div>
                      {anomaly.recommendedAction && (
                        <p className="text-xs text-indigo-600 font-medium pt-2">
                          💡 Action: {anomaly.recommendedAction}
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
