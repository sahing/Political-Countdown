import { useState } from "react";
import { MessageCircle, ChevronDown, ChevronUp, Trash2, Send, ThumbsUp, ThumbsDown, Minus, Loader2 } from "lucide-react";
import type { PromiseItem } from "@/hooks/usePromises";
import { STATUS_CONFIG } from "@/data/promises";
import { useComments, type Comment } from "@/hooks/useComments";

interface PromiseCardProps {
  promise: PromiseItem;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const SENTIMENT_ICONS = {
  positive: <ThumbsUp className="w-3.5 h-3.5" />,
  negative: <ThumbsDown className="w-3.5 h-3.5" />,
  neutral: <Minus className="w-3.5 h-3.5" />,
};

const SENTIMENT_COLORS: Record<Comment["sentiment"], string> = {
  positive: "text-green-600 bg-green-50 border-green-200",
  negative: "text-red-600 bg-red-50 border-red-200",
  neutral: "text-gray-600 bg-gray-50 border-gray-200",
};

export function PromiseCard({ promise }: PromiseCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [authorInput, setAuthorInput] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const [sentiment, setSentiment] = useState<Comment["sentiment"]>("neutral");
  const { comments, isLoading, addComment, deleteComment, isPosting } = useComments(promise.slug);

  const statusCfg = STATUS_CONFIG[promise.status];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!commentInput.trim() || isPosting) return;
    addComment(authorInput, commentInput, sentiment);
    setCommentInput("");
    setAuthorInput("");
    setSentiment("neutral");
  }

  return (
    <div
      data-testid={`card-promise-${promise.slug}`}
      className="bg-card border border-card-border rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
    >
      <div className={`h-1.5 w-full bg-gradient-to-r ${promise.color}`} />

      <div className="p-4 sm:p-5 flex-1">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-2xl sm:text-3xl shrink-0 mt-0.5" role="img" aria-label={promise.titleEnglish}>
            {promise.icon}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-sm sm:text-base leading-tight text-foreground">
                {promise.titleBengali}
              </h3>
              <span
                data-testid={`status-${promise.slug}`}
                className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${statusCfg.color} ${statusCfg.bg} ${statusCfg.border}`}
              >
                {statusCfg.label}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{promise.titleEnglish}</p>
          </div>
        </div>

        <div className={`inline-flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r ${promise.color} text-white text-sm font-bold mb-3`}>
          {promise.amount}
        </div>

        <p className="text-sm text-foreground/80 mb-1 leading-relaxed">{promise.descriptionBengali}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{promise.descriptionEnglish}</p>
      </div>

      <div className="border-t border-border">
        <button
          data-testid={`toggle-comments-${promise.slug}`}
          onClick={() => setShowComments((v) => !v)}
          className="w-full flex items-center justify-between px-4 sm:px-5 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 shrink-0" />
            {isLoading ? "Loading..." : comments.length > 0 ? `${comments.length} Comment${comments.length !== 1 ? "s" : ""}` : "Add Comment"}
          </span>
          {showComments ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showComments && (
          <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-3">
            <form onSubmit={handleSubmit} className="space-y-2">
              <input
                data-testid={`input-author-${promise.slug}`}
                type="text"
                placeholder="Your name (optional)"
                value={authorInput}
                onChange={(e) => setAuthorInput(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <textarea
                data-testid={`input-comment-${promise.slug}`}
                placeholder="Share your thoughts on this promise..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
              />
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs text-muted-foreground shrink-0">Sentiment:</span>
                  {(["positive", "neutral", "negative"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      data-testid={`sentiment-${s}-${promise.slug}`}
                      onClick={() => setSentiment(s)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs border transition-all ${
                        sentiment === s ? SENTIMENT_COLORS[s] + " font-semibold" : "text-muted-foreground bg-background border-border hover:bg-accent"
                      }`}
                    >
                      {SENTIMENT_ICONS[s]}
                      <span className="capitalize">{s}</span>
                    </button>
                  ))}
                </div>
                <button
                  type="submit"
                  data-testid={`submit-comment-${promise.slug}`}
                  disabled={!commentInput.trim() || isPosting}
                  className="w-full sm:w-auto sm:ml-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                >
                  {isPosting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  {isPosting ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </form>

            {isLoading ? (
              <div className="flex items-center justify-center py-4 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span className="text-sm">Loading comments...</span>
              </div>
            ) : comments.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {comments.map((comment) => (
                  <div
                    key={comment._id}
                    data-testid={`comment-${comment._id}`}
                    className="group relative bg-muted/50 rounded-xl px-3 py-2.5"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 flex-wrap min-w-0">
                        <span className="text-sm font-semibold text-foreground truncate">{comment.author}</span>
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs border shrink-0 ${SENTIMENT_COLORS[comment.sentiment]}`}>
                          {SENTIMENT_ICONS[comment.sentiment]}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{timeAgo(comment.createdAt)}</span>
                        <button
                          data-testid={`delete-comment-${comment._id}`}
                          onClick={() => deleteComment(comment._id)}
                          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all p-0.5"
                          title="Delete comment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">{comment.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground py-2">No comments yet. Be the first!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
