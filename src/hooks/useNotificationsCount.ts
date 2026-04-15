import { useQuery } from "@tanstack/react-query";

async function fetchNotificationsCount() {
  try {
    const res = await fetch("/api/notifications/count");
    if (!res.ok) throw new Error("Network error");
    const data = await res.json();
    return typeof data.count === "number" ? data.count : 0;
  } catch (e) {
    // Fall back to a mocked value (0) when no backend is present
    return 0;
  }
}

export function useNotificationsCount() {
  return useQuery({
    queryKey: ["notificationsCount"],
    queryFn: fetchNotificationsCount,
    refetchInterval: 60_000, // refresh every minute
    staleTime: 30_000,
    retry: 1,
  });
}
