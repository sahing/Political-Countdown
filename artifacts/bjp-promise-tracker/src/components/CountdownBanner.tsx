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
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative px-5 py-7 sm:px-8 sm:py-9">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4 shrink-0 opacity-80" />
          <span className="text-xs sm:text-sm font-medium opacity-80">Since May 4, 2025 — Accountability Tracker</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-1 tracking-tight leading-tight">
          বিজেপির সংকল্পপত্র ট্র্যাকার
        </h1>
        <p className="text-sm sm:text-base opacity-85 mb-5 font-medium">
          BJP Promise Accountability Dashboard
        </p>

        <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-sm sm:max-w-lg">
          {[
            { value: totalDays, label: "Days", bengali: "দিন" },
            { value: hours, label: "Hours", bengali: "ঘণ্টা" },
            { value: minutes, label: "Min", bengali: "মিনিট" },
            { value: seconds, label: "Sec", bengali: "সেকেন্ড" },
          ].map(({ value, label, bengali }) => (
            <div
              key={label}
              data-testid={`countdown-${label.toLowerCase()}`}
              className="bg-white/20 backdrop-blur-sm rounded-xl p-2 sm:p-3 text-center border border-white/30"
            >
              <div className="text-2xl sm:text-3xl md:text-4xl font-black tabular-nums leading-none mb-1">
                {String(value).padStart(2, "0")}
              </div>
              <div className="text-[10px] sm:text-xs font-semibold opacity-80 uppercase tracking-wider">{label}</div>
              <div className="text-[10px] sm:text-xs opacity-70 font-medium">{bengali}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 sm:mt-6 flex items-start sm:items-center gap-2 text-xs sm:text-sm opacity-75">
          <Clock className="w-4 h-4 shrink-0 mt-0.5 sm:mt-0" />
          <span>Tracking {totalDays} day{totalDays !== 1 ? "s" : ""} of governance — Are the promises being kept?</span>
        </div>
      </div>
    </div>
  );
}
