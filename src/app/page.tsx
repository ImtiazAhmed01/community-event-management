"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useEvents } from "@/context/EventContext";
import { useAuth } from "@/context/AuthContext";
import EventCard from "@/components/EventCard";
import { 
  Sparkles, 
  Users, 
  Calendar, 
  CheckCircle, 
  Shield, 
  ArrowRight, 
  Layers, 
  TrendingUp,
  Heart,
  QrCode,
  Zap
} from "lucide-react";

export default function HomePage() {
  const { events, registrations } = useEvents();
  const { user, quickLoginAs } = useAuth();

  const publishedEvents = events.filter((e) => e.status !== "closed");
  const upcomingEvents = publishedEvents.slice(0, 3);

  // Quick platform statistics
  const totalVolunteersJoined = registrations.length + 42; // Include simulated community impact
  const totalEventsOrganized = events.length;

  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16 lg:pb-24 bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.emerald.100),white)] dark:bg-[radial-gradient(45rem_50rem_at_top,theme(colors.emerald.950),theme(colors.zinc.950))] opacity-60" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold shadow-sm mb-6 animate-in fade-in slide-in-from-bottom-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Smart Community Engagement & Volunteer Matching</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight max-w-4xl mx-auto mb-6">
            Empower Local Causes. <br />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 bg-clip-text text-transparent">
              Mobilize Passionate Volunteers.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Whether you are coordinating an environmental drive or looking to mentor the next generation, UnityServe bridges community leaders and civic volunteers seamlessly.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-14">
            <Link
              href="/events"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              Browse Open Opportunities
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/organizer/create"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-100 font-semibold text-base border border-zinc-200 dark:border-zinc-700 shadow-sm transition-all"
            >
              Post an Event as Organizer
            </Link>
          </div>

        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-white dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700 shadow-lg">
          <div className="text-center p-3">
            <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {totalEventsOrganized}+
            </div>
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-1">
              Active Events Hosted
            </div>
          </div>
          <div className="text-center p-3">
            <div className="text-3xl font-extrabold text-teal-600 dark:text-teal-400">
              {totalVolunteersJoined}+
            </div>
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-1">
              Volunteer Registrations
            </div>
          </div>
          <div className="text-center p-3">
            <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
              100%
            </div>
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-1">
              Verified Capacity Tracking
            </div>
          </div>
          <div className="text-center p-3">
            <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
              AI-Powered
            </div>
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-1">
              Smart Description Assistant
            </div>
          </div>
        </div>
      </section>

      {/* Featured Upcoming Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs tracking-wider uppercase mb-1">
              <Calendar className="w-4 h-4" />
              Community Happenings
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              Upcoming Volunteer Opportunities
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Select an event to explore required roles, location logistics, and register in seconds.
            </p>
          </div>
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700"
          >
            Explore all {events.length} events
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* Why UnityServe Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Built For Real Organizations
          </span>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mt-1">
            Engineered For Seamless Coordination
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
            Every feature is structured around realistic organizer and volunteer workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              AI Event Description Assistant
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Enter a simple prompt like &ldquo;Tree plantation&rdquo; or &ldquo;STEM mentoring&rdquo; and let our assistant draft comprehensive descriptions, volunteer roles, and promotional messages.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              Strict Capacity & Role Protection
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Real-time slot countdown prevents overbooking. Volunteers cannot tamper with event settings, and organizers cannot self-register as volunteers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              Digital QR Check-In Passes
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Upon registering, volunteers receive instant digital QR passes that organizers can scan on-site for automated verification and status updates.
            </p>
          </div>
        </div>
      </section>

      {/* Ready To Make a Difference Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Ready to bring your community together?
            </h2>
            <p className="text-emerald-100 text-base sm:text-lg mb-8 leading-relaxed">
              Create your organization&apos;s next event in minutes, match with local volunteers, and track participation metrics with clear charts.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/register"
                className="px-6 py-3 rounded-xl bg-white text-emerald-800 font-bold hover:bg-emerald-50 transition-colors shadow-md"
              >
                Create Free Account
              </Link>
              <Link
                href="/events"
                className="px-6 py-3 rounded-xl bg-emerald-800/60 hover:bg-emerald-800 text-white font-medium border border-emerald-400/40 transition-colors"
              >
                Browse Public Schedule
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
