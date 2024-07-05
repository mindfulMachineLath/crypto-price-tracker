import { useQuery } from "@tanstack/react-query";
import { CoinId } from "@/types/types";

interface PriceData {
  latest: { eur: number };
  count: number;
  average: { eur: number };
  history: ({ [key in CoinId]: { eur: number } } & { timestamp: number })[];
}

const fetchPriceData = async (coinId: CoinId, minutes?: number): Promise<PriceData> => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const response = await fetch(
    `${backendUrl}/price/${coinId}?minutes=${minutes}`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch data for ${coinId}`);
  }
  const data: PriceData = await response.json();
  return data;
};

export const usePriceQuery = (coinId: CoinId, minutes?: number) => {
  const refetchInterval = Number(import.meta.env.VITE_REFETCH_INTERVAL);
  return useQuery({
    queryKey: ["priceData", coinId, minutes],
    queryFn: () => fetchPriceData(coinId, minutes),
    refetchInterval,
  });
};
