"use client";
import { useEffect, useState } from "react";

export async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const detail = typeof body?.detail === "string" ? body.detail : null;
    throw new Error(detail || (response.status === 404
      ? "This item is not available. Choose another lesson or practice."
      : "We couldn’t connect to your workspace. Check that EditLab is running and try again."));
  }
  return response.json();
}
export function useResource<T>(url: string) {
  const [revision, setRevision] = useState(0);
  const key = `${url}:${revision}`;
  const [result, setResult] = useState<{ key: string; data?: T; error?: string }>({ key: "" });
  useEffect(() => {
    const controller = new AbortController();
    request<T>(url, { signal: controller.signal })
      .then(data => { if (!controller.signal.aborted) setResult({ key, data }); })
      .catch(error => { if (!controller.signal.aborted) setResult({ key, error: error.message }); });
    return () => controller.abort();
  }, [url, key]);
  return { data: result.key === key ? result.data : undefined, error: result.key === key ? result.error : undefined,
    loading: result.key !== key, reload: () => setRevision(value => value + 1) };
}
export function formatDate(value: string) {
  const date = new Date(value.includes("T") ? value : `${value.replace(" ", "T")}Z`);
  return Number.isNaN(date.getTime()) ? "Recent edit" : date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
export function formatTime(seconds: number) {
  const safe = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  return `${Math.floor(safe / 60).toString().padStart(2, "0")}:${Math.floor(safe % 60).toString().padStart(2, "0")}`;
}

