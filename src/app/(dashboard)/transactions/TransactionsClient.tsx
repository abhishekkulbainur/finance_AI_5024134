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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, MoreHorizontal } from "lucide-react";
import { approveTransaction, deleteTransaction } from "@/actions/transaction.actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const TransactionsClient = ({ initialData }: { initialData: any[] }) => {
  const [isPending, startTransition] = useTransition();

  const handleApprove = (id: string) => {
    startTransition(async () => {
      await approveTransaction(id);
    });
  };

  return (
    <Card className="shadow-none border-zinc-200">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b-zinc-200">
              <TableHead className="font-medium text-zinc-500 text-xs uppercase tracking-wider h-10">Date</TableHead>
              <TableHead className="font-medium text-zinc-500 text-xs uppercase tracking-wider h-10">Description</TableHead>
              <TableHead className="font-medium text-zinc-500 text-xs uppercase tracking-wider h-10">Category</TableHead>
              <TableHead className="font-medium text-zinc-500 text-xs uppercase tracking-wider h-10 text-right">Amount</TableHead>
              <TableHead className="font-medium text-zinc-500 text-xs uppercase tracking-wider h-10">Status</TableHead>
              <TableHead className="font-medium text-zinc-500 text-xs uppercase tracking-wider h-10 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData.map((transaction) => (
              <TableRow key={transaction._id} className="border-b-zinc-100 group">
                <TableCell className="text-sm text-zinc-500 whitespace-nowrap">
                  {new Date(transaction.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </TableCell>
                <TableCell className="text-sm font-medium text-zinc-900">
                  {transaction.description}
                </TableCell>
                <TableCell className="text-sm text-zinc-500">
                  {transaction.categoryId?.name || 'Uncategorized'}
                </TableCell>
                <TableCell className={`text-sm font-medium text-right ${transaction.type === 'INCOME' ? 'text-zinc-900' : 'text-zinc-900'}`}>
                  {transaction.type === 'INCOME' ? '+' : '-'}₹{transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${transaction.status === 'COMPLETED' ? 'bg-zinc-400' : 'bg-amber-400'}`} />
                    <span className="text-xs font-medium text-zinc-600 capitalize">
                      {transaction.status.toLowerCase()}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {transaction.status !== 'COMPLETED' ? (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleApprove(transaction._id)}
                      disabled={isPending}
                      className="h-8 text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                    >
                      <Check className="mr-1.5 h-3.5 w-3.5" />
                      Approve
                    </Button>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-zinc-900">
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer">
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
                          onClick={() => {
                            startTransition(async () => {
                              await deleteTransaction(transaction._id);
                            });
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))}
            
            {initialData.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-zinc-500 text-sm">
                  No transactions found for this period.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
