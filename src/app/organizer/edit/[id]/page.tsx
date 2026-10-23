"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEvents } from "@/context/EventContext";
import { EventCategory } from "@/types";
import { ArrowLeft, Save, X } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

const CATEGORIES: EventCategory[] = [
  "Community & Social",
  "Environment & Nature",
  "Education & Tutoring",
  "Health & Wellness",
  "Disaster Relief",
  "Arts & Culture"
];

export default function EditEventPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { getEventById, updateEvent } = useEvents();

  const event = getEventById(resolvedParams.id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<EventCategory>("Community & Social");
  const [maxCapacity, setMaxCapacity] = useState<number>(20);
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [registrationDeadline, setRegistrationDeadline] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [shortPromotion, setShortPromotion] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | "closed">("published");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description);
      setEventDate(event.eventDate);
      setEventTime(event.eventTime || "09:00");
      setLocation(event.location);
      setCategory(event.category);
      setMaxCapacity(event.maxCapacity);
      setRequiredSkills(event.requiredSkills || []);
      setRegistrationDeadline(event.registrationDeadline);
      setImageUrl(event.imageUrl || "");
      setShortPromotion(event.shortPromotion || "");
      setStatus(event.status);
    }
  }, [event]);

  if (!event) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 rounded-2xl bg-white dark:bg-zinc-800 border text-center">
        <h2 className="text-lg font-bold">Event not found</h2>
        <Link href="/organizer/dashboard" className="text-emerald-600 font-semibold underline text-sm mt-3 inline-block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const handleAddSkill = () => {
    if (skillInput.trim() && !requiredSkills.includes(skillInput.trim())) {
      setRequiredSkills([...requiredSkills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setRequiredSkills(requiredSkills.filter((s) => s !== skill));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateEvent(event.id, {
      title,
      description,
      eventDate,
      eventTime,
      location,
      category,
      maxCapacity: Number(maxCapacity),
      requiredSkills,
      registrationDeadline,
      imageUrl,
      shortPromotion,
      status
    });

    setMessage("Event successfully updated!");
    setTimeout(() => {
      router.push(`/organizer/dashboard`);
    }, 1200);
  };

  return (
    <ProtectedRoute allowedRole="organizer">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div>
          <Link
            href="/organizer/dashboard"
            className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-emerald-600 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Organizer Hub
          </Link>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">
            Edit Event Details
          </h1>
          <p className="text-xs text-zinc-500">Update event requirements, dates, or registration state.</p>
        </div>

        {message && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 rounded-3xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm space-y-5">
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              Event Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                Maximum Volunteer Capacity
              </label>
              <input
                type="number"
                min={1}
                required
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                Event Date
              </label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                Time
              </label>
              <input
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                Deadline
              </label>
              <input
                type="date"
                required
                value={registrationDeadline}
                onChange={(e) => setRegistrationDeadline(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              Location
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              Description
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl text-xs border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "draft" | "published" | "closed")}
              className="w-full px-3 py-2 rounded-xl text-xs border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900"
            >
              <option value="published">Published (Open for registrations)</option>
              <option value="closed">Closed (Stop new registrations)</option>
              <option value="draft">Draft (Hidden)</option>
            </select>
          </div>

          <div className="pt-3 border-t flex justify-end gap-3">
            <Link
              href="/organizer/dashboard"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow"
            >
              <Save className="w-3.5 h-3.5" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}
