export type CoinId = "ethereum" | "bitcoin" | "dogecoin";

export type Price = {
  [key in CoinId]: { eur: number };
} & {
  timestamp: number;
};
