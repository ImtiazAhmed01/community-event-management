"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useEvents } from "@/context/EventContext";
import { useAuth } from "@/context/AuthContext";
import { generateEventWithAI } from "@/lib/aiAssistant";
import { EventCategory } from "@/types";
import { 
  Sparkles, 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  Plus, 
  X, 
  Loader2, 
  CheckCircle2,
  Info
} from "lucide-react";

const CATEGORIES: EventCategory[] = [
  "Community & Social",
  "Environment & Nature",
  "Education & Tutoring",
  "Health & Wellness",
  "Disaster Relief",
  "Arts & Culture"
];

export default function CreateEventPage() {
  const router = useRouter();
  const { createEvent } = useEvents();
  const { user } = useAuth();

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("09:00");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<EventCategory>("Community & Social");
  const [maxCapacity, setMaxCapacity] = useState<number>(20);
  const [requiredSkills, setRequiredSkills] = useState<string[]>(["General Support"]);
  const [skillInput, setSkillInput] = useState("");
  const [registrationDeadline, setRegistrationDeadline] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [shortPromotion, setShortPromotion] = useState("");

  // AI Assistant States
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiSuccessNote, setAiSuccessNote] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // AI Generator Handler
  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) return;
    setIsGeneratingAI(true);
    setAiSuccessNote("");
    setErrorMessage("");

    try {
      const result = await generateEventWithAI(aiPrompt);
      if (!title) {
        setTitle(aiPrompt.trim());
      }
      setDescription(result.description);
      setRequiredSkills(result.requiredSkills);
      setShortPromotion(result.shortPromotion);
      setCategory(result.category);
      if (result.suggestedCapacity) {
        setMaxCapacity(result.suggestedCapacity);
      }

      setAiSuccessNote("AI generated description, volunteer roles, and promotional copy! You can review and edit below.");
    } catch {
      setErrorMessage("Could not generate AI draft. Please try again.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !requiredSkills.includes(skillInput.trim())) {
      setRequiredSkills([...requiredSkills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setRequiredSkills(requiredSkills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!title || !description || !eventDate || !location || !registrationDeadline) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    if (registrationDeadline > eventDate) {
      setErrorMessage("Registration deadline cannot be after the event date.");
      return;
    }

    if (maxCapacity <= 0) {
      setErrorMessage("Maximum capacity must be at least 1 volunteer.");
      return;
    }

    const newEvt = await createEvent({
      title,
      description,
      eventDate,
      eventTime,
      location,
      category,
      maxCapacity: Number(maxCapacity),
      requiredSkills: requiredSkills.length > 0 ? requiredSkills : ["General Support"],
      registrationDeadline,
      organizerId: user?.id || "org-1",
      organizerName: user?.name || "Community Organizer",
      organizerEmail: user?.email || "organizer@example.com",
      status: "published",
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
      shortPromotion
    });

    router.push(`/events/${newEvt.id}`);
  };

  return (
    <ProtectedRoute allowedRole="organizer">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/organizer/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-emerald-600 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Organizer Hub
          </Link>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Create Community Event
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Define volunteer roles, set capacity caps, and announce your next grassroots initiative.
          </p>
        </div>

        {/* Smart AI Event Description Assistant Box */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-500/30 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
            <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3>Smart Feature: AI Event Description Assistant</h3>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-300">
            Have an event concept? Enter a simple prompt like <em>&ldquo;We want to organize a tree plantation program&rdquo;</em> or <em>&ldquo;Community coding workshop for kids&rdquo;</em>. Our assistant will auto-generate the description, recommended volunteer skills, promotional message, and category.
          </p>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              placeholder="e.g. We want to host a weekend riverside cleanup drive"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            <button
              type="button"
              onClick={handleGenerateAI}
              disabled={isGeneratingAI || !aiPrompt.trim()}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGeneratingAI ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate with AI
                </>
              )}
            </button>
          </div>

          {aiSuccessNote && (
            <div className="p-3 rounded-xl bg-emerald-100/70 dark:bg-emerald-950/60 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {aiSuccessNote}
            </div>
          )}
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 font-medium">
            {errorMessage}
          </div>
        )}

        {/* Main Event Creation Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700 shadow-xl space-y-6">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Event Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Green City Urban Tree Plantation & Forestation"
              className="w-full px-4 py-2.5 rounded-xl text-sm border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          {/* Category & Capacity Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full px-4 py-2.5 rounded-xl text-sm border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Maximum Volunteer Capacity <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                required
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2.5 rounded-xl text-sm border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <span className="text-[11px] text-zinc-400">Total volunteer spots allowed</span>
            </div>
          </div>

          {/* Date, Time & Registration Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Event Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Event Time
              </label>
              <input
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Registration Deadline <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={registrationDeadline}
                onChange={(e) => setRegistrationDeadline(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Event Location & Venue <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. North Central Park Eco-Zone, Green Bay"
              className="w-full px-4 py-2.5 rounded-xl text-sm border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Detailed Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the background, volunteer assignments, what will be provided, and expectations..."
              className="w-full p-4 rounded-xl text-sm border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-y"
            />
          </div>

          {/* Short Promotional Message */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Short Promotional Highlight (Optional)
            </label>
            <input
              type="text"
              value={shortPromotion}
              onChange={(e) => setShortPromotion(e.target.value)}
              placeholder="e.g. Join your neighbors to plant trees! Free snacks and certificates provided."
              className="w-full px-4 py-2.5 rounded-xl text-sm border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          {/* Required Skills Manager */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Required Volunteer Skills & Roles
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Type skill and press Add (e.g. First Aid, Heavy Lifting, Photography)"
                className="flex-1 px-4 py-2 rounded-xl text-xs border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 text-zinc-800 dark:text-zinc-200 text-xs font-bold transition-colors"
              >
                Add Skill
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {requiredSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-rose-500"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Cover Image URL */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Cover Image URL (Optional)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-4 py-2.5 rounded-xl text-sm border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-700 flex items-center justify-end gap-3">
            <Link
              href="/organizer/dashboard"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.01]"
            >
              Publish Event Now
            </button>
          </div>

        </form>

      </div>
    </ProtectedRoute>
  );
}
