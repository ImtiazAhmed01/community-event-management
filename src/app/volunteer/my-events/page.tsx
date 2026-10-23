"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEvents } from "@/context/EventContext";
import { useAuth } from "@/context/AuthContext";
import QRCodeModal from "@/components/QRCodeModal";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  QrCode, 
  XCircle, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  FolderOpen
} from "lucide-react";

export default function MyEventsPage() {
  const { registrations, events, cancelRegistration, getEventById } = useEvents();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [selectedQRReg, setSelectedQRReg] = useState<{ id: string; title: string; status: string } | null>(null);
  const [cancelModalId, setCancelModalId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const today = new Date().toISOString().split("T")[0];

  // User's registrations
  const userRegistrations = useMemo(() => {
    if (!user) return [];
    return registrations.filter((r) => r.userId === user.id);
  }, [registrations, user]);

  const upcomingList = useMemo(() => {
    return userRegistrations.filter((r) => {
      const evt = getEventById(r.eventId);
      return evt && evt.eventDate >= today;
    });
  }, [userRegistrations, today, getEventById]);

  const pastList = useMemo(() => {
    return userRegistrations.filter((r) => {
      const evt = getEventById(r.eventId);
      return evt && evt.eventDate < today;
    });
  }, [userRegistrations, today, getEventById]);

  const currentList = activeTab === "upcoming" ? upcomingList : pastList;

  const handleConfirmCancel = () => {
    if (!cancelModalId) return;
    const res = cancelRegistration(cancelModalId);
    setCancelModalId(null);
    if (res.success) {
      setFeedbackMsg(res.message);
      setTimeout(() => setFeedbackMsg(""), 3000);
    }
  };

  return (
    <ProtectedRoute allowedRole="volunteer">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
              My Registered Events
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              View your registration statuses, download QR check-in passes, or manage cancellations.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`py-1.5 px-4 rounded-xl text-xs font-bold transition-all ${
                activeTab === "upcoming"
                  ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              Upcoming ({upcomingList.length})
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`py-1.5 px-4 rounded-xl text-xs font-bold transition-all ${
                activeTab === "past"
                  ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              Past ({pastList.length})
            </button>
          </div>
        </div>

        {feedbackMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {feedbackMsg}
          </div>
        )}

        {/* List of registrations */}
        {currentList.length > 0 ? (
          <div className="space-y-4">
            {currentList.map((reg) => {
              const evt = getEventById(reg.eventId);
              if (!evt) return null;

              const isCancelled = reg.status === "Cancelled";

              return (
                <div
                  key={reg.id}
                  className={`p-6 rounded-3xl bg-white dark:bg-zinc-800/90 border transition-all ${
                    isCancelled
                      ? "border-zinc-200 dark:border-zinc-800 opacity-60"
                      : "border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    {/* Event & Registration Metadata */}
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                          {evt.category}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            reg.status === "Confirmed"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : reg.status === "Attended"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
                              : reg.status === "Cancelled"
                              ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                          }`}
                        >
                          Status: {reg.status}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                        <Link href={`/events/${evt.id}`} className="hover:text-emerald-600 transition-colors">
                          {evt.title}
                        </Link>
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                        <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(evt.eventDate).toLocaleDateString()} at {evt.eventTime || "09:00"}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 truncate max-w-xs">
                          <MapPin className="w-3.5 h-3.5" />
                          {evt.location}
                        </span>
                        <span>•</span>
                        <span>
                          Role: <strong className="text-zinc-800 dark:text-zinc-200">{reg.selectedSkill}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      {!isCancelled && (
                        <button
                          onClick={() => setSelectedQRReg({ id: reg.id, title: evt.title, status: reg.status })}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          QR Ticket Pass
                        </button>
                      )}

                      <Link
                        href={`/events/${evt.id}`}
                        className="px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-semibold hover:bg-zinc-200 transition-colors"
                      >
                        Details
                      </Link>

                      {!isCancelled && activeTab === "upcoming" && (
                        <button
                          onClick={() => setCancelModalId(reg.id)}
                          className="px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 text-xs font-semibold hover:bg-rose-100 transition-colors"
                        >
                          Cancel Registration
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
            <FolderOpen className="w-10 h-10 mx-auto text-zinc-400 mb-2" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              No {activeTab} registered events
            </h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1 mb-4">
              Explore available community initiatives and join an event to make an impact.
            </p>
            <Link
              href="/events"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all shadow-sm"
            >
              Browse Open Events
            </Link>
          </div>
        )}

        {/* QR Pass Modal */}
        {selectedQRReg && (
          <QRCodeModal
            isOpen={Boolean(selectedQRReg)}
            onClose={() => setSelectedQRReg(null)}
            eventTitle={selectedQRReg.title}
            volunteerName={user?.name || "Alex Morgan"}
            registrationId={selectedQRReg.id}
            status={selectedQRReg.status}
          />
        )}

        {/* Cancellation Confirmation Dialog */}
        {cancelModalId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-800 p-6 shadow-xl border border-zinc-200 dark:border-zinc-700 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Cancel Volunteer Registration?
              </h3>
              <p className="text-xs text-zinc-500">
                Cancelling will release your reserved slot back to the community so another volunteer can attend.
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setCancelModalId(null)}
                  className="flex-1 py-2 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-700 text-xs font-semibold"
                >
                  Keep Registration
                </button>
                <button
                  onClick={handleConfirmCancel}
                  className="flex-1 py-2 px-3 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </ProtectedRoute>
  );
}
