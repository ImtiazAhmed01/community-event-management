"use client";

import React, { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useEvents } from "@/context/EventContext";
import { 
  User, 
  Mail, 
  Award, 
  Sparkles, 
  Save, 
  ShieldCheck, 
  CheckCircle2, 
  X,
  Phone,
  FileText
} from "lucide-react";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { registrations, events } = useEvents();

  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [skills, setSkills] = useState<string[]>(user?.skills || ["Team Coordination", "Logistics"]);
  const [skillInput, setSkillInput] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      bio,
      phone,
      skills
    });
    setFeedback("Profile updated successfully!");
    setTimeout(() => setFeedback(""), 3000);
  };

  const userRegs = registrations.filter((r) => r.userId === user?.id);
  const attendedCount = userRegs.filter((r) => r.status === "Attended").length;

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Profile Card Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700 shadow-sm flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-emerald-600 text-white font-extrabold text-3xl flex items-center justify-center overflow-hidden shadow-lg shadow-emerald-600/20">
            {user?.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0) || "U"
            )}
          </div>

          <div className="space-y-1 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {user?.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center justify-center sm:justify-start gap-1">
              <Mail className="w-3.5 h-3.5" />
              {user?.email}
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 pt-1 max-w-lg">
              {user?.bio || "Civic contributor making real difference in local neighborhoods."}
            </p>
          </div>

          {/* Badge */}
          <div className="text-center p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 shrink-0">
            <Award className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">
              {attendedCount} Events Attended
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold">Active Member</span>
          </div>
        </div>

        {feedback && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {feedback}
          </div>
        )}

        {/* Profile Edit Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            Edit Profile Details & Skills
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                Phone Number (Optional)
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 019-2834"
                className="w-full px-3 py-2 rounded-xl text-xs border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              Bio & Community Interests
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell organizations about your background and passion..."
              className="w-full p-3 rounded-xl text-xs border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900"
            />
          </div>

          {/* Volunteer Skills Manager */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              Your Skills & Capabilities
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
                placeholder="e.g. First Aid, Photography, Web Design, Heavy Lifting"
                className="flex-1 px-3 py-2 rounded-xl text-xs border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-700 text-xs font-bold hover:bg-zinc-200"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {skills.map((skill, idx) => (
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
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow"
            >
              <Save className="w-3.5 h-3.5" />
              Update Profile
            </button>
          </div>
        </form>

      </div>
    </ProtectedRoute>
  );
}
