import config from "../config/config";
import { Price } from "@/types/types";

class PriceService {
  public data: Price[] = [];

  private readonly COINGECKO_URL = config.coingecko.url;
  private readonly COINGECKO_API_KEY = config.coingecko.apiKey;
  private readonly COINGECKO_HEADERS = {
    accept: "application/json",
    "x-cg-demo-api-key": this.COINGECKO_API_KEY!,
  };

  constructor(private fetchInterval: number = 3000) {
    this.validateConfig();
  }

  private validateConfig(): void {
    if (!this.COINGECKO_URL || !this.COINGECKO_API_KEY) {
      throw new Error("Coingecko API URL or API Key is missing in config");
    }
  }

  private async fetchData(): Promise<void> {
    try {
      const response = await fetch(
        `${this.COINGECKO_URL}?ids=bitcoin%2Cethereum%2Cdogecoin&vs_currencies=eur`,
        {
          method: "GET",
          headers: this.COINGECKO_HEADERS,
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }

      const data: Omit<Price, "timestamp"> = await response.json();
      this.data.push({ ...data, timestamp: Date.now() });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  public async run(): Promise<void> {
    try {
      await this.fetchData();
      setInterval(() => {
        this.fetchData().catch((error) =>
          console.error("Error fetching data:", error)
        );
      }, this.fetchInterval);
    } catch (error) {
      console.error("Initial fetch failed:", error);
    }
  }
}

export default new PriceService();
