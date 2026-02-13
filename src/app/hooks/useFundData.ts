import { useQuery } from "@tanstack/react-query";
import type { AllFundsResponse } from "@/lib/types";

export function useFundData() {
  return useQuery<AllFundsResponse>({
    queryKey: ["funds"],
    queryFn: async () => {
      const response = await fetch("/api/funds");
      if (!response.ok) throw new Error("Failed to fetch fund data");
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
