"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEvents } from "@/context/EventContext";
import { ParticipationStatus } from "@/types";
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  XCircle, 
  ArrowLeft,
  Mail,
  Calendar,
  Sparkles
} from "lucide-react";

const STATUSES: ParticipationStatus[] = ["Registered", "Confirmed", "Attended", "Cancelled"];

export default function EventVolunteersPage() {
  const searchParams = useSearchParams();
  const initialEventId = searchParams.get("eventId") || "all";

  const { events, registrations, updateVolunteerStatus, getEventById } = useEvents();

  const [selectedEventId, setSelectedEventId] = useState<string>(initialEventId);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVolunteers = useMemo(() => {
    return registrations.filter((reg) => {
      // Event filter
      if (selectedEventId !== "all" && reg.eventId !== selectedEventId) {
        return false;
      }

      // Status filter
      if (statusFilter !== "all" && reg.status !== statusFilter) {
        return false;
      }

      // Text search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = reg.userName.toLowerCase().includes(query);
        const matchesEmail = reg.userEmail.toLowerCase().includes(query);
        const matchesSkill = reg.selectedSkill.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesSkill) return false;
      }

      return true;
    });
  }, [registrations, selectedEventId, statusFilter, searchQuery]);

  const handleStatusChange = (registrationId: string, newStatus: ParticipationStatus) => {
    updateVolunteerStatus(registrationId, newStatus);
  };

  const getStatusBadge = (status: ParticipationStatus) => {
    switch (status) {
      case "Registered":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300";
      case "Confirmed":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300";
      case "Attended":
        return "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300";
      case "Cancelled":
        return "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300";
      default:
        return "bg-zinc-100 text-zinc-800";
    }
  };

  return (
    <ProtectedRoute allowedRole="organizer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              href="/organizer/dashboard"
              className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-emerald-600 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
              Event Volunteer Management
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Review volunteer signups, selected skills, and update participation statuses (Registered, Confirmed, Attended, Cancelled).
            </p>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-3">
          
          {/* Select Event */}
          <div>
            <label className="block text-xs font-bold text-zinc-500 mb-1">Filter by Event</label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full py-2 px-3 rounded-xl text-xs border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900"
            >
              <option value="all">All Events ({events.length})</option>
              {events.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.title}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-xs font-bold text-zinc-500 mb-1">Filter by Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 rounded-xl text-xs border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900"
            >
              <option value="all">All Statuses</option>
              {STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Volunteer Search */}
          <div>
            <label className="block text-xs font-bold text-zinc-500 mb-1">Search Volunteer</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Name, email, or skill..."
                className="w-full pl-8 pr-3 py-2 rounded-xl text-xs border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900"
              />
            </div>
          </div>
        </div>

        {/* Volunteer List Table */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-zinc-500">
              Total Volunteers Found: <strong className="text-zinc-900 dark:text-zinc-100">{filteredVolunteers.length}</strong>
            </span>
          </div>

          {filteredVolunteers.length > 0 ? (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-700 text-zinc-400 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Volunteer Name & Email</th>
                  <th className="pb-3 font-semibold">Event</th>
                  <th className="pb-3 font-semibold">Selected Skill</th>
                  <th className="pb-3 font-semibold">Registered On</th>
                  <th className="pb-3 font-semibold">Participation Status</th>
                  <th className="pb-3 font-semibold text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700/60">
                {filteredVolunteers.map((vol) => {
                  const evt = getEventById(vol.eventId);

                  return (
                    <tr key={vol.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-700/30">
                      <td className="py-4 pr-4">
                        <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm block">
                          {vol.userName}
                        </span>
                        <span className="text-zinc-400 text-[11px] flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3" />
                          {vol.userEmail}
                        </span>
                        {vol.notes && (
                          <span className="text-[10px] text-zinc-500 italic block mt-1">
                            &ldquo;{vol.notes}&rdquo;
                          </span>
                        )}
                      </td>
                      <td className="py-4 pr-4">
                        <Link href={`/events/${vol.eventId}`} className="font-medium text-emerald-600 hover:underline">
                          {evt?.title || "Community Event"}
                        </Link>
                      </td>
                      <td className="py-4 pr-4">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-600">
                          {vol.selectedSkill}
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-zinc-500 whitespace-nowrap">
                        {vol.registrationDate}
                      </td>
                      <td className="py-4 pr-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusBadge(vol.status)}`}>
                          {vol.status}
                        </span>
                      </td>
                      <td className="py-4 text-right whitespace-nowrap">
                        <select
                          value={vol.status}
                          onChange={(e) => handleStatusChange(vol.id, e.target.value as ParticipationStatus)}
                          className="py-1 px-2 rounded-lg text-xs font-semibold border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          {STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <Users className="w-8 h-8 mx-auto text-zinc-400 mb-2" />
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">No volunteers found</p>
              <p className="text-xs text-zinc-500 mt-1">Try clearing your filters or select a different event.</p>
            </div>
          )}
        </div>

      </div>
    </ProtectedRoute>
  );
}
