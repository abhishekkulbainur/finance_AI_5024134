import { getTransactions } from "@/actions/transaction.actions";
import { TransactionsClient } from "./TransactionsClient";

export const dynamic = 'force-dynamic';

export default async function TransactionsPage() {
  const transactions = await getTransactions();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
        <p className="text-muted-foreground">
          View and manage all your financial transactions. AI auto-generates ledger entries upon approval.
        </p>
      </div>
      
      <TransactionsClient initialData={transactions} />
    </div>
  );
}
