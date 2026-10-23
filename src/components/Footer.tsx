"use client";

import React from "react";
import Link from "next/link";
import { Users, Heart, Globe, Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Users className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-zinc-900 dark:text-zinc-50">
                UnityServe Platform
              </span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-sm leading-relaxed">
              Designed for grassroots community leaders and active citizens. Simplify event planning, volunteer requirement matching, and real-time civic participation.
            </p>
            <div className="flex items-center gap-4 text-xs text-zinc-500 pt-2">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <Shield className="w-3.5 h-3.5" /> Role Protected System
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                Built with Next.js App Router & Tailwind
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/events" className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Browse All Events
                </Link>
              </li>
              <li>
                <Link href="/volunteer/my-events" className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Volunteer Registrations
                </Link>
              </li>
              <li>
                <Link href="/organizer/dashboard" className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Organizer Dashboard
                </Link>
              </li>
              <li>
                <Link href="/organizer/analytics" className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Metrics & Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Community guidelines & tech */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                Community First Design
              </li>
              <li>AI Event Description Assistant</li>
              <li>QR Code Attendance Passes</li>
              <li>Dual Persona Sandbox Testing</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-3">
          <p>© 2026 UnityServe. Technical Instructor Evaluation Edition.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-zinc-700 dark:hover:text-zinc-300">Google OAuth & Custom Auth Ready</span>
            <span className="hover:text-zinc-700 dark:hover:text-zinc-300">Open Source</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
