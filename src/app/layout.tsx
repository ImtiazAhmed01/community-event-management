import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { EventProvider } from "@/context/EventContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "UnityServe | Community Event & Volunteer Management Platform",
  description: "Empowering local communities, organizers, and volunteers to create positive real-world impact together.",
  keywords: ["community", "volunteering", "events", "volunteer management", "nonprofit", "civic service"]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased suppressHydrationWarning`}>
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-emerald-500 selection:text-white transition-colors duration-200">
        <ThemeProvider>
          <AuthProvider>
            <EventProvider>
              <Suspense fallback={<div className="h-16 border-b" />}>
                <Navbar />
              </Suspense>
              <main className="flex-1">
                <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center">Loading...</div>}>
                  {children}
                </Suspense>
              </main>
              <Footer />
            </EventProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
