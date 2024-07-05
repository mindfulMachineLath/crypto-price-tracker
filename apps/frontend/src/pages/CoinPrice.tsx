import { useParams, useSearchParams } from 'react-router-dom';
import { usePriceQuery } from '../hooks/usePriceQuery';
import { CoinId } from '@/types/types';
import { useState } from 'react';

function CoinPrice() {
  const { coinId } = useParams<{ coinId: string }>();
  const [searchParams] = useSearchParams();
  const defaultMinutes = import.meta.env.VITE_DEFAULT_MINUTES || '60';
  const minutes = searchParams.get('minutes');
  const [minuteVal, setMinuteVal] = useState(minutes || defaultMinutes);

  const { data } = usePriceQuery(
    coinId as CoinId,
    minutes ? Number(minutes) : Number(defaultMinutes)
  );

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinuteVal(e.target.value);
  };

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
          Current Price: <span className="text-green-400">{(data?.latest.eur || 0).toFixed(2)} €</span>
        </div>
        <div>
          Average Price: <span className="text-green-400">{(data?.average.eur || 0).toFixed(2)} €</span>
        </div>
      </div>
    </div>
  );
}

export default CoinPrice;
