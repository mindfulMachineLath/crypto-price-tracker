import { Request, Response } from "express";
import priceService from "../service/priceService";
import { Price, CoinId } from "@/types/types";
import config from "../config/config";

class PriceController {
  private readonly defaultMinutes: number = Number(config.defaultMinutes);
  public getPrice = async (req: Request, res: Response): Promise<void> => {
    try {
      const coinId = this.validateCoinId(req.params.coinId);
      const minutes = this.validateMinutes(req.query.minutes);
      const priceData = this.getPriceDataWithinTimeRange(coinId, minutes);

      if (priceData.length === 0) {
        res.status(200).json({
          count: 0,
          latest: { eur: 0 },
          history: [],
          average: { eur: 0 },
        });
        return;
      }

      const responsePayload = this.constructResponsePayload(priceData, coinId);
      res.status(200).json(responsePayload);

    } catch (error) {
      console.error("Error fetching price data:", error);
      if (error instanceof ClientError) {
        res.status(400).json({ error: error.message });
      } else if (error instanceof Error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
      } else {
        res.status(500).json({ error: "Internal Server Error", details: "An unknown error occurred" });
      }
    }
  }

  private validateCoinId(coinId: string): CoinId {
    if (!["bitcoin", "ethereum", "dogecoin"].includes(coinId)) {
      throw new ClientError("Invalid coin ID");
    }
    return coinId as CoinId;
  }

  private validateMinutes(minutes: any): number {
    if (minutes === 'undefined' || minutes === 'null' || minutes === '') {
      return this.defaultMinutes;
    }

    const minutesNumber = Number(minutes);
    if (isNaN(minutesNumber) || minutesNumber < 0) {
      throw new ClientError("Invalid minutes parameter; it must be a positive number greater than 0");
    }
    return minutesNumber;
  }

  private getPriceDataWithinTimeRange(coinId: CoinId, minutes: number): Price[] {
    const currentTime = Date.now();
    return priceService.data
      .filter(data => currentTime - data.timestamp <= minutes * 60 * 1000)
      .map(data => ({
        timestamp: data.timestamp,
        [coinId]: data[coinId],
      })) as Price[];
  }

  private constructResponsePayload(priceData: Price[], coinId: CoinId) {
    const latestPrice = priceData[priceData.length - 1][coinId];
    const averagePrice = priceData.reduce((acc, cVal) => acc + cVal[coinId].eur, 0) / priceData.length;

    return {
      count: priceData.length,
      latest: latestPrice,
      history: priceData,
      average: { eur: averagePrice },
    };
  }
}

class ClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ClientError";
  }
}

export default new PriceController();
