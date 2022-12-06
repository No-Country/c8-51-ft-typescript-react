import { useEffect } from 'react';
import { ICoin } from '../types';
export const namesForSymbols = {
  BTC: 'Bitcoin',
  ETH: 'Ethereum',
  XRP: 'Ripple',
  BCH: 'Bitcoin Cash',
  LTC: 'Litecoin',
  EOS: 'EOS',
  BNB: 'Binance Coin',
  XLM: 'Stellar',
  TRX: 'Tron',
  ADA: 'Cardano',
  XMR: 'Monero',
  DASH: 'Dash',
  NEO: 'NEO',
  XTZ: 'Tezos',
  ETC: 'Ethereum Classic',
  MIOTA: 'IOTA',
  VET: 'VeChain',
  ONT: 'Ontology',
  QTUM: 'Qtum',
  ZEC: 'Zcash',
  ICX: 'ICON',
  ZIL: 'Zilliqa',
  BSV: 'Bitcoin SV',
  NANO: 'Nano',
  DOGE: 'Dogecoin',
};
// agrega 10 symbolos mas a este enlace 'https://api.binance.com/api/v3/ticker/24hr?symbols=[%22BTCUSDT%22,%22BNBUSDT%22,%22ETHUSDT%22,%22ADAUSDT%22,%22LTCUSDT%22]',
// y luego usa el método fetch para obtener los datos de la API de Binance.
//
const symbols = [
  'BTCUSDT',
  'BNBUSDT',
  'ETHUSDT',
  'ADAUSDT',
  'LTCUSDT',
  'XRPUSDT',
  'BCHUSDT',
  'EOSUSDT',
  'XLMUSDT',
  'TRXUSDT',
  'XTZUSDT',
  'VETUSDT',
  'ONTUSDT',
  'QTUMUSDT',
  'ZECUSDT',
  'ICXUSDT',
  'NANOUSDT',
  'DOGEUSDT',
];
const url = `https://api.binance.com/api/v3/ticker/24hr?symbols=${JSON.stringify(
  symbols,
)}`;
console.log(url);
export function useFetchBinance(allCoins, setAllCoins) {
  const timer = 1000 * 60 * 5; // 5 minutes
  const fetchBinance = () => {
    console.log('fetch');
    fetch(
      url,
      // 'https://api.binance.com/api/v3/ticker/24hr?symbols=[%22BTCUSDT%22,%22BNBUSDT%22,%22ETHUSDT%22,%22ADAUSDT%22,%22LTCUSDT%22]',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
      .then((res) => {
        res.json().then((data) => {
          console.log(data);
          const coins: ICoin[] = data.map((item) => {
            const [symbol] = item.symbol.split('USDT');
            const name = namesForSymbols[symbol];
            return {
              name,
              symbol,
              price: Number(item.askPrice).toFixed(2),
              change24h: Number(item.priceChangePercent).toFixed(2),
              isFav: false,
            };
          });
          setAllCoins([...coins]);
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
