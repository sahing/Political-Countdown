import { PromiseStatus, STATUS_CONFIG } from "@/data/promises";
import { Filter } from "lucide-react";

type FilterValue = "all" | PromiseStatus;

interface FilterBarProps {
  active: FilterValue;
  onChange: (val: FilterValue) => void;
  counts: Record<string, number>;
}

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All Promises" },
  { value: "pending", label: STATUS_CONFIG.pending.label },
  { value: "partial", label: STATUS_CONFIG.partial.label },
  { value: "fulfilled", label: STATUS_CONFIG.fulfilled.label },
  { value: "broken", label: STATUS_CONFIG.broken.label },
];

export function FilterBar({ active, onChange, counts }: FilterBarProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground shrink-0">
        <Filter className="w-3.5 h-3.5" />
        Filter:
      </span>
      {FILTERS.map(({ value, label }) => {
        const isActive = active === value;
        const count = counts[value] ?? 0;
        return (
          <button
            key={value}
            data-testid={`filter-${value}`}
            onClick={() => onChange(value)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
              isActive
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-card text-muted-foreground border-card-border hover:bg-accent hover:text-foreground"
            }`}
          >
            {label}
            <span
              className={`inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full text-xs font-bold ${
                isActive ? "bg-white/25" : "bg-muted"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
