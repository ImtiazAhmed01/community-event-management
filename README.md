# UnityServe - Community Event & Volunteer Management Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black.svg?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS%204-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20Ready-FFCA28.svg?logo=firebase)](https://firebase.google.com/)

A modern, accessible, and responsive full-stack platform built with Next.js App Router designed to help community organizations organize events, define volunteer requirements, and match with passionate local volunteers.

---

## 📌 Features & Capabilities

### 1. Organizer Hub
- **Event Lifecycle Management**: Create, edit, publish, close registrations, or delete events.
- **Smart Event Attributes**:
  - Event Title & Detailed Description
  - Event Date & Scheduled Time
  - Location & Venue
  - 6 Civic Categories (*Environment & Nature, Community & Social, Education & Tutoring, Health & Wellness, Arts & Culture, Disaster Relief*)
  - Maximum Volunteer Capacity
  - Required Volunteer Skills & Responsibilities
  - Registration Deadline validation
- **Real-Time Volunteer Roster**: View all volunteers registered for any event (*Name, Email, Registration Date, Selected Skill, Participation Status*).
- **Status Updates**: Update volunteer statuses across 4 lifecycle stages:
  - `Registered`
  - `Confirmed`
  - `Attended`
  - `Cancelled`
- **Organizer Executive Dashboard**: 5 live metric counters:
  - Total Events
  - Upcoming Events
  - Total Registered Volunteers
  - Available Volunteer Slots
  - Completed Events
  - Live capacity progress bars and fast-action shortcuts.

### 2. Volunteer Hub
- **Discover & Filter Events**:
  - Live text search across titles and descriptions
  - Category pill filter
  - Upcoming vs. Past timeframe toggle
  - Location filtering
  - Required skill matching
- **Smart Registration Rules**:
  - Prevents duplicate registrations
  - Disables registration once capacity reaches zero
  - Enforces registration deadlines
  - Role-protected: Organizers cannot self-register as volunteers
- **My Events Portal**:
  - Tabbed breakdown of **Upcoming** and **Past** registrations
  - Self-service registration cancellation (automatically releases the slot back to the community)
  - Live status tracking
- **Digital QR Check-In Passes**:
  - Instant QR code generation with volunteer name, ticket ID, and event timestamp
  - Organizers can scan directly on mobile/tablet for contact-free attendance verification
  - 1-Click PNG ticket download

### 3. Smart AI Event Description Assistant
- Organizers can type a simple prompt (e.g., *"We want to organize a tree plantation program"*, *"Community coding workshop for kids"*, or *"Food distribution for seniors"*).
- The AI engine generates:
  - Engaging, structured event descriptions
  - Suggested volunteer roles & required skills
  - Recommended capacity limits & category classification
  - Short promotional marketing copy
- Organizers can inspect and edit the generated content before publishing.

### 4. Interactive Data Analytics (Recharts)
- **Visualizations**:
  - **Volunteer Registrations vs. Capacity**: Bar chart comparing registered volunteers against maximum capacities across initiatives.
  - **Events by Category**: Pie chart displaying civic category distributions.
  - **Participation Status Ratio**: Status distribution cards displaying percentages of Confirmed, Attended, Registered, and Cancelled volunteers.
  - **Overall Capacity Utilization**: Overall fill rate across all events.

### 5. Bonus Enhancements
- **Instant Persona Sandbox**: Switch effortlessly between Organizer (`Sarah`) and Volunteer (`Alex`) personas via the navigation bar to test authorization rules.
- **Event Bookmarks / Favorites**: Save events with heart toggles to a personal watchlist.
- **Approaching Event Reminders**: Banner reminder on the volunteer dashboard for impending events.
- **Volunteer Profile**: Bio, skills management, and participation badges.
- **1-Click Event Link Sharing**: Copies direct shareable URLs with clipboard feedback.
- **Responsive Dark/Light Mode**: Full theme switcher with system preference detection and localStorage persistence.

---

## 🔒 Authentication & Role-Based Authorization

### Multi-Tier Authentication
1. **Google OAuth (Sign In with Google)**:
   - Configured with Firebase Authentication.
   - Includes seamless development fallback mode while Firebase production keys are being populated.
2. **Email & Password Authentication**:
   - Complete credential registration and login with profile role assignment.
3. **1-Click Reviewer Persona Switcher**:
   - Allows instant role switching directly from the navbar or login screen to evaluate organizer vs. volunteer flows immediately.

### Protected Routes & Boundaries
- `/organizer/*` routes require the `organizer` role. Volunteers attempting access see an unauthorized access boundary.
- Volunteers cannot create, edit, or delete events.
- Organizers cannot register as volunteers.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Data Visualizations**: Recharts
- **QR Generator**: QRCode
- **Celebrations**: Canvas-Confetti
- **Authentication**: Firebase Auth + Custom Auth Provider

---

## 🚀 Getting Started Locally

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd event&volunteermanagement
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
```
*(Note: If placeholders are kept, the platform automatically activates seamless mock session handling so all Google SSO and credential workflows function without interruption).*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Edge Cases Handled

- **Full Capacity**: When an event fills up, registration is locked, slot counts turn red, and the UI displays "Capacity Full".
- **Duplicate Registration**: The system blocks any volunteer from signing up twice for the same event.
- **Registration Deadline**: Registrations are automatically disabled when the deadline date has elapsed.
- **Cancellation**: Cancelling an upcoming registration decrements the registered count and increments the open slot counter.
- **Past Events**: Marked with past status badges; cancellations are restricted for concluded initiatives.

---

## 📄 License
MIT License - Created for Community Organizations and Technical Instructors.
