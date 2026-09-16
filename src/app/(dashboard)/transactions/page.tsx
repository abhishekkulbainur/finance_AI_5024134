import { getTransactions } from "@/actions/transaction.actions";
import { TransactionsClient } from "./TransactionsClient";
import { TransactionForm } from "@/components/transactions/TransactionForm";

export const dynamic = 'force-dynamic';

export default async function TransactionsPage() {
  const transactions = await getTransactions();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Transactions</h2>
          <p className="text-sm text-zinc-500 mt-1">
            View and manage all your financial transactions.
          </p>
        </div>
        <TransactionForm />
      </div>
      
      <TransactionsClient initialData={transactions} />
    </div>
  );
}
