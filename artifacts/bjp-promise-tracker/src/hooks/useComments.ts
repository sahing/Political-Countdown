import { useState, useEffect, useCallback } from "react";

export interface Comment {
  id: string;
  promiseId: string;
  author: string;
  text: string;
  timestamp: string;
  sentiment: "positive" | "negative" | "neutral";
}

const STORAGE_KEY = "bjp_promise_comments";

function loadComments(): Comment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Comment[];
  } catch {
    return [];
  }
}

function saveComments(comments: Comment[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
  } catch {
    // ignore storage errors
  }
}

export function useComments(promiseId: string) {
  const [allComments, setAllComments] = useState<Comment[]>(loadComments);

  useEffect(() => {
    saveComments(allComments);
  }, [allComments]);

  const comments = allComments.filter((c) => c.promiseId === promiseId);

  const addComment = useCallback(
    (author: string, text: string, sentiment: Comment["sentiment"]) => {
      const newComment: Comment = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        promiseId,
        author: author.trim() || "Anonymous",
        text: text.trim(),
        timestamp: new Date().toISOString(),
        sentiment,
      };
      setAllComments((prev) => [newComment, ...prev]);
    },
    [promiseId]
  );

  const deleteComment = useCallback((id: string) => {
    setAllComments((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return { comments, addComment, deleteComment };
}

export function useAllComments() {
  return useState<Comment[]>(loadComments)[0];
}
