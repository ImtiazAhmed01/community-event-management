"use client";

import React, { useState, useMemo } from "react";
import { useEvents } from "@/context/EventContext";
import EventCard from "@/components/EventCard";
import { EventCategory } from "@/types";
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  RotateCcw, 
  SlidersHorizontal,
  FolderOpen
} from "lucide-react";

const CATEGORIES: ("All" | EventCategory)[] = [
  "All",
  "Community & Social",
  "Environment & Nature",
  "Education & Tutoring",
  "Health & Wellness",
  "Disaster Relief",
  "Arts & Culture"
];

const TIMEFRAMES = [
  { id: "all", label: "All Dates" },
  { id: "upcoming", label: "Upcoming Events" },
  { id: "past", label: "Past Events" }
];

export default function EventsBrowsePage() {
  const { events } = useEvents();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | EventCategory>("All");
  const [timeframe, setTimeframe] = useState<string>("upcoming");
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");

  const today = new Date().toISOString().split("T")[0];

  // Extract all unique skills across events
  const allSkills = useMemo(() => {
    const set = new Set<string>();
    events.forEach((evt) => evt.requiredSkills.forEach((s) => set.add(s)));
    return Array.from(set);
  }, [events]);

  // Filtering Logic
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // 1. Title & Description Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(query);
        const matchesDesc = event.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }

      // 2. Category filter
      if (selectedCategory !== "All" && event.category !== selectedCategory) {
        return false;
      }

      // 3. Location filter
      if (locationQuery.trim()) {
        const loc = locationQuery.toLowerCase();
        if (!event.location.toLowerCase().includes(loc)) return false;
      }

      // 4. Required skill filter
      if (selectedSkill && !event.requiredSkills.includes(selectedSkill)) {
        return false;
      }

      // 5. Timeframe filter (Upcoming vs Past)
      if (timeframe === "upcoming") {
        if (event.eventDate < today) return false;
      } else if (timeframe === "past") {
        if (event.eventDate >= today) return false;
      }

      return true;
    });
  }, [events, searchQuery, selectedCategory, locationQuery, selectedSkill, timeframe, today]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setTimeframe("upcoming");
    setLocationQuery("");
    setSelectedSkill("");
  };

  const hasActiveFilters = searchQuery || selectedCategory !== "All" || timeframe !== "upcoming" || locationQuery || selectedSkill;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
          Discover Community Events
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Explore volunteer opportunities, sort by category or date, and sign up to support local programs.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700 shadow-sm mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Title search */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by event title, keywords, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/60 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          {/* Location search */}
          <div className="md:col-span-4 relative">
            <MapPin className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Location, city, or venue..."
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/60 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          {/* Timeframe selector */}
          <div className="md:col-span-3">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl text-sm border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/60 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              {TIMEFRAMES.map((tf) => (
                <option key={tf.id} value={tf.id}>
                  {tf.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills & Skill dropdown */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-700/60">
          
          {/* Category badges */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-zinc-400 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Category:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Specific Skill Match & Reset */}
          <div className="flex items-center gap-2">
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="py-1 px-2.5 rounded-lg text-xs border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 focus:outline-none"
            >
              <option value="">Filter by Skill (Any)</option>
              {allSkills.map((sk) => (
                <option key={sk} value={sk}>
                  {sk}
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 hover:underline px-2 py-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Showing <span className="font-bold text-zinc-900 dark:text-zinc-100">{filteredEvents.length}</span> events
        </p>
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
          <div className="w-12 h-12 mx-auto rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center mb-3">
            <FolderOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1">
            No matching events found
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mb-4">
            Try adjusting your search criteria or resetting the filters to view all available community opportunities.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
          >
            Clear All Filters
          </button>
        </div>
      )}

    </div>
  );
}
