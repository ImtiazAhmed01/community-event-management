"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEvents } from "@/context/EventContext";
import { useAuth } from "@/context/AuthContext";
import { 
  Calendar, 
  Users, 
  CheckCircle, 
  Clock, 
  PlusCircle, 
  ArrowRight, 
  BarChart3, 
  AlertTriangle,
  FolderOpen
} from "lucide-react";

export default function OrganizerDashboardPage() {
  const { events, registrations, getAvailableSlots } = useEvents();
  const { user } = useAuth();

  const today = new Date().toISOString().split("T")[0];

  // Organizer metrics
  const metrics = useMemo(() => {
    const totalEvents = events.length;
    const upcomingEvents = events.filter((e) => e.eventDate >= today && e.status !== "closed");
    const completedEvents = events.filter((e) => e.eventDate < today || e.status === "closed");
    
    // Total volunteers registered across all events
    const totalVolunteers = registrations.filter((r) => r.status !== "Cancelled").length;

    // Total available slots remaining across upcoming events
    const availableSlots = upcomingEvents.reduce((acc, evt) => {
      return acc + getAvailableSlots(evt);
    }, 0);

    return {
      totalEvents,
      upcomingCount: upcomingEvents.length,
      completedCount: completedEvents.length,
      totalVolunteers,
      availableSlots,
      upcomingEvents
    };
  }, [events, registrations, today, getAvailableSlots]);

  return (
    <ProtectedRoute allowedRole="organizer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Management Portal
            </span>
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
              Organizer Dashboard
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Welcome back, <strong>{user?.name}</strong>. Monitor volunteer capacity and manage upcoming community initiatives.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/organizer/analytics"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-bold hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors shadow-sm"
            >
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              View Analytics
            </Link>
            <Link
              href="/organizer/create"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4" />
              Publish New Event
            </Link>
          </div>
        </div>

        {/* 5 Core Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Events</span>
              <Calendar className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-3xl font-black text-zinc-900 dark:text-zinc-50">
              {metrics.totalEvents}
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">Published or active</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Upcoming Events</span>
              <Clock className="w-4 h-4 text-teal-500" />
            </div>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {metrics.upcomingCount}
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">Ready for volunteers</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Volunteers</span>
              <Users className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
              {metrics.totalVolunteers}
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">Active registrations</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Available Slots</span>
              <CheckCircle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-3xl font-black text-amber-600 dark:text-amber-400">
              {metrics.availableSlots}
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">Open volunteer spots</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Completed Events</span>
              <CheckCircle className="w-4 h-4 text-zinc-500" />
            </div>
            <div className="text-3xl font-black text-zinc-700 dark:text-zinc-300">
              {metrics.completedCount}
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">Archived or finished</p>
          </div>
        </div>

        {/* Upcoming Events with Live Volunteer Capacity Table */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                Upcoming Events & Real-Time Capacity
              </h2>
              <p className="text-xs text-zinc-500">
                Track volunteer signups, inspect rosters, and modify event details.
              </p>
            </div>
            <Link
              href="/organizer/events"
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              Manage all events roster
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {metrics.upcomingEvents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-700 text-zinc-400 uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Event Name & Category</th>
                    <th className="pb-3 font-semibold">Date & Time</th>
                    <th className="pb-3 font-semibold">Location</th>
                    <th className="pb-3 font-semibold">Capacity & Slots</th>
                    <th className="pb-3 font-semibold text-right">Roster & Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700/60">
                  {metrics.upcomingEvents.map((evt) => {
                    const slots = getAvailableSlots(evt);
                    const registeredCount = evt.maxCapacity - slots;
                    const percentFilled = Math.round((registeredCount / evt.maxCapacity) * 100);

                    return (
                      <tr key={evt.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-700/30 transition-colors">
                        <td className="py-4 pr-4">
                          <Link href={`/events/${evt.id}`} className="font-bold text-zinc-900 dark:text-zinc-100 hover:text-emerald-600">
                            {evt.title}
                          </Link>
                          <span className="block text-[11px] text-zinc-500 mt-0.5">{evt.category}</span>
                        </td>
                        <td className="py-4 pr-4 whitespace-nowrap">
                          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                            {new Date(evt.eventDate).toLocaleDateString()}
                          </span>
                          <span className="block text-zinc-400 text-[11px]">{evt.eventTime || "09:00"}</span>
                        </td>
                        <td className="py-4 pr-4 text-zinc-600 dark:text-zinc-300 max-w-[180px] truncate">
                          {evt.location}
                        </td>
                        <td className="py-4 pr-4 min-w-[160px]">
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="font-bold text-zinc-800 dark:text-zinc-200">
                              {registeredCount} / {evt.maxCapacity} filled
                            </span>
                            <span className={slots <= 0 ? "text-rose-500 font-bold" : "text-emerald-600 font-semibold"}>
                              {slots <= 0 ? "Full" : `${slots} left`}
                            </span>
                          </div>
                          <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${slots <= 0 ? "bg-rose-500" : "bg-emerald-500"}`}
                              style={{ width: `${Math.min(100, percentFilled)}%` }}
                            />
                          </div>
                        </td>
                        <td className="py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/organizer/volunteers?eventId=${evt.id}`}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs hover:bg-emerald-100 transition-colors"
                            >
                              Volunteers
                            </Link>
                            <Link
                              href={`/organizer/edit/${evt.id}`}
                              className="px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-xs hover:bg-zinc-200 transition-colors"
                            >
                              Edit
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-700">
              <FolderOpen className="w-8 h-8 mx-auto text-zinc-400 mb-2" />
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">No upcoming events scheduled</p>
              <p className="text-xs text-zinc-500 mt-1 mb-4">Publish your first community event to begin tracking volunteers.</p>
              <Link
                href="/organizer/create"
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
              >
                Create Event Now
              </Link>
            </div>
          )}
        </div>

      </div>
    </ProtectedRoute>
  );
}
