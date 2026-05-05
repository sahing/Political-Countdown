import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface PromiseItem {
  _id: string;
  slug: string;
  icon: string;
  titleBengali: string;
  titleEnglish: string;
  descriptionBengali: string;
  descriptionEnglish: string;
  amount: string;
  category: string;
  status: "pending" | "partial" | "fulfilled" | "broken";
  color: string;
  order: number;
}

export type PromiseStatus = PromiseItem["status"];

const API = "/api";

async function fetchPromises(): Promise<PromiseItem[]> {
  const res = await fetch(`${API}/promises`);
  if (!res.ok) throw new Error("Failed to fetch promises");
  return res.json();
}

async function createPromise(data: Omit<PromiseItem, "_id">, password: string): Promise<PromiseItem> {
  const res = await fetch(`${API}/promises`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Admin-Password": password },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || "Failed to create promise");
  }
  return res.json();
}

async function updatePromise(
  id: string,
  data: Partial<PromiseItem>,
  password: string
): Promise<PromiseItem> {
  const res = await fetch(`${API}/promises/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", "X-Admin-Password": password },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update promise");
  return res.json();
}

async function deletePromise(id: string, password: string): Promise<void> {
  const res = await fetch(`${API}/promises/${id}`, {
    method: "DELETE",
    headers: { "X-Admin-Password": password },
  });
  if (!res.ok) throw new Error("Failed to delete promise");
}

export function usePromises() {
  return useQuery<PromiseItem[]>({
    queryKey: ["promises"],
    queryFn: fetchPromises,
    staleTime: 30_000,
  });
}

export function useCreatePromise(password: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<PromiseItem, "_id">) => createPromise(data, password),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["promises"] }),
  });
}

export function useUpdatePromise(password: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PromiseItem> }) =>
      updatePromise(id, data, password),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["promises"] }),
  });
}

export function useDeletePromise(password: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePromise(id, password),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["promises"] }),
  });
}
