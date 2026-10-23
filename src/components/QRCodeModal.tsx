"use client";

import React, { useEffect, useRef } from "react";
import QRCode from "qrcode";
import { Download, X } from "lucide-react";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle: string;
  volunteerName: string;
  registrationId: string;
  status: string;
}

export default function QRCodeModal({
  isOpen,
  onClose,
  eventTitle,
  volunteerName,
  registrationId,
  status
}: QRCodeModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const payload = JSON.stringify({
        ticketType: "VOLUNTEER_CHECKIN",
        registrationId,
        volunteerName,
        eventTitle,
        status,
        timestamp: new Date().toISOString()
      });

      QRCode.toCanvas(
        canvasRef.current,
        payload,
        {
          width: 240,
          margin: 2,
          color: {
            dark: "#065f46", // Emerald-800
            light: "#ffffff"
          }
        },
        (error) => {
          if (error) console.error("QR Code generation error:", error);
        }
      );
    }
  }, [isOpen, registrationId, volunteerName, eventTitle, status]);

  if (!isOpen) return null;

  const downloadQR = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `volunteer-pass-${registrationId}.png`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-800 p-6 shadow-2xl border border-zinc-200 dark:border-zinc-700 text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 mb-3">
          Event Check-In Pass
        </span>

        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1 line-clamp-1">
          {eventTitle}
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
          Volunteer: <strong className="text-zinc-800 dark:text-zinc-200">{volunteerName}</strong>
        </p>

        {/* QR Code Canvas */}
        <div className="flex justify-center my-3 p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
          <canvas ref={canvasRef} className="rounded-lg shadow-sm" />
        </div>

        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-5">
          Scan this QR code at the event entrance for fast, contact-free check-in.
        </div>

        <div className="flex gap-2">
          <button
            onClick={downloadQR}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md shadow-emerald-600/20 transition-all"
          >
            <Download className="w-4 h-4" />
            Save Ticket Pass
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
