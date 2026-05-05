import { useState, useMemo } from "react";
import { CountdownBanner } from "@/components/CountdownBanner";
import { StatsBar } from "@/components/StatsBar";
import { FilterBar } from "@/components/FilterBar";
import { PromiseCard } from "@/components/PromiseCard";
import { usePromises, type PromiseStatus } from "@/hooks/usePromises";
import { Search, ExternalLink, Loader2, ShieldCheck } from "lucide-react";
import { useLocation } from "wouter";

type FilterValue = "all" | PromiseStatus;

export default function Home() {
  const [filter, setFilter] = useState<FilterValue>("all");
  const [search, setSearch] = useState("");
  const [, setLocation] = useLocation();
  const { data: promises = [], isLoading } = usePromises();

  const filtered = useMemo(() => {
    let list = promises;
    if (filter !== "all") list = list.filter((p) => p.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.titleEnglish.toLowerCase().includes(q) ||
          p.titleBengali.toLowerCase().includes(q) ||
          p.descriptionEnglish.toLowerCase().includes(q)
      );
    }
    return list;
  }, [promises, filter, search]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: promises.length };
    promises.forEach((p) => { c[p.status] = (c[p.status] ?? 0) + 1; });
    return c;
  }, [promises]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8 md:py-10 space-y-4 sm:space-y-5">

        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-700 border border-orange-200 rounded-full text-xs font-semibold tracking-wide uppercase">
            West Bengal 2025
          </span>
        </div>

        <CountdownBanner />

        <StatsBar promises={promises} />

        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            data-testid="input-search"
            type="search"
            placeholder="Search promises..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-input bg-card focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <FilterBar active={filter} onChange={setFilter} counts={counts} />

        <p className="text-xs text-muted-foreground font-medium">
          Showing {filtered.length} of {promises.length} promises
        </p>

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading promises...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No promises found</p>
            <p className="text-sm mt-1">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            {filtered.map((promise) => (
              <PromiseCard key={promise._id} promise={promise} />
            ))}
          </div>
        )}

        <footer className="text-center pt-5 border-t border-border space-y-1">
          <p className="text-xs text-muted-foreground">
            Tracking BJP's key promises made before the 2025 West Bengal elections.
          </p>
          <p className="text-xs text-muted-foreground">
            Comments are shared across all visitors via MongoDB.
          </p>
          <div className="pt-1 flex items-center justify-center gap-3">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <ExternalLink className="w-3 h-3" />
              <span>Source: BJP Sankalp Patra 2025</span>
            </div>
            <button
              onClick={() => setLocation("/admin")}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ShieldCheck className="w-3 h-3" />
              Admin
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
