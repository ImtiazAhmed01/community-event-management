"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { 
  Calendar, 
  Users, 
  PlusCircle, 
  LayoutDashboard, 
  LogOut, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Heart, 
  BarChart3
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path || (path !== "/" && pathname.startsWith(path));

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-zinc-900/90 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-1.5">
                  UnityServe
                  <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Community
                  </span>
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Events & Volunteers</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/events"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/events") && !pathname.includes("dashboard")
                    ? "bg-zinc-100 dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                }`}
              >
                Discover Events
              </Link>

              {user?.role === "organizer" && (
                <>
                  <Link
                    href="/organizer/dashboard"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      isActive("/organizer/dashboard")
                        ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold"
                        : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Organizer Hub
                  </Link>
                  <Link
                    href="/organizer/create"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      isActive("/organizer/create")
                        ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold"
                        : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    }`}
                  >
                    <PlusCircle className="w-4 h-4" />
                    Create Event
                  </Link>
                  <Link
                    href="/organizer/analytics"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      isActive("/organizer/analytics")
                        ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold"
                        : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    Analytics
                  </Link>
                </>
              )}

              {user?.role === "volunteer" && (
                <>
                  <Link
                    href="/volunteer/dashboard"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      isActive("/volunteer/dashboard")
                        ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold"
                        : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Volunteer Hub
                  </Link>
                  <Link
                    href="/volunteer/my-events"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      isActive("/volunteer/my-events")
                        ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold"
                        : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    My Events
                  </Link>
                  <Link
                    href="/volunteer/favorites"
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      isActive("/volunteer/favorites")
                        ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold"
                        : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    }`}
                  >
                    <Heart className="w-4 h-4 text-rose-500" />
                    Saved
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Right Action Tools: Dark mode & Auth */}
          <div className="flex items-center gap-3">
            
            {/* Dark Mode Switcher */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Dark Mode"
              className="p-2 rounded-lg text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {theme === "dark" ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Auth Buttons / User Profile */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs overflow-hidden">
                    {user.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0)
                    )}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 leading-tight">
                      {user.name.split(" ")[0]}
                    </p>
                    <p className="text-[10px] text-zinc-400 capitalize">{user.role}</p>
                  </div>
                </Link>
                <button
                  onClick={logout}
                  title="Sign out"
                  className="p-2 rounded-lg text-zinc-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/30 transition-all hover:shadow"
                >
                  Join Us
                </Link>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 pt-2 pb-4 space-y-2">
          <Link
            href="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Discover Events
          </Link>

          {user?.role === "organizer" && (
            <>
              <Link
                href="/organizer/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Organizer Dashboard
              </Link>
              <Link
                href="/organizer/create"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Create Event
              </Link>
              <Link
                href="/organizer/analytics"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Analytics
              </Link>
            </>
          )}

          {user?.role === "volunteer" && (
            <>
              <Link
                href="/volunteer/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Volunteer Hub
              </Link>
              <Link
                href="/volunteer/my-events"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                My Events & Badges
              </Link>
              <Link
                href="/volunteer/favorites"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Saved Events
              </Link>
            </>
          )}

          {user && (
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              My Profile
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
