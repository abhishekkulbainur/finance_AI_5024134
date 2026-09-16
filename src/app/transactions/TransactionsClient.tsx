"use client";

import { useState, useTransition } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, MoreHorizontal, FileText, ArrowRightLeft } from "lucide-react";
import { approveTransaction } from "@/actions/transaction.actions";

export const TransactionsClient = ({ initialData }: { initialData: any[] }) => {
  const [isPending, startTransition] = useTransition();

  const handleApprove = (id: string) => {
    startTransition(async () => {
      await approveTransaction(id);
    });
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData.map((transaction) => (
              <TableRow key={transaction._id}>
                <TableCell className="font-medium">
                  {new Date(transaction.date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-full ${transaction.type === 'INCOME' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                      <ArrowRightLeft className="h-4 w-4" />
                    </div>
                    <span>{transaction.description}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal text-zinc-600">
                    {transaction.categoryId?.name || 'Uncategorized'}
                  </Badge>
                </TableCell>
                <TableCell className={transaction.type === 'INCOME' ? 'text-emerald-600 font-semibold' : ''}>
                  {transaction.type === 'INCOME' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={transaction.status === 'COMPLETED' ? 'default' : 'secondary'}
                    className={transaction.status === 'COMPLETED' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
                  >
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {transaction.status !== 'COMPLETED' ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleApprove(transaction._id)}
                      disabled={isPending}
                      className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                  ) : (
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            
            {initialData.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                  <div className="flex flex-col items-center justify-center">
                    <FileText className="h-8 w-8 mb-2 text-zinc-300" />
                    <p>No transactions found.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
