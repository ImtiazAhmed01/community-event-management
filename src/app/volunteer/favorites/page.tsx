"use client";

import React from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEvents } from "@/context/EventContext";
import EventCard from "@/components/EventCard";
import { Heart, Compass } from "lucide-react";

export default function FavoritesPage() {
  const { events, favorites } = useEvents();

  const savedEvents = events.filter((e) => favorites.includes(e.id));

  return (
    <ProtectedRoute allowedRole="volunteer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-wider mb-1">
            <Heart className="w-4 h-4 fill-rose-500" /> Saved Bookmarks
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
            My Saved Events
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Keep track of initiatives you are interested in and register when ready.
          </p>
        </div>

        {savedEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
            <Heart className="w-10 h-10 mx-auto text-zinc-300 dark:text-zinc-600 mb-2" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              No saved events yet
            </h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1 mb-4">
              Tap the heart icon on any event card to save it to your personal watchlist.
            </p>
            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <Compass className="w-4 h-4" />
              Explore Events
            </Link>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
