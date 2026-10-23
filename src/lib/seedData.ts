import { CommunityEvent, VolunteerRegistration, UserProfile } from "@/types";

export const INITIAL_EVENTS: CommunityEvent[] = [
  {
    id: "evt-1",
    title: "Green City Urban Tree Plantation & Forestation",
    description: "Join our community initiative to plant 500 indigenous trees across North Central Park. We provide tree saplings, tools, gloves, and expert guidance. Together we build cleaner air, enhance urban biodiversity, and cool down our neighborhood.",
    eventDate: "2026-11-15",
    eventTime: "08:30",
    location: "North Central Park Eco-Zone, Green Bay",
    category: "Environment & Nature",
    maxCapacity: 25,
    requiredSkills: ["Gardening", "Logistics", "Team Coordination", "First Aid"],
    registrationDeadline: "2026-11-12",
    organizerId: "org-1",
    organizerName: "Sarah Jenkins (EcoWarriors)",
    organizerEmail: "sarah@ecowarriors.org",
    status: "published",
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2026-10-10",
    shortPromotion: "Plant trees, breathe clean air, transform our local park! Free snacks and community certificates provided."
  },
  {
    id: "evt-2",
    title: "Youth STEM & Coding Mentorship Day",
    description: "An intensive and engaging 1-day hack and mentoring workshop for underprivileged middle school students. Volunteers assist children with Scratch coding, basic robotics, and inspiring science experiments.",
    eventDate: "2026-11-20",
    eventTime: "10:00",
    location: "Downtown Civic Library, Innovation Hub Rm 302",
    category: "Education & Tutoring",
    maxCapacity: 15,
    requiredSkills: ["Basic Python/Scratch", "Tutoring", "Patience", "Event Moderation"],
    registrationDeadline: "2026-11-18",
    organizerId: "org-1",
    organizerName: "Sarah Jenkins (EcoWarriors)",
    organizerEmail: "sarah@ecowarriors.org",
    status: "published",
    imageUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2026-10-12",
    shortPromotion: "Ignite young minds with technology and coding. Be a mentor who inspires the next generation of innovators."
  },
  {
    id: "evt-3",
    title: "Community Food Drive & Warm Meals Distribution",
    description: "Distribute nutritious warm meals and pack emergency grocery packages for low-income families and seniors across the metropolitan district. Volunteers will handle sorting, meal prep support, packaging, and friendly delivery assistance.",
    eventDate: "2026-11-05",
    eventTime: "09:00",
    location: "Hope Community Center, 420 Unity Boulevard",
    category: "Community & Social",
    maxCapacity: 30,
    requiredSkills: ["Food Handling", "Customer Service", "Heavy Lifting", "Organization"],
    registrationDeadline: "2026-11-03",
    organizerId: "org-2",
    organizerName: "Marcus Vance (Community Relief)",
    organizerEmail: "marcus@communityrelief.org",
    status: "published",
    imageUrl: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2026-10-05",
    shortPromotion: "Share warmth and nourishment. Help pack and deliver 1,000 warm meals to neighborhood families."
  },
  {
    id: "evt-4",
    title: "Senior Health & Wellness Checkup Camp",
    description: "Provide support at our monthly free health screening camp for elderly citizens. Duties include registration assistance, directing patients to consultation rooms, escorting seniors, and distributing wellness kits.",
    eventDate: "2026-11-28",
    eventTime: "08:00",
    location: "St. Jude Community Hospital Plaza",
    category: "Health & Wellness",
    maxCapacity: 12,
    requiredSkills: ["Nursing/Medical Student", "Reception", "Sign Language/Multilingual", "First Aid"],
    registrationDeadline: "2026-11-25",
    organizerId: "org-1",
    organizerName: "Sarah Jenkins (EcoWarriors)",
    organizerEmail: "sarah@ecowarriors.org",
    status: "published",
    imageUrl: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2026-10-15",
    shortPromotion: "Care for our elders with health checks, friendly smiles, and compassionate wellness support."
  },
  {
    id: "evt-5",
    title: "Annual Community Mural Art & Cultural Festival",
    description: "Assist local artists in painting a 200-foot vibrant mural depicting community resilience and diversity. Volunteers will assist with paint mixing, brush cleaning, scaffolding safety coordination, and children art booth activities.",
    eventDate: "2026-12-05",
    eventTime: "11:00",
    location: "Arts District East Alleyway, 78 Wall Street",
    category: "Arts & Culture",
    maxCapacity: 18,
    requiredSkills: ["Painting & Art", "Child Care", "Photography", "Set Construction"],
    registrationDeadline: "2026-12-01",
    organizerId: "org-2",
    organizerName: "Marcus Vance (Community Relief)",
    organizerEmail: "marcus@communityrelief.org",
    status: "published",
    imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2026-10-18",
    shortPromotion: "Add color and life to our urban canvas! Paint alongside world-class local artists."
  },
  {
    id: "evt-6",
    title: "Coastal Wetland Cleanup & Wildlife Habitat Restoration",
    description: "Remove microplastics and industrial debris from fragile marine bird nesting sanctuaries along the bay estuary. Protective gear, trash grabbers, and water refill stations provided.",
    eventDate: "2026-10-20", // Past event example for testing filters and past events display
    eventTime: "07:30",
    location: "Pelican Point Estuary Reserve",
    category: "Environment & Nature",
    maxCapacity: 20,
    requiredSkills: ["Environmental Awareness", "Team Coordination", "Field Work"],
    registrationDeadline: "2026-10-18",
    organizerId: "org-1",
    organizerName: "Sarah Jenkins (EcoWarriors)",
    organizerEmail: "sarah@ecowarriors.org",
    status: "closed",
    imageUrl: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2026-09-28",
    shortPromotion: "Clean our shores, protect migrating birds, and restore coastal harmony."
  }
];

export const INITIAL_REGISTRATIONS: VolunteerRegistration[] = [
  {
    id: "reg-1",
    eventId: "evt-1",
    userId: "vol-1",
    userName: "Alex Morgan",
    userEmail: "alex.volunteer@example.com",
    selectedSkill: "Gardening",
    registrationDate: "2026-10-16 14:20",
    status: "Confirmed",
    notes: "Has 3 years experience with community gardens."
  },
  {
    id: "reg-2",
    eventId: "evt-1",
    userId: "vol-2",
    userName: "Emily Chen",
    userEmail: "emily.chen@example.com",
    selectedSkill: "Logistics",
    registrationDate: "2026-10-17 09:15",
    status: "Registered",
    notes: "Can bring a pickup truck if equipment hauling is needed."
  },
  {
    id: "reg-3",
    eventId: "evt-1",
    userId: "vol-3",
    userName: "David Kim",
    userEmail: "david.kim@example.com",
    selectedSkill: "First Aid",
    registrationDate: "2026-10-18 11:30",
    status: "Confirmed"
  },
  {
    id: "reg-4",
    eventId: "evt-2",
    userId: "vol-1",
    userName: "Alex Morgan",
    userEmail: "alex.volunteer@example.com",
    selectedSkill: "Basic Python/Scratch",
    registrationDate: "2026-10-19 16:45",
    status: "Registered"
  },
  {
    id: "reg-5",
    eventId: "evt-3",
    userId: "vol-4",
    userName: "Jordan Taylor",
    userEmail: "jordan.t@example.com",
    selectedSkill: "Food Handling",
    registrationDate: "2026-10-15 10:00",
    status: "Confirmed"
  },
  {
    id: "reg-6",
    eventId: "evt-3",
    userId: "vol-5",
    userName: "Sophia Rodriguez",
    userEmail: "sophia.r@example.com",
    selectedSkill: "Organization",
    registrationDate: "2026-10-19 13:10",
    status: "Registered"
  },
  {
    id: "reg-7",
    eventId: "evt-6",
    userId: "vol-1",
    userName: "Alex Morgan",
    userEmail: "alex.volunteer@example.com",
    selectedSkill: "Field Work",
    registrationDate: "2026-10-10 12:00",
    status: "Attended"
  }
];

export const DEMO_USERS: UserProfile[] = [
  {
    id: "org-1",
    name: "Sarah Jenkins",
    email: "organizer@demo.com",
    role: "organizer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    bio: "Passionate environmental community organizer leading green initiatives and volunteer drives for over 6 years.",
    skills: ["Project Management", "Volunteer Coordination", "Public Speaking"],
    interests: ["Environment", "Youth Education", "Urban Ecology"]
  },
  {
    id: "vol-1",
    name: "Alex Morgan",
    email: "volunteer@demo.com",
    role: "volunteer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    bio: "Dedicated civic volunteer, passionate about tree planting, coding literacy, and food distribution. Eager to help in every weekend event!",
    skills: ["Gardening", "Basic Python/Scratch", "Logistics", "First Aid"],
    interests: ["Environment & Nature", "Education & Tutoring", "Community & Social"]
  }
];
