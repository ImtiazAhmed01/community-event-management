"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEvents } from "@/context/EventContext";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend,
  CartesianGrid
} from "recharts";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  CheckCircle2, 
  ArrowLeft 
} from "lucide-react";

const COLORS = ["#10b981", "#06b6d4", "#6366f1", "#f59e0b", "#ec4899", "#8b5cf6"];

export default function OrganizerAnalyticsPage() {
  const { events, registrations, getAvailableSlots } = useEvents();

  // 1. Events by Category
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    events.forEach((evt) => {
      counts[evt.category] = (counts[evt.category] || 0) + 1;
    });

    return Object.entries(counts).map(([name, count]) => ({
      name,
      count
    }));
  }, [events]);

  // 2. Volunteer Registrations Across Events
  const eventRegistrationsData = useMemo(() => {
    return events.slice(0, 6).map((evt) => {
      const slots = getAvailableSlots(evt);
      const registered = evt.maxCapacity - slots;
      return {
        name: evt.title.length > 18 ? evt.title.substring(0, 18) + "..." : evt.title,
        registered,
        capacity: evt.maxCapacity
      };
    });
  }, [events, getAvailableSlots]);

  // 3. Volunteer Status Breakdown (Confirmed, Registered, Attended, Cancelled)
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {
      Registered: 0,
      Confirmed: 0,
      Attended: 0,
      Cancelled: 0
    };
    registrations.forEach((r) => {
      if (counts[r.status] !== undefined) {
        counts[r.status]++;
      }
    });

    return [
      { name: "Confirmed", value: counts.Confirmed, color: "#10b981" },
      { name: "Registered", value: counts.Registered, color: "#3b82f6" },
      { name: "Attended", value: counts.Attended, color: "#8b5cf6" },
      { name: "Cancelled", value: counts.Cancelled, color: "#ef4444" }
    ].filter((item) => item.value > 0);
  }, [registrations]);

  // 4. Overall Capacity Utilization Rate
  const totalCapacity = events.reduce((acc, evt) => acc + evt.maxCapacity, 0);
  const totalOccupied = registrations.filter((r) => r.status !== "Cancelled").length;
  const overallUtilization = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

  return (
    <ProtectedRoute allowedRole="organizer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              href="/organizer/dashboard"
              className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-emerald-600 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Organizer Hub
            </Link>
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
              Organizer Analytics & Visualizations
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Data visualizations depicting category distribution, registration capacities, and volunteer status ratios.
            </p>
          </div>
        </div>

        {/* Top Mini Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
              Overall Capacity Utilization
            </span>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {overallUtilization}%
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">
              {totalOccupied} of {totalCapacity} slots filled across events
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
              Total Managed Events
            </span>
            <div className="text-3xl font-black text-zinc-900 dark:text-zinc-100 mt-1">
              {events.length}
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">Across 6 civic categories</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
              Active Volunteer Base
            </span>
            <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
              {registrations.length}
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">Total recorded registration records</p>
          </div>
        </div>

        {/* Analytics Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Chart 1: Volunteer Registration vs Capacity by Event */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                Volunteer Registrations Across Events
              </h3>
              <p className="text-xs text-zinc-500">
                Comparison of registered volunteers against total event capacity.
              </p>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={eventRegistrationsData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(24, 24, 27, 0.9)",
                      borderRadius: "12px",
                      border: "none",
                      color: "#fff",
                      fontSize: "12px"
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                  <Bar dataKey="registered" fill="#10b981" name="Registered" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="capacity" fill="#d1d5db" name="Capacity" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Events by Category */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-600" />
                Events by Category
              </h3>
              <p className="text-xs text-zinc-500">
                Number of initiatives scheduled per civic category.
              </p>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(24, 24, 27, 0.9)",
                      borderRadius: "12px",
                      border: "none",
                      color: "#fff",
                      fontSize: "12px"
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Volunteer Status Breakdown */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700 shadow-sm space-y-4 lg:col-span-2">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                Participation Status Distribution
              </h3>
              <p className="text-xs text-zinc-500">
                Proportion of confirmed, registered, attended, and cancelled volunteer commitments.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {statusData.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">{item.name}</span>
                  </div>
                  <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">
                    {item.value}
                  </div>
                  <span className="text-[10px] text-zinc-400">
                    {Math.round((item.value / registrations.length) * 100)}% of registrations
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </ProtectedRoute>
  );
}
