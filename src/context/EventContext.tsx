"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { CommunityEvent, VolunteerRegistration, ParticipationStatus } from "@/types";
import { INITIAL_EVENTS, INITIAL_REGISTRATIONS } from "@/lib/seedData";

interface EventContextType {
  events: CommunityEvent[];
  registrations: VolunteerRegistration[];
  favorites: string[];
  isLoading: boolean;
  createEvent: (eventData: Omit<CommunityEvent, "id" | "createdAt">) => Promise<CommunityEvent>;
  updateEvent: (id: string, updatedData: Partial<CommunityEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  closeRegistration: (id: string) => Promise<void>;
  publishEvent: (id: string) => Promise<void>;
  registerForEvent: (
    eventId: string,
    user: { id: string; name: string; email: string },
    selectedSkill: string,
    notes?: string
  ) => Promise<{ success: boolean; message: string; registration?: VolunteerRegistration }>;
  cancelRegistration: (registrationId: string) => Promise<{ success: boolean; message: string }>;
  updateVolunteerStatus: (registrationId: string, status: ParticipationStatus) => Promise<void>;
  getEventById: (id: string) => CommunityEvent | undefined;
  getEventRegistrations: (eventId: string) => VolunteerRegistration[];
  getAvailableSlots: (event: CommunityEvent) => number;
  isRegistered: (eventId: string, userId: string) => boolean;
  toggleFavorite: (eventId: string) => void;
  isFavorite: (eventId: string) => boolean;
  refreshData: () => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<CommunityEvent[]>(INITIAL_EVENTS);
  const [registrations, setRegistrations] = useState<VolunteerRegistration[]>(INITIAL_REGISTRATIONS);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch events & registrations from database via /api
  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [eventsRes, regsRes] = await Promise.all([
        fetch("/api/events"),
        fetch("/api/registrations")
      ]);

      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        if (Array.isArray(eventsData) && eventsData.length > 0) {
          setEvents(eventsData);
        }
      }

      if (regsRes.ok) {
        const regsData = await regsRes.json();
        if (Array.isArray(regsData)) {
          setRegistrations(regsData);
        }
      }
    } catch (e) {
      console.warn("API fetch error, keeping current memory state:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
    try {
      const storedFavs = localStorage.getItem("community_favorites");
      if (storedFavs) {
        setFavorites(JSON.parse(storedFavs));
      }
    } catch {
      // ignore
    }
  }, [refreshData]);

  const toggleFavorite = (eventId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId];
      try {
        localStorage.setItem("community_favorites", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const isFavorite = (eventId: string) => favorites.includes(eventId);

  const getAvailableSlots = (event: CommunityEvent): number => {
    const active = registrations.filter(
      (r) => r.eventId === event.id && r.status !== "Cancelled"
    );
    return Math.max(0, event.maxCapacity - active.length);
  };

  const isRegistered = (eventId: string, userId: string): boolean => {
    return registrations.some(
      (r) => r.eventId === eventId && r.userId === userId && r.status !== "Cancelled"
    );
  };

  const createEvent = async (data: Omit<CommunityEvent, "id" | "createdAt">): Promise<CommunityEvent> => {
    const newEvent: CommunityEvent = {
      ...data,
      id: "evt-" + Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
      imageUrl: data.imageUrl || "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80"
    };

    // Optimistic UI update
    setEvents((prev) => [newEvent, ...prev]);

    try {
      await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent)
      });
    } catch (e) {
      console.error("Failed to persist event to database:", e);
    }

    return newEvent;
  };

  const updateEvent = async (id: string, updatedData: Partial<CommunityEvent>) => {
    setEvents((prev) =>
      prev.map((evt) => (evt.id === id ? { ...evt, ...updatedData } : evt))
    );

    try {
      await fetch(`/api/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
      });
    } catch (e) {
      console.error("Failed to update event in database:", e);
    }
  };

  const deleteEvent = async (id: string) => {
    setEvents((prev) => prev.filter((evt) => evt.id !== id));
    setRegistrations((prev) => prev.filter((r) => r.eventId !== id));

    try {
      await fetch(`/api/events/${id}`, { method: "DELETE" });
    } catch (e) {
      console.error("Failed to delete event in database:", e);
    }
  };

  const closeRegistration = async (id: string) => {
    await updateEvent(id, { status: "closed" });
  };

  const publishEvent = async (id: string) => {
    await updateEvent(id, { status: "published" });
  };

  const registerForEvent = async (
    eventId: string,
    user: { id: string; name: string; email: string },
    selectedSkill: string,
    notes?: string
  ): Promise<{ success: boolean; message: string; registration?: VolunteerRegistration }> => {
    const event = events.find((e) => e.id === eventId);
    if (!event) {
      return { success: false, message: "Event not found or has been removed." };
    }

    if (event.status === "closed") {
      return { success: false, message: "Registration is closed for this event." };
    }

    const today = new Date().toISOString().split("T")[0];
    if (event.registrationDeadline < today) {
      return { success: false, message: "Registration deadline has passed." };
    }

    const slots = getAvailableSlots(event);
    if (slots <= 0) {
      return { success: false, message: "This event has reached maximum capacity." };
    }

    const alreadyRegistered = registrations.find(
      (r) => r.eventId === eventId && r.userId === user.id && r.status !== "Cancelled"
    );
    if (alreadyRegistered) {
      return { success: false, message: "You are already registered for this event." };
    }

    const newReg: VolunteerRegistration = {
      id: "reg-" + Date.now().toString(),
      eventId,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      selectedSkill,
      registrationDate: new Date().toISOString().replace("T", " ").substring(0, 16),
      status: "Registered",
      notes
    };

    setRegistrations((prev) => [newReg, ...prev]);

    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReg)
      });
      if (!res.ok) {
        const errData = await res.json();
        return { success: false, message: errData.error || "Failed to register" };
      }
    } catch (e) {
      console.warn("Database registration post warning:", e);
    }

    return { success: true, message: "Successfully registered! Check your upcoming events.", registration: newReg };
  };

  const cancelRegistration = async (registrationId: string): Promise<{ success: boolean; message: string }> => {
    const reg = registrations.find((r) => r.id === registrationId);
    if (!reg) {
      return { success: false, message: "Registration not found." };
    }

    const evt = events.find((e) => e.id === reg.eventId);
    const today = new Date().toISOString().split("T")[0];
    if (evt && evt.eventDate < today) {
      return { success: false, message: "Cannot cancel registration for past events." };
    }

    setRegistrations((prev) =>
      prev.map((r) => (r.id === registrationId ? { ...r, status: "Cancelled" } : r))
    );

    try {
      await fetch(`/api/registrations/${registrationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Cancelled" })
      });
    } catch (e) {
      console.error("Failed to cancel registration in database:", e);
    }

    return { success: true, message: "Registration successfully cancelled." };
  };

  const updateVolunteerStatus = async (registrationId: string, status: ParticipationStatus) => {
    setRegistrations((prev) =>
      prev.map((r) => (r.id === registrationId ? { ...r, status } : r))
    );

    try {
      await fetch(`/api/registrations/${registrationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
    } catch (e) {
      console.error("Failed to update volunteer status in database:", e);
    }
  };

  const getEventById = (id: string): CommunityEvent | undefined => {
    return events.find((e) => e.id === id);
  };

  const getEventRegistrations = (eventId: string): VolunteerRegistration[] => {
    return registrations.filter((r) => r.eventId === eventId);
  };

  return (
    <EventContext.Provider
      value={{
        events,
        registrations,
        favorites,
        isLoading,
        createEvent,
        updateEvent,
        deleteEvent,
        closeRegistration,
        publishEvent,
        registerForEvent,
        cancelRegistration,
        updateVolunteerStatus,
        getEventById,
        getEventRegistrations,
        getAvailableSlots,
        isRegistered,
        toggleFavorite,
        isFavorite,
        refreshData
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvents must be used within an EventProvider");
  }
  return context;
}
