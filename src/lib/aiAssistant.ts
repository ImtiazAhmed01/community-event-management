import { EventCategory } from "@/types";

export interface AIEventAssistantResult {
  title?: string;
  description: string;
  suggestedRoles: string[];
  requiredSkills: string[];
  shortPromotion: string;
  suggestedCapacity: number;
  category: EventCategory;
}

/**
 * AI Event Assistant Generator
 * Processes an event prompt or keywords and produces rich, practical descriptions,
 * volunteer roles, required skills, and engaging promotional copy.
 * Uses intelligent rule-based contextual synthesis (and can plug into an external LLM API if configured).
 */
export async function generateEventWithAI(prompt: string): Promise<AIEventAssistantResult> {
  // Simulate natural AI thinking delay (600ms) for realistic UX
  await new Promise((resolve) => setTimeout(resolve, 600));

  const lower = prompt.toLowerCase();

  // Pattern 1: Tree plantation / Green / Environment
  if (lower.includes("tree") || lower.includes("plant") || lower.includes("green") || lower.includes("nature") || lower.includes("clean") || lower.includes("garden")) {
    return {
      description: `Join our community-led ecological regeneration program! We are uniting passionate neighbors, students, and local leaders to plant native saplings, enhance green canopy coverage, and promote neighborhood biodiversity. Every volunteer helps prepare soil, distribute organic mulch, plant trees, and tag growth records. Gloves, tools, safety briefings, and hydration stations will be fully arranged on-site.`,
      suggestedRoles: [
        "Sapling & Tool Logistics Coordinator",
        "Soil & Mulch Preparation Crew",
        "Tree Planting Guide",
        "Hydration & First Aid Responder"
      ],
      requiredSkills: ["Gardening", "Logistics", "Team Coordination", "Physical Stamina", "First Aid"],
      shortPromotion: "🌿 Help us plant over 300 native trees this weekend! Join your neighbors, make our streets greener, and breathe fresher air. Free refreshments and certificate of appreciation provided!",
      suggestedCapacity: 30,
      category: "Environment & Nature"
    };
  }

  // Pattern 2: Food / Hunger / Meal / Relief
  if (lower.includes("food") || lower.includes("hunger") || lower.includes("meal") || lower.includes("kitchen") || lower.includes("soup") || lower.includes("grocery")) {
    return {
      description: `Step up to ensure no neighbor goes to bed hungry. This grassroots food drive gathers, packs, and delivers nutritious meal hampers and warm lunches directly to low-income seniors and sheltered families. Volunteers coordinate pantry sorting, quality checks, package labeling, and welcoming recipient distribution with utmost dignity and care.`,
      suggestedRoles: [
        "Pantry Sorting & Inspection Specialist",
        "Meal Package Assembly Volunteer",
        "Front-Desk Welcoming & Distribution",
        "Delivery Logistics Assistant"
      ],
      requiredSkills: ["Food Handling", "Customer Service", "Organization", "Heavy Lifting"],
      shortPromotion: "🍲 Share love and nourishment! Lend a hand packing and distributing warm meals for local families in need. Every hour makes an immediate difference.",
      suggestedCapacity: 25,
      category: "Community & Social"
    };
  }

  // Pattern 3: Teaching / Coding / Youth / Mentorship / Education
  if (lower.includes("code") || lower.includes("teach") || lower.includes("mentor") || lower.includes("stem") || lower.includes("youth") || lower.includes("tutor") || lower.includes("kid")) {
    return {
      description: `Empower the next generation of problem solvers through hands-on creative learning! This interactive mentorship program pairs volunteers with curious middle school students for an afternoon of fun coding challenges, science experiments, and creative storytelling. No advanced degree required—just empathy, enthusiasm, and an eagerness to guide young minds.`,
      suggestedRoles: [
        "Hands-On Coding Mentor",
        "Classroom Activity Facilitator",
        "Student Registration & Check-In Desk",
        "Technical Lab & Device Assistant"
      ],
      requiredSkills: ["Basic Programming/Scratch", "Tutoring", "Patience", "Communication", "Event Moderation"],
      shortPromotion: "💻 Spark curiosity and confidence in young learners! Join us as a weekend youth mentor. No formal teaching credentials required—just your energy and patience.",
      suggestedCapacity: 15,
      category: "Education & Tutoring"
    };
  }

  // Pattern 4: Health / Medical / Wellness / Blood / Senior Care
  if (lower.includes("health") || lower.includes("medical") || lower.includes("wellness") || lower.includes("blood") || lower.includes("senior") || lower.includes("doctor")) {
    return {
      description: `Support community health equity by volunteering at our neighborhood free health & wellness camp. Volunteers assist with participant registration, elder escort, blood pressure check queues, and distributing informational preventative healthcare pamphlets. Help create a warm, accessible, and supportive environment for everyone seeking care.`,
      suggestedRoles: [
        "Patient Reception & Queue Navigator",
        "Senior Companion & Escort",
        "Health Kit Distribution Assistant",
        "Multilingual Translation Support"
      ],
      requiredSkills: ["Nursing/Medical Student", "Reception", "Sign Language/Multilingual", "First Aid", "Empathy"],
      shortPromotion: "❤️ Bring healthcare support closer to the community! Assist doctors, guide visitors, and spread health awareness this Saturday.",
      suggestedCapacity: 20,
      category: "Health & Wellness"
    };
  }

  // Pattern 5: Art / Music / Culture / Festival / Mural
  if (lower.includes("art") || lower.includes("music") || lower.includes("festival") || lower.includes("culture") || lower.includes("mural") || lower.includes("dance")) {
    return {
      description: `Transform public spaces with creativity and color! This collaborative community art initiative unites local residents and neighborhood artists. Volunteers help prepare materials, guide public painting stations, maintain safe pedestrian corridors, and manage interactive kids' craft corners.`,
      suggestedRoles: [
        "Mural & Material Setup Lead",
        "Children's Creative Corner Facilitator",
        "Crowd Flow & Safety Assistant",
        "Photography & Social Storytelling Volunteer"
      ],
      requiredSkills: ["Painting & Art", "Child Care", "Photography", "Set Construction", "Enthusiasm"],
      shortPromotion: "🎨 Unleash your creativity! Join our collaborative community arts day. Paint murals, guide youth craft stations, and celebrate neighborhood culture.",
      suggestedCapacity: 20,
      category: "Arts & Culture"
    };
  }

  // Default / Generic intelligent fallback
  return {
    description: `A vital community-driven initiative organized to address neighborhood needs, foster civic unity, and create positive lasting change. Volunteers collaborate on ground activities, resource distribution, and participant engagement under the guidance of experienced coordinators. Refreshments, safety gear, and on-site briefing provided.`,
    suggestedRoles: [
      "Registration & Welcome Host",
      "Logistics & Setup Volunteer",
      "Activity Coordinator",
      "Community Outreach Assistant"
    ],
    requiredSkills: ["Communication", "Team Coordination", "Organization", "Problem Solving", "Customer Service"],
    shortPromotion: `🤝 Lend your hands and heart for "${prompt}". Join our volunteer family and create meaningful impact together!`,
    suggestedCapacity: 20,
    category: "Community & Social"
  };
}
