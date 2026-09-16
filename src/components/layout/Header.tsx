"use client";

import { Bell, Search, Settings, User, CreditCard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const { data: session } = useSession();

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
    : "U";

  return (
    <header className="flex h-16 items-center gap-4 border-b border-zinc-200 bg-white px-8 justify-between">
      <div className="flex-1 max-w-md hidden md:flex items-center relative">
        <Search className="absolute left-3 w-4 h-4 text-zinc-400" />
        <Input 
          placeholder="Search transactions, invoices, or accounts..." 
          className="pl-9 bg-zinc-50 border-zinc-200 h-9 text-sm focus-visible:ring-1 focus-visible:ring-zinc-300 w-full"
        />
      </div>
      
      <div className="flex items-center gap-2 ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors relative outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-1 cursor-pointer">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
            {/* Optional: notification dot */}
            <span className="absolute top-2 right-2.5 h-1.5 w-1.5 rounded-full bg-emerald-500 border border-white" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal text-zinc-500 text-xs">Notifications</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <div className="flex flex-col items-center justify-center p-6 text-center text-sm text-zinc-500">
              <Bell className="h-8 w-8 text-zinc-200 mb-2" />
              <p>You're all caught up!</p>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button asChild variant="ghost" size="icon" className="h-9 w-9 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full">
          <Link href="/settings">
            <Settings className="h-4 w-4" />
            <span className="sr-only">Settings</span>
          </Link>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 w-8 rounded-full bg-zinc-200 ml-2 border border-zinc-300 flex shrink-0 items-center justify-center overflow-hidden hover:bg-zinc-300 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-1">
            <span className="text-xs font-semibold text-zinc-600">{initials}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-zinc-900">{session?.user?.name || "User"}</p>
                  <p className="text-xs leading-none text-zinc-500">
                    {session?.user?.email || "user@example.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4 text-zinc-500" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <CreditCard className="mr-2 h-4 w-4 text-zinc-500" />
                <span>Billing</span>
              </DropdownMenuItem>
              <Link href="/settings">
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4 text-zinc-500" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
