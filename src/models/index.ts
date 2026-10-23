import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
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

const UserSchema = new Schema<IUser>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['organizer', 'volunteer'], default: 'volunteer' },
    avatar: { type: String },
    bio: { type: String },
    skills: { type: [String], default: [] },
    interests: { type: [String], default: [] },
    phone: { type: String }
  },
  { timestamps: true }
);

export const UserModel = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export interface IEvent extends Document {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  eventTime: string;
  location: string;
  category: string;
  maxCapacity: number;
  requiredSkills: string[];
  registrationDeadline: string;
  organizerId: string;
  organizerName: string;
  organizerEmail: string;
  status: 'draft' | 'published' | 'closed';
  imageUrl?: string;
  createdAt: string;
  shortPromotion?: string;
}

const EventSchema = new Schema<IEvent>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    eventDate: { type: String, required: true },
    eventTime: { type: String, default: "09:00" },
    location: { type: String, required: true },
    category: { type: String, required: true },
    maxCapacity: { type: Number, required: true },
    requiredSkills: { type: [String], default: [] },
    registrationDeadline: { type: String, required: true },
    organizerId: { type: String, required: true },
    organizerName: { type: String, required: true },
    organizerEmail: { type: String, required: true },
    status: { type: String, enum: ['draft', 'published', 'closed'], default: 'published' },
    imageUrl: { type: String },
    createdAt: { type: String, default: () => new Date().toISOString().split("T")[0] },
    shortPromotion: { type: String }
  },
  { timestamps: true }
);

export const EventModel = mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);

export interface IRegistration extends Document {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  selectedSkill: string;
  registrationDate: string;
  status: 'Registered' | 'Confirmed' | 'Attended' | 'Cancelled';
  notes?: string;
}

const RegistrationSchema = new Schema<IRegistration>(
  {
    id: { type: String, required: true, unique: true },
    eventId: { type: String, required: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    selectedSkill: { type: String, required: true },
    registrationDate: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['Registered', 'Confirmed', 'Attended', 'Cancelled'], 
      default: 'Registered' 
    },
    notes: { type: String }
  },
  { timestamps: true }
);

export const RegistrationModel = 
  mongoose.models.Registration || mongoose.model<IRegistration>("Registration", RegistrationSchema);
