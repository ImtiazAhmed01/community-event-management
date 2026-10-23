"use client";

import React, { useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEvents } from "@/context/EventContext";
import { 
  Calendar, 
  Trash2, 
  Edit3, 
  Users, 
  PlusCircle, 
  Eye, 
  Lock, 
  Unlock,
  AlertTriangle
} from "lucide-react";

export default function ManageEventsPage() {
  const { events, deleteEvent, closeRegistration, publishEvent, getAvailableSlots, getEventRegistrations } = useEvents();
  const [deleteModalEventId, setDeleteModalEventId] = useState<string | null>(null);

  const handleDeleteConfirm = () => {
    if (deleteModalEventId) {
      deleteEvent(deleteModalEventId);
      setDeleteModalEventId(null);
    }
  };

  return (
    <ProtectedRoute allowedRole="organizer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
              Manage Organization Events
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Publish, edit, close registrations, or delete hosted community events.
            </p>
          </div>
          <Link
            href="/organizer/create"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
          >
            <PlusCircle className="w-4 h-4" />
            New Event
          </Link>
        </div>

        {/* Events Table */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700 text-zinc-400 uppercase tracking-wider">
                <th className="pb-3 font-semibold">Event</th>
                <th className="pb-3 font-semibold">Date & Deadline</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Capacity</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700/60">
              {events.map((evt) => {
                const slots = getAvailableSlots(evt);
                const regCount = evt.maxCapacity - slots;

                return (
                  <tr key={evt.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-700/30">
                    <td className="py-4 pr-4">
                      <Link href={`/events/${evt.id}`} className="font-bold text-zinc-900 dark:text-zinc-100 hover:text-emerald-600">
                        {evt.title}
                      </Link>
                      <span className="block text-zinc-400 text-[11px] mt-0.5">{evt.category} • {evt.location}</span>
                    </td>
                    <td className="py-4 pr-4 whitespace-nowrap">
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                        {new Date(evt.eventDate).toLocaleDateString()}
                      </span>
                      <span className="block text-[11px] text-zinc-400">
                        Closes: {evt.registrationDeadline}
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      {evt.status === "published" ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          Published
                        </span>
                      ) : evt.status === "closed" ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          Closed
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-800">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="py-4 pr-4">
                      <span className="font-semibold">{regCount} / {evt.maxCapacity}</span>
                      <span className="text-[11px] text-zinc-400 block">{slots} slots open</span>
                    </td>
                    <td className="py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/organizer/volunteers?eventId=${evt.id}`}
                          title="View Volunteer Roster"
                          className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-emerald-600"
                        >
                          <Users className="w-3.5 h-3.5" />
                        </Link>
                        
                        {evt.status === "published" ? (
                          <button
                            onClick={() => closeRegistration(evt.id)}
                            title="Close Registration"
                            className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-amber-600"
                          >
                            <Lock className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => publishEvent(evt.id)}
                            title="Re-open Registration"
                            className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-emerald-600"
                          >
                            <Unlock className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <Link
                          href={`/organizer/edit/${evt.id}`}
                          title="Edit Event"
                          className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-indigo-600"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() => setDeleteModalEventId(evt.id)}
                          title="Delete Event"
                          className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-rose-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteModalEventId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-800 p-6 shadow-xl border border-zinc-200 dark:border-zinc-700 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Delete Event?
              </h3>
              <p className="text-xs text-zinc-500">
                Are you sure you want to delete this event? This action will remove all related volunteer registrations permanently.
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setDeleteModalEventId(null)}
                  className="flex-1 py-2 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 py-2 px-3 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </ProtectedRoute>
  );
}
