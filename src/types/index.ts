export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'organizer' | 'volunteer';
  avatar?: string;
  bio?: string;
  skills?: string[];
  interests?: string[];
  phone?: string;
}

export type ParticipationStatus = 'Registered' | 'Confirmed' | 'Attended' | 'Cancelled';

export interface VolunteerRegistration {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  selectedSkill: string;
  registrationDate: string; // ISO format or readable
  status: ParticipationStatus;
  notes?: string;
}

export type EventCategory = 
  | 'Community & Social'
  | 'Environment & Nature'
  | 'Education & Tutoring'
  | 'Health & Wellness'
  | 'Disaster Relief'
  | 'Arts & Culture';

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  eventDate: string; // YYYY-MM-DD
  eventTime: string; // HH:mm
  location: string;
  category: EventCategory;
  maxCapacity: number;
  requiredSkills: string[];
  registrationDeadline: string; // YYYY-MM-DD
  organizerId: string;
  organizerName: string;
  organizerEmail: string;
  status: 'draft' | 'published' | 'closed';
  imageUrl?: string;
  createdAt: string;
  shortPromotion?: string;
}
