import { useParams, useSearchParams } from "react-router-dom";
import { usePriceQuery } from "../hooks/usePriceQuery";
import { CoinId } from "@/types/types";
import { useEffect, useState, useMemo } from "react";
import Chart from "react-apexcharts";

function CoinPrice() {
  const { coinId } = useParams<{ coinId: string }>();
  const [searchParams] = useSearchParams();
  const defaultMinutes = import.meta.env.VITE_DEFAULT_MINUTES || "60";
  const minutes = searchParams.get("minutes");
  const [minuteVal, setMinuteVal] = useState(minutes || defaultMinutes);
  const [seriesData, setSeriesData] = useState<ApexAxisChartSeries>([]);

  const { data, error, isLoading } = usePriceQuery(
    coinId as CoinId,
    minutes ? Number(minutes) : undefined
  );

  useEffect(() => {
    if (data) {
      const formattedSeriesData = data.history.map((price) => [
        price.timestamp,
        Number(
          price[coinId as CoinId].eur.toFixed(coinId == "dogecoin" ? 5 : 0)
        ),
      ]);
      setSeriesData([{ name: "Price", data: formattedSeriesData }]);
    }
  }, [data, coinId]);

  const minTime = useMemo(() => {
    if (data && data.history.length > 0) {
      return data.history[0].timestamp;
    }
    return (
      Date.now() - (minutes ? Number(minutes) * 60 * 1000 : defaultMinutes * 60 * 1000)
    );
  }, [data, minutes]);

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinuteVal(e.target.value);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading price data</div>;

  return (
    <div className="mt-10">
      <form>
        <div className="flex gap-5 justify-center items-center">
          <label htmlFor="minutes">Minutes:</label>
          <input
            type="number"
            id="minutes"
            name="minutes"
            value={minuteVal}
            onChange={handleMinutesChange}
            className="rounded-md p-2 border border-white"
            required
          />
        </div>
      </form>
      <div className="flex justify-between my-5">
        <div>
          Count: <span className="text-green-400">{data?.count || 0}</span>
        </div>
        <div>
          Current Price:{" "}
          <span className="text-green-400">
            {(data?.latest.eur || 0).toFixed(coinId === 'dogecoin' ? 5 : 2)} €
          </span>
        </div>
        <div>
          Average Price:{" "}
          <span className="text-green-400">
            {(data?.average.eur || 0).toFixed(coinId === 'dogecoin' ? 5 : 2)} €
          </span>
        </div>
      </div>
      <div className="h-72">
        <Chart
          series={seriesData}
          options={{
            chart: {
              id: "area-datetime",
              type: "area",
              height: 100,
              zoom: {
                autoScaleYaxis: true,
              },
            },
            dataLabels: {
              enabled: false,
            },
            xaxis: {
              type: "datetime",
              min: new Date(minTime).getTime(),
              tickAmount: 6,
            },
            tooltip: {
              x: {
                format: "dd MMM yyyy",
              },
              cssClass: "text-black",
              y: {
                title: {
                  formatter: () => "Price",
                },
                formatter: (value: number) => `${value} EUR`,
              },
            },
            fill: {
              type: "gradient",
              gradient: {
                shadeIntensity: 0,
                opacityFrom: 0.7,
                opacityTo: 0.9,
                stops: [0, 100],
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default CoinPrice;
