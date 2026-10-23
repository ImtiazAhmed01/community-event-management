"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useEvents } from "@/context/EventContext";
import { useAuth } from "@/context/AuthContext";
import QRCodeModal from "@/components/QRCodeModal";
import confetti from "canvas-confetti";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Tag, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft, 
  Share2, 
  Heart, 
  Sparkles,
  QrCode,
  ShieldCheck,
  Check
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EventDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { getEventById, getAvailableSlots, registerForEvent, isRegistered, getEventRegistrations, toggleFavorite, isFavorite } = useEvents();
  const { user } = useAuth();

  const event = getEventById(resolvedParams.id);

  const [selectedSkill, setSelectedSkill] = useState("");
  const [volunteerNotes, setVolunteerNotes] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [activeRegId, setActiveRegId] = useState("");

  if (!event) {
    return (
      <div className="max-w-2xl mx-auto my-16 p-8 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-center">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Event Not Found</h2>
        <p className="text-sm text-zinc-500 mb-6">This event may have been deleted or the link is invalid.</p>
        <Link href="/events" className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700">
          Back to Events
        </Link>
      </div>
    );
  }

  const availableSlots = getAvailableSlots(event);
  const isFull = availableSlots <= 0;
  const today = new Date().toISOString().split("T")[0];
  const isPast = event.eventDate < today;
  const isDeadlinePassed = event.registrationDeadline < today;
  const isFav = isFavorite(event.id);

  // Check if currently logged in user is already registered
  const userRegistration = user ? getEventRegistrations(event.id).find((r) => r.userId === user.id && r.status !== "Cancelled") : null;
  const alreadyRegistered = Boolean(userRegistration);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!user) {
      router.push("/login?redirect=" + encodeURIComponent(`/events/${event.id}`));
      return;
    }

    if (user.role === "organizer") {
      setErrorMsg("Organizers cannot register as volunteers. Please switch to a volunteer profile to join.");
      return;
    }

    if (!selectedSkill) {
      setErrorMsg("Please select the role or skill you can contribute.");
      return;
    }

    setIsSubmitting(true);

    const result = await registerForEvent(
      event.id,
      { id: user.id, name: user.name, email: user.email },
      selectedSkill,
      volunteerNotes
    );

    setIsSubmitting(false);

    if (result.success) {
      setSuccessMsg(result.message);
      if (result.registration) {
        setActiveRegId(result.registration.id);
      }
      // Celebration effect
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti fallback
      }
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Navigation & Action Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all events
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            {copied ? "Link Copied!" : "Share"}
          </button>
          <button
            onClick={() => toggleFavorite(event.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:text-rose-500 transition-colors"
          >
            <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-rose-500 text-rose-500" : ""}`} />
            {isFav ? "Saved" : "Save"}
          </button>
        </div>
      </div>

      {/* Main Event Showcase Header */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl bg-zinc-900 text-white min-h-[320px] flex flex-col justify-end p-6 sm:p-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.imageUrl || "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80"}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />

        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-500 text-white shadow-sm">
              {event.category}
            </span>
            {event.status === "closed" && (
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-rose-500 text-white">
                Registration Closed
              </span>
            )}
            {isPast && (
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-zinc-600 text-white">
                Past Event
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {event.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-zinc-300 pt-1">
            <span className="flex items-center gap-1.5 text-emerald-300 font-semibold">
              <Calendar className="w-4 h-4" />
              {new Date(event.eventDate).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-300" />
              {event.eventTime || "09:00 AM"}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 truncate max-w-xs">
              <MapPin className="w-4 h-4 text-emerald-300" />
              {event.location}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: 2 Columns (Details & Registration Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Description, Skills, Logistics */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* About the Event */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              About This Initiative
            </h2>
            <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>

            {event.shortPromotion && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-sm text-emerald-900 dark:text-emerald-200 italic">
                  &ldquo;{event.shortPromotion}&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* Required Skills & Volunteer Roles */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Tag className="w-5 h-5 text-emerald-600" />
              Required Volunteer Skills & Roles
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Select one matching skill when you register to help coordinators assign team tasks properly.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {event.requiredSkills.map((skill, index) => (
                <div
                  key={index}
                  className="px-3.5 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-sm font-semibold flex items-center gap-2 border border-zinc-200 dark:border-zinc-600"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {skill}
                </div>
              ))}
            </div>
          </div>

          {/* Organizer Information Box */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-lg">
                {event.organizerName.charAt(0)}
              </div>
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Organized by</p>
                <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">{event.organizerName}</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{event.organizerEmail}</p>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Host
            </span>
          </div>

        </div>

        {/* Right 1 Column: Capacity Status & Registration Box */}
        <div className="space-y-6">
          
          {/* Capacity Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Capacity Status
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                <span>Maximum Capacity</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{event.maxCapacity} volunteers</span>
              </div>
              <div className="flex justify-between text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                <span>Currently Registered</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{event.maxCapacity - availableSlots}</span>
              </div>
              <div className="flex justify-between text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                <span>Available Slots</span>
                <span className={`font-bold ${isFull ? "text-rose-600" : "text-emerald-600"}`}>
                  {availableSlots}
                </span>
              </div>

              {/* Capacity Progress Bar */}
              <div className="w-full h-2.5 bg-zinc-100 dark:bg-zinc-700 rounded-full overflow-hidden mt-3">
                <div
                  className={`h-full transition-all ${
                    isFull ? "bg-rose-500" : "bg-emerald-500"
                  }`}
                  style={{
                    width: `${Math.min(100, ((event.maxCapacity - availableSlots) / event.maxCapacity) * 100)}%`
                  }}
                />
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-700 text-xs text-zinc-500 space-y-1">
              <p>
                <strong>Deadline:</strong> {new Date(event.registrationDeadline).toLocaleDateString()}
              </p>
              {isDeadlinePassed && (
                <p className="text-rose-500 font-semibold">Registration deadline has elapsed.</p>
              )}
            </div>
          </div>

          {/* Registration Action Box */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-md space-y-4">
            
            {/* Case 1: Already Registered */}
            {alreadyRegistered ? (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  You Are Registered!
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Status: <strong className="text-emerald-600">{userRegistration?.status}</strong>
                  <br />
                  Assigned Skill: <strong>{userRegistration?.selectedSkill}</strong>
                </p>

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={() => {
                      if (userRegistration) {
                        setActiveRegId(userRegistration.id);
                        setShowQR(true);
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
                  >
                    <QrCode className="w-4 h-4" />
                    View Digital Check-In Pass
                  </button>

                  <Link
                    href="/volunteer/my-events"
                    className="w-full py-2 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold hover:bg-zinc-200 text-center"
                  >
                    Manage In My Events
                  </Link>
                </div>
              </div>
            ) : isFull ? (
              /* Case 2: Full Capacity */
              <div className="text-center py-4 space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Event is Fully Booked
                </h4>
                <p className="text-xs text-zinc-500">
                  All {event.maxCapacity} slots have been reserved. Please check other community events.
                </p>
              </div>
            ) : isDeadlinePassed ? (
              /* Case 3: Deadline Passed */
              <div className="text-center py-4 space-y-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Registration Expired
                </h4>
                <p className="text-xs text-zinc-500">
                  The deadline ({event.registrationDeadline}) for joining this event has passed.
                </p>
              </div>
            ) : user?.role === "organizer" ? (
              /* Case 4: Organizer Persona Attempting to Register */
              <div className="text-center py-4 space-y-3">
                <div className="w-10 h-10 mx-auto rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Organizer Account Detected
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Organizers cannot register as volunteers. Switch to a Volunteer persona to test registration.
                </p>
              </div>
            ) : (
              /* Case 5: Open Registration Form */
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Register as Volunteer
                </h3>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400">
                    {errorMsg}
                  </div>
                )}

                {successMsg && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-700 dark:text-emerald-300">
                    {successMsg}
                  </div>
                )}

                {/* Skill Selector */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Your Skill / Selected Role <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                    required
                    className="w-full py-2 px-3 rounded-xl text-xs border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  >
                    <option value="">Choose a skill / responsibility...</option>
                    {event.requiredSkills.map((skill, idx) => (
                      <option key={idx} value={skill}>
                        {skill}
                      </option>
                    ))}
                    <option value="General Volunteer Support">General Volunteer Support</option>
                  </select>
                </div>

                {/* Volunteer notes / Experience */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Experience / Availability Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={volunteerNotes}
                    onChange={(e) => setVolunteerNotes(e.target.value)}
                    placeholder="e.g. Can bring tools, CPR certified, available after 9am..."
                    className="w-full p-2.5 rounded-xl text-xs border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.01] disabled:opacity-50"
                >
                  {isSubmitting ? "Registering..." : "Confirm My Registration"}
                </button>

                <p className="text-[11px] text-zinc-400 text-center">
                  Instant confirmation • You can cancel anytime before the event date
                </p>
              </form>
            )}

          </div>

        </div>

      </div>

      {/* QR Code Pass Modal */}
      {showQR && (
        <QRCodeModal
          isOpen={showQR}
          onClose={() => setShowQR(false)}
          eventTitle={event.title}
          volunteerName={user?.name || "Volunteer"}
          registrationId={activeRegId || userRegistration?.id || "REG-TEST"}
          status={userRegistration?.status || "Confirmed"}
        />
      )}

    </div>
  );
}
