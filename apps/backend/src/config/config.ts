import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  port: process.env.PORT || 3000,
  origin: process.env.CORS_ORIGIN,
  coingecko: {
    url: process.env.COIN_GECKO_API_URL,
    apiKey: process.env.COIN_GECKO_API_KEY,
  },
};

if (!config.coingecko.apiKey) {
  console.warn('Warning: No CoinGecko API key found in environment variables.');
}

export default config;