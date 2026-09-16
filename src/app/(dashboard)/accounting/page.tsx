import dbConnect from "@/lib/mongoose";
import { JournalEntry, Account } from "@/models";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = 'force-dynamic';

export default async function AccountingPage() {
  await dbConnect();
  
  const entries = await JournalEntry.find()
    .populate('lines.accountId')
    .sort({ date: -1 })
    .limit(50)
    .lean();

  const accounts = await Account.find().sort({ code: 1 }).lean();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">General Ledger</h2>
        <p className="text-sm text-zinc-500 mt-1">
          Double-entry journal records automatically maintained by the engine.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-none border-zinc-200">
            <CardHeader className="border-b border-zinc-100 pb-4 mb-4">
              <CardTitle className="text-base font-semibold text-zinc-900">Recent Journal Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {entries.map((entry: any) => (
                  <div key={entry._id} className="border border-zinc-200 rounded-lg overflow-hidden">
                    <div className="bg-zinc-50/80 border-b border-zinc-200 p-3 flex justify-between items-center">
                      <div className="text-xs font-semibold text-zinc-900 flex items-center">
                        <span className="font-mono bg-white border border-zinc-200 px-1.5 py-0.5 rounded text-zinc-500 mr-2">{entry.voucherNumber}</span>
                        <span>{new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="text-xs text-zinc-500">
                        {entry.description}
                      </div>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent border-b-zinc-100">
                          <TableHead className="font-medium text-zinc-500 text-xs uppercase tracking-wider h-8">Account</TableHead>
                          <TableHead className="font-medium text-zinc-500 text-xs uppercase tracking-wider h-8 text-right">Debit</TableHead>
                          <TableHead className="font-medium text-zinc-500 text-xs uppercase tracking-wider h-8 text-right">Credit</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {entry.lines.map((line: any, idx: number) => (
                          <TableRow key={idx} className="hover:bg-transparent border-none">
                            <TableCell className={`text-sm font-medium text-zinc-900 ${line.type === 'CREDIT' ? 'pl-8 text-zinc-600' : ''}`}>
                              {line.accountId?.code} - {line.accountId?.name}
                            </TableCell>
                            <TableCell className="text-sm text-right font-medium text-zinc-900">
                              {line.type === 'DEBIT' ? `₹${line.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : ''}
                            </TableCell>
                            <TableCell className="text-sm text-right font-medium text-zinc-900">
                              {line.type === 'CREDIT' ? `₹${line.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : ''}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ))}

                {entries.length === 0 && (
                  <div className="text-center py-12 text-zinc-500 text-sm">
                    No journal entries found.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="shadow-none border-zinc-200">
            <CardHeader className="border-b border-zinc-100 pb-4 mb-0">
              <CardTitle className="text-base font-semibold text-zinc-900">Chart of Accounts</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b-zinc-200">
                    <TableHead className="font-medium text-zinc-500 text-xs uppercase tracking-wider h-10">Account</TableHead>
                    <TableHead className="font-medium text-zinc-500 text-xs uppercase tracking-wider h-10 text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((acc: any) => (
                    <TableRow key={acc._id} className="border-b-zinc-100">
                      <TableCell>
                        <div className="text-sm font-medium text-zinc-900">{acc.name}</div>
                        <div className="text-xs text-zinc-500 mt-0.5"><span className="font-mono">{acc.code}</span> • {acc.type}</div>
                      </TableCell>
                      <TableCell className="text-sm text-right font-medium text-zinc-900">
                        ₹{acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
