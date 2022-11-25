import { useEffect } from 'react';
import { ICoin } from '../types';

export function useFetchBinance(allCoins, setAllCoins) {
  const timer = 1000 * 60 * 5; // 5 minutes
  const fetchBinance = () => {
    console.log('fetch');
    fetch(
      'https://api.binance.com/api/v3/ticker/24hr?symbols=[%22BTCUSDT%22,%22BNBUSDT%22,%22ETHUSDT%22,%22ADAUSDT%22,%22LTCUSDT%22]',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
      .then((res) => {
        res.json().then((data) => {
          const coins: ICoin[] = data.map((item) => {
            const [symbol] = item.symbol.split('USDT');
            const name = 'USDT';
            return {
              name,
              symbol,
              price: Number(item.askPrice).toFixed(2),
              change24h: Number(item.priceChangePercent).toFixed(2),
              isFav: false,
            };
          });
          setAllCoins(coins);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (allCoins.length === 0) {
      fetchBinance();
    }
  }, []);

  useEffect(() => {
    let interval = setInterval(() => {
      fetchBinance();
    }, timer);
    return () => clearInterval(interval);
  }, []);
}
