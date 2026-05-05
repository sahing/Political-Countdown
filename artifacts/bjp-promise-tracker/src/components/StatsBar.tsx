import { BJPPromise, STATUS_CONFIG, PromiseStatus } from "@/data/promises";
import { CheckCircle2, Clock, AlertTriangle, XCircle } from "lucide-react";

interface StatsBarProps {
  promises: BJPPromise[];
}

const ICONS: Record<PromiseStatus, React.ReactNode> = {
  fulfilled: <CheckCircle2 className="w-4 h-4" />,
  partial: <AlertTriangle className="w-4 h-4" />,
  pending: <Clock className="w-4 h-4" />,
  broken: <XCircle className="w-4 h-4" />,
};

export function StatsBar({ promises }: StatsBarProps) {
  const counts = (["fulfilled", "partial", "pending", "broken"] as PromiseStatus[]).map((status) => ({
    status,
    count: promises.filter((p) => p.status === status).length,
    ...STATUS_CONFIG[status],
  }));

  const total = promises.length;
  const fulfilledCount = counts.find((c) => c.status === "fulfilled")?.count ?? 0;
  const progressPct = total > 0 ? Math.round((fulfilledCount / total) * 100) : 0;

  return (
    <div className="bg-card border border-card-border rounded-2xl p-5 shadow-sm">
      <div className="flex flex-wrap gap-3 mb-4">
        {counts.map(({ status, count, label, color, bg, border }) => (
          <div
            key={status}
            data-testid={`stats-${status}`}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${bg} ${border}`}
          >
            <span className={color}>{ICONS[status]}</span>
            <span className={`text-sm font-bold ${color}`}>{count}</span>
            <span className={`text-xs ${color} opacity-80`}>{label}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border bg-muted border-muted-border">
          <span className="text-sm font-bold text-muted-foreground">{total}</span>
          <span className="text-xs text-muted-foreground">Total Promises</span>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-muted-foreground">Overall Fulfillment</span>
          <span className="text-xs font-bold text-foreground">{progressPct}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            data-testid="progress-bar"
            className="h-full bg-gradient-to-r from-orange-500 to-green-500 rounded-full transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
