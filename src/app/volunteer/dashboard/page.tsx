"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEvents } from "@/context/EventContext";
import { useAuth } from "@/context/AuthContext";
import EventCard from "@/components/EventCard";
import { 
  Calendar, 
  CheckCircle, 
  Heart, 
  Award, 
  Clock, 
  ArrowRight, 
  Sparkles,
  Compass
} from "lucide-react";

export default function VolunteerDashboardPage() {
  const { events, registrations, favorites, getEventById } = useEvents();
  const { user } = useAuth();

  const today = new Date().toISOString().split("T")[0];

  // Volunteer metrics
  const myRegistrations = useMemo(() => {
    if (!user) return [];
    return registrations.filter((r) => r.userId === user.id);
  }, [registrations, user]);

  const activeRegistrations = myRegistrations.filter((r) => r.status !== "Cancelled");
  
  const upcomingRegistered = activeRegistrations.filter((r) => {
    const evt = getEventById(r.eventId);
    return evt && evt.eventDate >= today;
  });

  const attendedCount = myRegistrations.filter((r) => r.status === "Attended").length;

  const savedCount = favorites.length;

  // Recommended events based on user skills/interests
  const recommendedEvents = useMemo(() => {
    const registeredIds = new Set(myRegistrations.map((r) => r.eventId));
    return events
      .filter((e) => !registeredIds.has(e.id) && e.eventDate >= today && e.status !== "closed")
      .slice(0, 3);
  }, [events, myRegistrations, today]);

  return (
    <ProtectedRoute allowedRole="volunteer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
              Volunteer Community Portal
            </span>
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
              Hello, {user?.name.split(" ")[0]}!
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Thank you for contributing your time and skills. Here is a summary of your volunteer journey.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/volunteer/my-events"
              className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-bold hover:bg-zinc-50 transition-colors shadow-sm"
            >
              My Registered Events
            </Link>
            <Link
              href="/events"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
            >
              <Compass className="w-4 h-4" />
              Discover Events
            </Link>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Upcoming Events</span>
              <Calendar className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {upcomingRegistered.length}
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">Confirmed or registered</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Completed / Attended</span>
              <Award className="w-4 h-4 text-teal-500" />
            </div>
            <div className="text-3xl font-black text-teal-600 dark:text-teal-400">
              {attendedCount}
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">Civic milestones achieved</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Saved Favorites</span>
              <Heart className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-3xl font-black text-rose-500">
              {savedCount}
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">Bookmarked opportunities</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Volunteer Level</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {attendedCount >= 3 ? "Community Champion" : "Active Neighbor"}
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">Based on participation</p>
          </div>
        </div>

        {/* Next Approaching Event Banner (Reminder) */}
        {upcomingRegistered.length > 0 && (() => {
          const nextReg = upcomingRegistered[0];
          const nextEvt = getEventById(nextReg.eventId);
          if (!nextEvt) return null;

          return (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600/10 via-teal-600/10 to-transparent border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wide">
                  <Clock className="w-3 h-3" /> Approaching Event Reminder
                </span>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {nextEvt.title}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Date: <strong>{new Date(nextEvt.eventDate).toLocaleDateString()}</strong> at <strong>{nextEvt.eventTime || "09:00"}</strong> • Location: <strong>{nextEvt.location}</strong>
                </p>
              </div>

              <Link
                href={`/events/${nextEvt.id}`}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 shrink-0"
              >
                View Digital Pass & Details
              </Link>
            </div>
          );
        })()}

        {/* Recommended Opportunities */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Recommended for You
            </h2>
            <Link
              href="/events"
              className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
            >
              View all events <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendedEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        </div>

      </div>
    </ProtectedRoute>
  );
}
