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
    color: "text-sky-500",
  },
  {
    label: "Transactions",
    icon: FileSpreadsheet,
    href: "/transactions",
    color: "text-violet-500",
  },
  {
    label: "Invoices",
    icon: ReceiptText,
    href: "/invoices",
    color: "text-pink-700",
  },
  {
    label: "Accounting",
    icon: Wallet,
    href: "/accounting",
    color: "text-orange-700",
  },
  {
    label: "AI Insights",
    icon: BrainCircuit,
    href: "/ai-insights",
    color: "text-emerald-500",
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
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <div className="relative w-8 h-8 mr-4 text-emerald-500">
            <BrainCircuit className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold">
            FinAI
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              href={route.href}
              key={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400",
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
