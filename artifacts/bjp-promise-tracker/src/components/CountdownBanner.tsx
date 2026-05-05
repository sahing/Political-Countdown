import { useState, useEffect } from "react";
import { Calendar, Clock } from "lucide-react";

const POWER_DATE = new Date("2025-05-04T00:00:00");

function getElapsed() {
  const now = new Date();
  const diffMs = now.getTime() - POWER_DATE.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  return { totalDays, hours, minutes, seconds };
}

export function CountdownBanner() {
  const [elapsed, setElapsed] = useState(getElapsed());

  useEffect(() => {
    const timer = setInterval(() => setElapsed(getElapsed()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { totalDays, hours, minutes, seconds } = elapsed;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white shadow-xl">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>
      <div className="relative px-6 py-8 md:px-10 md:py-10">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4 opacity-80" />
          <span className="text-sm font-medium opacity-80">Since May 4, 2025 — Accountability Tracker</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-black mb-1 tracking-tight">
          বিজেপির সংকল্পপত্র ট্র্যাকার
        </h1>
        <p className="text-base md:text-lg opacity-85 mb-6 font-medium">
          BJP Promise Accountability Dashboard
        </p>

        <div className="grid grid-cols-4 gap-3 max-w-lg">
          {[
            { value: totalDays, label: "Days", bengali: "দিন" },
            { value: hours, label: "Hours", bengali: "ঘণ্টা" },
            { value: minutes, label: "Minutes", bengali: "মিনিট" },
            { value: seconds, label: "Seconds", bengali: "সেকেন্ড" },
          ].map(({ value, label, bengali }) => (
            <div
              key={label}
              data-testid={`countdown-${label.toLowerCase()}`}
              className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center border border-white/30"
            >
              <div className="text-3xl md:text-4xl font-black tabular-nums leading-none mb-1">
                {String(value).padStart(2, "0")}
              </div>
              <div className="text-xs font-semibold opacity-80 uppercase tracking-wider">{label}</div>
              <div className="text-xs opacity-70 font-medium">{bengali}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-2 text-sm opacity-75">
          <Clock className="w-4 h-4" />
          <span>Tracking {totalDays} day{totalDays !== 1 ? "s" : ""} of governance — Are the promises being kept?</span>
        </div>
      </div>
    </div>
  );
}
