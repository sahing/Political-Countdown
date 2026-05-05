import { PromiseStatus, STATUS_CONFIG } from "@/data/promises";
import { Filter } from "lucide-react";

type FilterValue = "all" | PromiseStatus;

interface FilterBarProps {
  active: FilterValue;
  onChange: (val: FilterValue) => void;
  counts: Record<string, number>;
}

const FILTERS: { value: FilterValue; label: string; shortLabel: string }[] = [
  { value: "all", label: "All Promises", shortLabel: "All" },
  { value: "pending", label: STATUS_CONFIG.pending.label, shortLabel: "Pending" },
  { value: "partial", label: STATUS_CONFIG.partial.label, shortLabel: "Partial" },
  { value: "fulfilled", label: STATUS_CONFIG.fulfilled.label, shortLabel: "Done" },
  { value: "broken", label: STATUS_CONFIG.broken.label, shortLabel: "Broken" },
];

export function FilterBar({ active, onChange, counts }: FilterBarProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-1.5 mb-2 sm:hidden">
        <Filter className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">Filter by status</span>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
        <span className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-muted-foreground shrink-0">
          <Filter className="w-3.5 h-3.5" />
          Filter:
        </span>
        {FILTERS.map(({ value, label, shortLabel }) => {
          const isActive = active === value;
          const count = counts[value] ?? 0;
          return (
            <button
              key={value}
              data-testid={`filter-${value}`}
              onClick={() => onChange(value)}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold border transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card text-muted-foreground border-card-border hover:bg-accent hover:text-foreground"
              }`}
            >
              <span className="sm:hidden">{shortLabel}</span>
              <span className="hidden sm:inline">{label}</span>
              <span
                className={`inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full text-xs font-bold ${
                  isActive ? "bg-white/25 text-white" : "bg-muted text-muted-foreground"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
