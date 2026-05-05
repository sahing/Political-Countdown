import { STATUS_CONFIG, type PromiseStatus } from "@/data/promises";
import type { PromiseItem } from "@/hooks/usePromises";
import { CheckCircle2, Clock, AlertTriangle, XCircle } from "lucide-react";

interface StatsBarProps {
  promises: PromiseItem[];
}

const ICONS: Record<PromiseStatus, React.ReactNode> = {
  fulfilled: <CheckCircle2 className="w-4 h-4 shrink-0" />,
  partial: <AlertTriangle className="w-4 h-4 shrink-0" />,
  pending: <Clock className="w-4 h-4 shrink-0" />,
  broken: <XCircle className="w-4 h-4 shrink-0" />,
};

export function StatsBar({ promises }: StatsBarProps) {
  const counts = (["fulfilled", "partial", "pending", "broken"] as PromiseStatus[]).map((status) => ({
    status,
    count: promises.filter((p) => p.status === status).length,
    ...STATUS_CONFIG[status],
  }));

  const total = promises.length;
  const fulfilledCount = counts.find((c) => c.status === "fulfilled")?.count ?? 0;
  const partialCount = counts.find((c) => c.status === "partial")?.count ?? 0;
  const progressPct = total > 0 ? Math.round(((fulfilledCount + partialCount * 0.5) / total) * 100) : 0;

  return (
    <div className="bg-card border border-card-border rounded-2xl p-4 sm:p-5 shadow-sm">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
        {counts.map(({ status, count, label, bengali, color, bg, border }) => (
          <div
            key={status}
            data-testid={`stats-${status}`}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border ${bg} ${border}`}
          >
            <span className={color}>{ICONS[status]}</span>
            <div className="min-w-0">
              <div className={`text-lg font-black leading-none ${color}`}>{count}</div>
              <div className={`text-xs font-medium mt-0.5 truncate ${color} opacity-80`}>{label}</div>
              {bengali && (
                <div className={`text-[10px] mt-0.5 truncate ${color} opacity-60`}>{bengali}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="bg-muted rounded-xl px-3 py-2.5 flex items-center gap-2 shrink-0">
          <span className="text-lg font-black text-foreground leading-none">{total}</span>
          <span className="text-xs text-muted-foreground font-medium">Total</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-muted-foreground">Overall Fulfillment</span>
            <span className="text-xs font-bold text-foreground">{progressPct}%</span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              data-testid="progress-bar"
              className="h-full bg-gradient-to-r from-orange-500 to-green-500 rounded-full transition-all duration-700"
              style={{ width: `${Math.max(progressPct, progressPct > 0 ? 4 : 0)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
