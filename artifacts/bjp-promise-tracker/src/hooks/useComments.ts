import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Comment {
  _id: string;
  promiseId: string;
  author: string;
  text: string;
  sentiment: "positive" | "negative" | "neutral";
  createdAt: string;
}

const API_BASE = "/api";

async function fetchComments(promiseId: string): Promise<Comment[]> {
  const res = await fetch(`${API_BASE}/comments/${promiseId}`);
  if (!res.ok) throw new Error("Failed to fetch comments");
  return res.json();
}

async function postComment(data: {
  promiseId: string;
  author: string;
  text: string;
  sentiment: Comment["sentiment"];
}): Promise<Comment> {
  const res = await fetch(`${API_BASE}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to post comment");
  return res.json();
}

async function deleteCommentById(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/comments/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete comment");
}

export function useComments(promiseId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["comments", promiseId];

  const { data: comments = [], isLoading } = useQuery<Comment[]>({
    queryKey,
    queryFn: () => fetchComments(promiseId),
  });

  const addMutation = useMutation({
    mutationFn: postComment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCommentById,
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const addComment = useCallback(
    (author: string, text: string, sentiment: Comment["sentiment"]) => {
      addMutation.mutate({ promiseId, author, text, sentiment });
    },
    [promiseId, addMutation]
  );

  const deleteComment = useCallback(
    (id: string) => {
      deleteMutation.mutate(id);
    },
    [deleteMutation]
  );

  return {
    comments,
    isLoading,
    addComment,
    deleteComment,
    isPosting: addMutation.isPending,
  };
}

export function useCommentCount(promiseId: string): number {
  const queryClient = useQueryClient();
  const cached = queryClient.getQueryData<Comment[]>(["comments", promiseId]);
  const [localCount] = useState(0);
  return cached?.length ?? localCount;
}
