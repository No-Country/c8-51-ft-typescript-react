export interface ICoin {
    name: string,
    symbol: string,
    price: number,
    change24h: number,
    isFav: boolean,
    img?: string
}