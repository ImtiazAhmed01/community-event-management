"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CommunityEvent } from "@/types";
import { useEvents } from "@/context/EventContext";
import { useAuth } from "@/context/AuthContext";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Heart, 
  Share2, 
  Check, 
  Sparkles,
  ArrowRight,
  Clock
} from "lucide-react";

interface EventCardProps {
  event: CommunityEvent;
  showOrganizerControls?: boolean;
}

export default function EventCard({ event, showOrganizerControls = false }: EventCardProps) {
  const { getAvailableSlots, toggleFavorite, isFavorite, isRegistered } = useEvents();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const availableSlots = getAvailableSlots(event);
  const isFull = availableSlots <= 0;
  const isFav = isFavorite(event.id);
  const registered = user ? isRegistered(event.id, user.id) : false;

  const today = new Date().toISOString().split("T")[0];
  const isPast = event.eventDate < today;
  const isDeadlinePassed = event.registrationDeadline < today;

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/events/${event.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(event.id);
  };

  return (
    <div className="group relative flex flex-col rounded-2xl bg-white dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700/80 shadow-sm hover:shadow-xl hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-300 overflow-hidden">
      
      {/* Event Image Banner with Category Badge */}
      <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-700">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.imageUrl || "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80"}
          alt={event.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Category Pill */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-white/90 dark:bg-zinc-900/90 text-zinc-800 dark:text-zinc-200 backdrop-blur-md shadow-sm">
            {event.category}
          </span>
        </div>

        {/* Top-right Favorite & Share actions */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            onClick={handleShare}
            title="Share event link"
            className="p-1.5 rounded-full bg-white/90 dark:bg-zinc-900/90 text-zinc-700 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 backdrop-blur-md transition-all active:scale-95 shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>
          <button
            onClick={handleFavorite}
            title={isFav ? "Remove from saved" : "Save event"}
            className="p-1.5 rounded-full bg-white/90 dark:bg-zinc-900/90 text-zinc-700 dark:text-zinc-200 hover:text-rose-500 backdrop-blur-md transition-all active:scale-95 shadow-sm"
          >
            <Heart className={`w-4 h-4 ${isFav ? "fill-rose-500 text-rose-500" : ""}`} />
          </button>
        </div>

        {/* Status indicator bottom left of image */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          {registered && (
            <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-emerald-500 text-white shadow">
              ✓ Registered
            </span>
          )}
          {isFull ? (
            <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-rose-500 text-white shadow">
              Capacity Full
            </span>
          ) : event.status === "closed" ? (
            <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-amber-500 text-white shadow">
              Registration Closed
            </span>
          ) : isPast ? (
            <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-zinc-600 text-white shadow">
              Past Event
            </span>
          ) : (
            <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-emerald-500/90 text-white shadow backdrop-blur-sm">
              {availableSlots} spots open
            </span>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Date and Location line */}
          <div className="flex items-center gap-3 text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(event.eventDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400 truncate max-w-[170px]">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              {event.location}
            </span>
          </div>

          {/* Event Title */}
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1 mb-2">
            <Link href={`/events/${event.id}`}>
              {event.title}
            </Link>
          </h3>

          {/* Short description */}
          <p className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-2 mb-4 leading-relaxed">
            {event.shortPromotion || event.description}
          </p>

          {/* Required Skills Badges */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {event.requiredSkills.slice(0, 3).map((skill, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-xs rounded-md bg-zinc-100 dark:bg-zinc-700/60 text-zinc-700 dark:text-zinc-300 font-medium"
              >
                {skill}
              </span>
            ))}
            {event.requiredSkills.length > 3 && (
              <span className="px-2 py-0.5 text-xs rounded-md bg-zinc-100 dark:bg-zinc-700/60 text-zinc-500">
                +{event.requiredSkills.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Footer info: capacity meter & call to action */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-700/60 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
              <Users className="w-3.5 h-3.5" />
              <span>
                <strong className="text-zinc-800 dark:text-zinc-200">{event.maxCapacity - availableSlots}</strong> / {event.maxCapacity} volunteers
              </span>
            </div>
            {/* Mini progress bar */}
            <div className="w-24 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full mt-1 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  isFull ? "bg-rose-500" : "bg-emerald-500"
                }`}
                style={{
                  width: `${Math.min(100, ((event.maxCapacity - availableSlots) / event.maxCapacity) * 100)}%`
                }}
              />
            </div>
          </div>

          <Link
            href={`/events/${event.id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 group-hover:translate-x-0.5 transition-all"
          >
            Details
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
