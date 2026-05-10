"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import {
  BookOpen,
  Search,
  Plus,
  LayoutDashboard,
  Shield,
  Trophy,
  Menu,
  X,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const user = session?.user as any;

  const navLinks = [
    { href: "/resources", label: "Explore", icon: Search },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-600/20 group-hover:shadow-primary-500/30 transition-shadow">
              <BookOpen size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Edu<span className="gradient-text">Share</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive(link.href)
                    ? "text-primary-400 bg-primary-500/10"
                    : "text-surface-400 hover:text-surface-100 hover:bg-surface-800/50"
                )}
              >
                <link.icon size={16} />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <>
                <Link href="/submit">
                  <Button size="sm" className="gap-1.5">
                    <Plus size={15} />
                    Submit
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <button className={cn(
                    "p-2 rounded-lg transition-colors cursor-pointer",
                    isActive("/dashboard") ? "text-primary-400 bg-primary-500/10" : "text-surface-400 hover:text-surface-100 hover:bg-surface-800/50"
                  )}>
                    <LayoutDashboard size={18} />
                  </button>
                </Link>
                {user?.role === "ADMIN" && (
                  <Link href="/admin">
                    <button className={cn(
                      "p-2 rounded-lg transition-colors cursor-pointer",
                      isActive("/admin") ? "text-primary-400 bg-primary-500/10" : "text-surface-400 hover:text-surface-100 hover:bg-surface-800/50"
                    )}>
                      <Shield size={18} />
                    </button>
                  </Link>
                )}

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl hover:bg-surface-800/50 transition-colors cursor-pointer"
                  >
                    <Avatar src={user?.image} name={user?.name} size="sm" />
                    <ChevronDown size={14} className={cn("text-surface-400 transition-transform", profileOpen && "rotate-180")} />
                  </button>
                  {profileOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                      <div className="absolute right-0 mt-2 w-56 glass rounded-xl shadow-xl z-20 animate-scale-in overflow-hidden">
                        <div className="p-3 border-b border-surface-800">
                          <p className="text-sm font-medium text-surface-100 truncate">{user?.name}</p>
                          <p className="text-xs text-surface-500 truncate">{user?.email}</p>
                        </div>
                        <div className="p-1.5">
                          <Link href="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-surface-300 hover:text-surface-100 hover:bg-surface-800/50 transition-colors">
                            <LayoutDashboard size={15} />
                            Dashboard
                          </Link>
                          <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-danger-500 hover:bg-danger-500/10 transition-colors cursor-pointer"
                          >
                            <LogOut size={15} />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-800/50 transition-colors cursor-pointer"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-surface-800 animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "text-primary-400 bg-primary-500/10"
                    : "text-surface-400 hover:text-surface-100 hover:bg-surface-800/50"
                )}
              >
                <link.icon size={16} />
                {link.label}
              </Link>
            ))}
            {session ? (
              <>
                <Link href="/submit" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-surface-400 hover:text-surface-100 hover:bg-surface-800/50 transition-colors">
                  <Plus size={16} />
                  Submit Resource
                </Link>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-surface-400 hover:text-surface-100 hover:bg-surface-800/50 transition-colors">
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <button
                  onClick={() => { signOut({ callbackUrl: "/" }); setMobileOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-danger-500 hover:bg-danger-500/10 transition-colors cursor-pointer"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link href="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button variant="secondary" size="sm" className="w-full">Sign In</Button>
                </Link>
                <Link href="/register" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button size="sm" className="w-full">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
