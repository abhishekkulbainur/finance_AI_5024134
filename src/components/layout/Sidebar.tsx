"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ReceiptText,
  FileSpreadsheet,
  Settings,
  BrainCircuit,
  Wallet
} from "lucide-react";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Transactions",
    icon: FileSpreadsheet,
    href: "/transactions",
  },
  {
    label: "Invoices",
    icon: ReceiptText,
    href: "/invoices",
  },
  {
    label: "Accounting",
    icon: Wallet,
    href: "/accounting",
  },
  {
    label: "AI Insights",
    icon: BrainCircuit,
    href: "/ai-insights",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-white border-r border-zinc-200 text-zinc-900">
      <div className="px-4 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-2 mb-10 mt-2">
          <div className="w-6 h-6 mr-3 text-zinc-900">
            <BrainCircuit className="w-6 h-6" strokeWidth={2.5} />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
            FinAI
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => {
            const isActive = pathname === route.href;
            return (
              <Link
                href={route.href}
                key={route.href}
                className={cn(
                  "text-sm group flex p-2.5 w-full justify-start font-medium cursor-pointer rounded-md transition-colors",
                  isActive 
                    ? "text-zinc-900 bg-zinc-100" 
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50",
                )}
              >
                <div className="flex items-center flex-1">
                  <route.icon className={cn("h-4 w-4 mr-3", isActive ? "text-zinc-900" : "text-zinc-400 group-hover:text-zinc-600")} strokeWidth={isActive ? 2.5 : 2} />
                  {route.label}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      
      <div className="px-6 py-4 mt-auto">
        <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4">
          <p className="text-xs font-medium text-zinc-900 mb-1">Financial Health</p>
          <p className="text-xs text-zinc-500 mb-3">All systems operational</p>
          <div className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
            <span className="text-xs text-zinc-600">Secure connection</span>
          </div>
        </div>
      </div>
    </div>
  );
};
