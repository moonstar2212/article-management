"use client";

import Link from "next/link";
import { useAuth } from "@/context";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";

export function AdminHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/admin/articles" className="logo-text text-xl">
            Article Management
          </Link>
        </div>
        <nav className="flex items-center gap-6">
          <Link 
            href="/admin/articles" 
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Articles
          </Link>
          <Link 
            href="/admin/categories" 
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Categories
          </Link>
          <div className="flex items-center gap-4 pl-4 border-l">
            <div className="flex items-center gap-2 text-sm font-medium">
              <User size={16} className="text-primary" />
              <span>{user?.name}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={logout} title="Logout">
              <LogOut size={18} className="text-muted-foreground hover:text-destructive" />
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
