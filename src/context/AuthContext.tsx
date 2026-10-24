"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserProfile } from "@/types";
import { DEMO_USERS } from "@/lib/seedData";
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  firebaseSignOut,
  onAuthStateChanged,
  FirebaseUser
} from "@/lib/firebase";

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  loginWithGoogle: (preferredRole?: 'organizer' | 'volunteer') => Promise<void>;
  loginWithEmail: (email: string, pass: string, role?: 'organizer' | 'volunteer') => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string, role: 'organizer' | 'volunteer') => Promise<void>;
  quickLoginAs: (role: 'organizer' | 'volunteer') => void;
  logout: () => Promise<void>;
  updateProfile: (updatedData: Partial<UserProfile>) => void;
  isFirebaseAvailable: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFirebaseAvailable, setIsFirebaseAvailable] = useState(false);

  // Initialize and check saved session or Firebase auth state
  useEffect(() => {
    let unsubscribe = () => {};

    try {
      if (auth) {
        unsubscribe = onAuthStateChanged(auth, (fbUser) => {
          if (fbUser) {
            setFirebaseUser(fbUser);
            setIsFirebaseAvailable(true);
            // Check if profile exists in localStorage
            const savedCustomUsers = localStorage.getItem("community_user_profiles");
            const profiles: Record<string, UserProfile> = savedCustomUsers ? JSON.parse(savedCustomUsers) : {};
            
            const existingProfile = profiles[fbUser.uid];
            if (existingProfile) {
              setUser(existingProfile);
            } else {
              // Create default profile for authenticated user
              const newProfile: UserProfile = {
                id: fbUser.uid,
                name: fbUser.displayName || fbUser.email?.split('@')[0] || "Community Member",
                email: fbUser.email || "user@example.com",
                role: "volunteer", // Default role unless customized
                avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fbUser.uid}`,
                skills: ["Community Support", "Communication"],
                interests: ["Community & Social", "Environment & Nature"],
                bio: "Active volunteer ready to make a positive impact in the neighborhood."
              };
              profiles[fbUser.uid] = newProfile;
              localStorage.setItem("community_user_profiles", JSON.stringify(profiles));
              setUser(newProfile);
            }
          } else {
            setFirebaseUser(null);
            // Check if user chose mock/demo session
            const storedUser = localStorage.getItem("community_active_user");
            if (storedUser) {
              try {
                setUser(JSON.parse(storedUser));
              } catch {
                setUser(null);
              }
            }
          }
          setLoading(false);
        }, (error) => {
          console.warn("Firebase Auth listener initialized with placeholder/fallback mode:", error.message);
          // Fallback to local storage
          const storedUser = localStorage.getItem("community_active_user");
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch {
              setUser(null);
            }
          }
          setLoading(false);
        });
      } else {
        // Fallback without firebase
        const storedUser = localStorage.getItem("community_active_user");
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            setUser(null);
          }
        }
        setLoading(false);
      }
    } catch {
      // Offline / fallback state
      const storedUser = localStorage.getItem("community_active_user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  // Quick switch for demo testing (Organizer / Volunteer)
  const quickLoginAs = (role: 'organizer' | 'volunteer') => {
    const target = DEMO_USERS.find(u => u.role === role) || {
      id: role === 'organizer' ? 'org-1' : 'vol-1',
      name: role === 'organizer' ? 'Sarah Jenkins' : 'Alex Morgan',
      email: role === 'organizer' ? 'organizer@demo.com' : 'volunteer@demo.com',
      role,
      bio: role === 'organizer' ? 'Lead Organizer' : 'Passionate Volunteer',
      skills: ['Coordination', 'Communication'],
      interests: ['Community & Social']
    };
    setUser(target);
    localStorage.setItem("community_active_user", JSON.stringify(target));
  };

  const loginWithGoogle = async (preferredRole: 'organizer' | 'volunteer' = 'volunteer') => {
    const isPlaceholderKey = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes("PlaceholderMock");

    if (!isPlaceholderKey) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const fbUser = result.user;
        setFirebaseUser(fbUser);
        setIsFirebaseAvailable(true);

        const savedProfiles = localStorage.getItem("community_user_profiles");
        const profiles: Record<string, UserProfile> = savedProfiles ? JSON.parse(savedProfiles) : {};
        
        let profile = profiles[fbUser.uid];
        if (!profile) {
          profile = {
            id: fbUser.uid,
            name: fbUser.displayName || fbUser.email?.split('@')[0] || "Google Member",
            email: fbUser.email || "googleuser@example.com",
            role: preferredRole,
            avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fbUser.uid}`,
            skills: ["Teamwork", "Volunteer Assistance"],
            interests: ["Community & Social"],
            bio: `Joined via Google Authentication as ${preferredRole}.`
          };
          profiles[fbUser.uid] = profile;
          localStorage.setItem("community_user_profiles", JSON.stringify(profiles));
        }

        // Sync to database
        fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profile)
        }).catch(console.warn);

        setUser(profile);
        localStorage.setItem("community_active_user", JSON.stringify(profile));
        return;
      } catch (err: unknown) {
        console.warn("Live Firebase Google popup error:", err);
      }
    }

    // Seamless Google Auth Simulator when real Firebase API keys are pending
    const simulatedGoogleUser: UserProfile = {
      id: "google-usr-" + Date.now().toString(),
      name: "Google Member",
      email: "google.user@gmail.com",
      role: preferredRole,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      bio: `Authenticated via Google SSO as ${preferredRole}.`,
      skills: ["Community Outreach", "Volunteer Assistance"],
      interests: ["Community & Social"]
    };

    // Sync to database
    fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(simulatedGoogleUser)
    }).catch(console.warn);

    setUser(simulatedGoogleUser);
    localStorage.setItem("community_active_user", JSON.stringify(simulatedGoogleUser));

  };

  const loginWithEmail = async (email: string, pass: string, role?: 'organizer' | 'volunteer') => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      const fbUser = res.user;
      setFirebaseUser(fbUser);
      const savedProfiles = localStorage.getItem("community_user_profiles");
      const profiles: Record<string, UserProfile> = savedProfiles ? JSON.parse(savedProfiles) : {};
      let profile = profiles[fbUser.uid];
      if (!profile) {
        profile = {
          id: fbUser.uid,
          name: email.split("@")[0],
          email: fbUser.email || email,
          role: role || (email.toLowerCase().includes("organizer") ? "organizer" : "volunteer"),
          bio: "Community volunteer",
          skills: ["General Help"],
          interests: ["Community & Social"]
        };
      }
      setUser(profile);
      localStorage.setItem("community_active_user", JSON.stringify(profile));
    } catch {
      // Mock login fallback
      const userProfile: UserProfile = {
        id: "usr-" + Date.now().toString(),
        name: email.split("@")[0].replace(".", " ").toUpperCase(),
        email,
        role: role || (email.toLowerCase().includes("organizer") ? "organizer" : "volunteer"),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        bio: "Dedicated community participant.",
        skills: ["Support", "Coordination"]
      };
      setUser(userProfile);
      localStorage.setItem("community_active_user", JSON.stringify(userProfile));
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string, role: 'organizer' | 'volunteer') => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      const fbUser = res.user;
      setFirebaseUser(fbUser);
      const newProfile: UserProfile = {
        id: fbUser.uid,
        name,
        email: fbUser.email || email,
        role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        bio: `Hi, I am ${name}! Ready to contribute to community events as ${role}.`,
        skills: ["Communication", "Event Assistance"],
        interests: ["Community & Social"]
      };
      const savedProfiles = localStorage.getItem("community_user_profiles");
      const profiles = savedProfiles ? JSON.parse(savedProfiles) : {};
      profiles[fbUser.uid] = newProfile;
      localStorage.setItem("community_user_profiles", JSON.stringify(profiles));

      // Sync to database
      try {
        await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProfile)
        });
      } catch (e) {
        console.warn("User sync to DB warning:", e);
      }

      setUser(newProfile);
      localStorage.setItem("community_active_user", JSON.stringify(newProfile));
    } catch {
      // Fallback local registration
      const newProfile: UserProfile = {
        id: "usr-" + Date.now().toString(),
        name,
        email,
        role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        bio: `Hi, I am ${name}! Ready to contribute to community events.`,
        skills: ["Communication", "Event Assistance"],
        interests: ["Community & Social"]
      };

      // Sync to database
      try {
        await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProfile)
        });
      } catch (e) {
        console.warn("Fallback user sync to DB warning:", e);
      }

      setUser(newProfile);
      localStorage.setItem("community_active_user", JSON.stringify(newProfile));
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch {
      // ignore
    }
    setUser(null);
    setFirebaseUser(null);
    localStorage.removeItem("community_active_user");
  };

  const updateProfile = (updatedData: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updatedData };
    setUser(updated);
    localStorage.setItem("community_active_user", JSON.stringify(updated));

    // Also persist in profile map
    const savedProfiles = localStorage.getItem("community_user_profiles");
    const profiles = savedProfiles ? JSON.parse(savedProfiles) : {};
    profiles[user.id] = updated;
    localStorage.setItem("community_user_profiles", JSON.stringify(profiles));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        quickLoginAs,
        logout,
        updateProfile,
        isFirebaseAvailable
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
