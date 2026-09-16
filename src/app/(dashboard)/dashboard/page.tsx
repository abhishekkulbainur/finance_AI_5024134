import dbConnect from "@/lib/mongoose";
import { Transaction, Account, AIAnomaly } from "@/models";
import { DashboardClient } from "./DashboardClient";
import { aiService } from "@/services/ai.service";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  await dbConnect();

  // Fetch data
  const accounts = await Account.find().lean();
  
  const revenueAccount = accounts.find((a: any) => a.code === '4000');
  const expenseAccounts = accounts.filter((a: any) => a.code.startsWith('5'));
  const bankAccount = accounts.find((a: any) => a.code === '1100');

  const totalRevenue = revenueAccount ? revenueAccount.balance : 0;
  const totalExpense = expenseAccounts.reduce((acc: number, curr: any) => acc + curr.balance, 0);
  const netIncome = totalRevenue - totalExpense;
  const cashBalance = bankAccount ? bankAccount.balance : 0;

  // Get recent anomalies
  const anomalies = await AIAnomaly.find()
    .populate('transactionId')
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  // Get monthly data for the chart (mocking it from transactions)
  const transactions = await Transaction.find({
    date: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) }
  }).sort({ date: 1 }).lean();

  const monthlyData: Record<string, { name: string; revenue: number; expense: number }> = {};
  
  transactions.forEach((t: any) => {
    const month = new Date(t.date).toLocaleString('default', { month: 'short' });
    if (!monthlyData[month]) {
      monthlyData[month] = { name: month, revenue: 0, expense: 0 };
    }
    if (t.type === 'INCOME') {
      monthlyData[month].revenue += t.amount;
    } else if (t.type === 'EXPENSE') {
      monthlyData[month].expense += t.amount;
    }
  });

  const chartData = Object.values(monthlyData);

  // Generate AI Insights and Forecasts
  // In a real app we'd calculate current vs last month accurately from transactions
  let currentMonthRevenue = 0;
  let lastMonthRevenue = 0;
  let currentMonthExpense = 0;
  let lastMonthExpense = 0;
  
  if (chartData.length >= 2) {
    const current = chartData[chartData.length - 1];
    const previous = chartData[chartData.length - 2];
    currentMonthRevenue = current.revenue;
    lastMonthRevenue = previous.revenue;
    currentMonthExpense = current.expense;
    lastMonthExpense = previous.expense;
  }

  const aiInsight = await aiService.generateFinancialInsights({
    currentMonthRevenue,
    lastMonthRevenue,
    currentMonthExpense,
    lastMonthExpense
  });

  let aiForecast = null;
  if (chartData.length >= 3) {
    aiForecast = await aiService.forecastFinancialMetrics(chartData);
  }

  return (
    <DashboardClient 
      totalRevenue={totalRevenue}
      totalExpense={totalExpense}
      netIncome={netIncome}
      cashBalance={cashBalance}
      anomalies={JSON.parse(JSON.stringify(anomalies))}
      chartData={chartData}
      aiInsight={aiInsight}
      aiForecast={aiForecast}
    />
  );
}
