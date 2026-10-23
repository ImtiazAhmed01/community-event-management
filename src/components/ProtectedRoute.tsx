"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ShieldAlert, Loader2 } from "lucide-react";
import Link from "next/link";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: "organizer" | "volunteer";
}

export default function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
        <p className="text-sm text-zinc-500">Verifying authorized access...</p>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-xl text-center">
        <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Authentication Required
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
          You must be logged in to access this area.
        </p>
        <div className="flex flex-col gap-2.5">
          <Link
            href="/login"
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors shadow-sm"
          >
            Sign In with Google or Email
          </Link>
          <Link
            href="/events"
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-200 transition-colors"
          >
            Back to Public Events
          </Link>
        </div>
      </div>
    );
  }

  // Role check: Organizer trying to access volunteer-only or Volunteer trying to access organizer-only
  if (allowedRole && user.role !== allowedRole) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 rounded-2xl bg-white dark:bg-zinc-800 border border-rose-200 dark:border-rose-900 shadow-xl text-center">
        <div className="w-12 h-12 mx-auto rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          Restricted Role Access
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          This portal requires <span className="font-bold uppercase text-emerald-600">{allowedRole}</span> privileges. You are currently signed in as a <span className="font-bold uppercase text-zinc-800 dark:text-zinc-200">{user.role}</span>.
        </p>
        <p className="text-xs text-zinc-500 mb-6">
          Tip: You can use the Quick Persona switcher in the top navigation bar to test this screen as a {allowedRole}.
        </p>
        <div className="flex flex-col gap-2">
          <Link
            href={user.role === "organizer" ? "/organizer/dashboard" : "/volunteer/dashboard"}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors shadow-sm"
          >
            Go to My {user.role === "organizer" ? "Organizer" : "Volunteer"} Hub
          </Link>
          <Link
            href="/events"
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-200"
          >
            Explore Events
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
