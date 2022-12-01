import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import AppContext from "../components/AppContext";
import { ICoin } from "../types";
import { List, Surface } from "react-native-paper";
interface Transaction {
	date: Date;
	type: "buy" | "sell";
	amount: number;
	price: number;
}
type Portfolio = {
	name: string;
	symbol: string;
	transactions: Transaction[];
}[];

const PortfolioJson: Portfolio = [
	{
		name: "Bitcoin",
		symbol: "BTC",
		transactions: [
			{
				date: new Date(2020, 1, 1),
				type: "buy",
				amount: 1,
				price: 10000,
			},
			{
				date: new Date(2021, 1, 2),
				type: "sell",
				amount: 0.5,
				price: 20000,
			},
			{
				date: new Date(2022, 1, 3),
				type: "buy",
				amount: 1,
				price: 15000,
			},
		],
	},
	{
		name: "Ethereum",
		symbol: "ETH",
		transactions: [
			{
				date: new Date(2020, 1, 1),
				type: "buy",
				amount: 1,
				price: 400,
			},
			// {
			// 	date: new Date(2021, 1, 2),
			// 	type: "sell",
			// 	amount: 0.5,
			// 	price: 4000,
			// },
		],
	},
];

export default function PortfolioScreen() {
	const { coins } = React.useContext(AppContext || null);
	const portfolio = PortfolioJson;
	const portfolioCoins = Object.keys(portfolio);
	console.log(coins);
	// let gananciaDelDia = "";
	let gananciaTotal = 0;
	let portfolioTotal = 0;
	let amount;
	let gananciaDelDia = 0;
	if (coins.length > 0) {
		// portolioTotal = portfolioCoins.reduce((acc, symbol) => {
		// 	const coin = portfolio[symbol];
		// 	const coinAmount = coin.transactions.reduce((acc, transaction) => {
		// 		if (transaction.type === "buy") {
		// 			return acc + transaction.amount;
		// 		} else {
		// 			return acc - transaction.amount;
		// 		}
		// 	}, 0);
		// 	const coinPrice = coins.find((item) => item.symbol === symbol).price;
		// 	return acc + coinAmount * coinPrice;
		// }, 0);
		// ganaciaDelDia = portfolioCoins
		// 	.reduce((acc, symbol) => {
		// 		const coin = portfolio[symbol];
		// 		const coinAmount = coin.transactions.reduce((acc, transaction) => {
		// 			if (transaction.type === "buy") {
		// 				return acc + transaction.amount;
		// 			} else {
		// 				return acc - transaction.amount;
		// 			}
		// 		}, 0);
		// 		const coinInfo = coins.find((item) => item.symbol === symbol);
		// 		return acc + coinAmount * ((coinInfo.price * coinInfo.change24h) / 100);
		// 	}, 0)
		// 	.toFixed(2);

		// gananciaTotal = portfolioCoins.reduce((acc, symbol) => {
		// 	const coin = portfolio[symbol];
		// 	let pnl = 0;
		// 	const coinAmount = coin.transactions.reduce((acc, transaction) => {
		// 		if (transaction.type === "buy") {
		// 			return acc + transaction.amount;
		// 		} else {
		// 			return acc - transaction.amount;
		// 		}
		// 	}, 0);
		// 	let aux = 0;
		// 	const coinAmountPNL = coin.transactions.reduce((acc, transaction) => {
		// 		if (transaction.type === "buy") {
		// 			aux = aux + transaction.amount;
		// 		} else {
		// 			aux = aux - transaction.amount;
		// 			return aux * transaction.price;
		// 		}
		// 	}, 0);
		// 	console.log(coinAmountPNL);
		// 	const coinInfo = coins.find((item) => item.symbol === symbol);
		// 	return acc + coinAmount * coinInfo.price + (coinAmountPNL || 0);
		// }, 0);
		// gananciaTotal = ((gananciaTotal / portolioTotal) * 100 - 100).toFixed(2);
		portfolio.forEach((item) => {
			let totalUSDofSell = 0;
			let totalUSDofBuy = 0;
			let symbol = item.symbol;
			let currentCoin = coins.find((coin) => coin.symbol === symbol);
			amount = item.transactions.reduce(
				(acc, transaction) => {
					if (transaction.type === "buy") {
						totalUSDofBuy =
							totalUSDofBuy + transaction.amount * transaction.price;
						return {
							amount: acc.amount + transaction.amount,
							price: currentCoin.price,
							date: transaction.date,
							type: "buy",
						};
					} else {
						totalUSDofSell =
							totalUSDofSell + transaction.amount * transaction.price;
						return {
							amount: acc.amount - transaction.amount,
							price: currentCoin.price,
							date: transaction.date,
							type: "sell",
						};
					}
				},
				{ amount: 0, price: 0, date: new Date(), type: "buy" },
			);
			console.log(
				totalUSDofSell,
				totalUSDofBuy,
				amount.amount * currentCoin.price,
			);
			gananciaTotal +=
				amount.amount * currentCoin.price + totalUSDofSell - totalUSDofBuy;
			console.log(gananciaTotal);
			portfolioTotal += amount.amount * amount.price;
			gananciaDelDia +=
				(amount.amount * currentCoin.price * currentCoin.change24h) / 100;
			// console.log(currentCoin.change24h);
		});

		// gananciaTotal = ((gananciaTotal + portfolioTotal) / portfolioTotal) * 100;
		gananciaDelDia = Math.floor(gananciaDelDia * 100) / 100;
		// console.log(
		// 	"portfolio",
		// 	aux,
		// 	portfolioTotal,
		// 	(gananciaDelDia / portfolioTotal) * 100,
		// );
	}

	const CarteraCard = () => {
		return (
			<View style={styles.container}>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						height: 100,
						backgroundColor: "#012136",
						padding: 10,
						borderRadius: 10,
					}}
				>
					<View
						style={{
							flexDirection: "column",
							justifyContent: "center",
						}}
					>
						<Text style={{ ...styles.text, paddingLeft: 40, color: "#fff" }}>
							${portfolioTotal.toFixed(2)}
						</Text>
						<Text style={{ ...styles.text, color: "gray" }}>
							Cartera Principal
						</Text>
					</View>
					<View
						style={{
							flexDirection: "column",
							// justifyContent: "center",
						}}
					>
						<View
							style={{
								flexDirection: "column",
								justifyContent: "flex-end",
								backgroundColor: "#012136",
								flex: 1,
								// padding: 10,
								// borderRadius: 10,
							}}
						>
							<Text style={{ ...styles.text, fontSize: 12, color: "gray" }}>
								Ganancia Total
							</Text>
							<Text style={{ ...styles.text, paddingLeft: 40, color: "#fff" }}>
								{gananciaTotal.toFixed(2)}
							</Text>
						</View>
						<View
							style={{
								flexDirection: "column",
								justifyContent: "flex-end",
								// height: 100,
								backgroundColor: "#012136",
								padding: 10,
								borderRadius: 10,
							}}
						>
							<Text style={{ ...styles.text, fontSize: 12 }}>
								Ganacia del dia{" "}
							</Text>
							<Text
								style={{ ...styles.text, fontSize: 10, alignSelf: "flex-end" }}
							>
								${gananciaDelDia}{" "}
							</Text>
						</View>
					</View>
				</View>
			</View>
		);
	};

	const CoinCard = () => {
		return (
			<View
				style={{
					display: "flex",
					flexDirection: "column",
					height: 200,
					backgroundColor: "#c9dfee",
					// padding: 10,
					borderRadius: 10,
				}}
			>
				{portfolio.map((coin) => {
					const coinAmount = coin.transactions.reduce((acc, transaction) => {
						if (transaction.type === "buy") {
							return acc + transaction.amount;
						} else {
							return acc - transaction.amount;
						}
					}, 0);
					const coinPrice =
						coins.find((item) => item.symbol === coin.symbol).price || 0;
					return (
						<Surface
							style={{
								backgroundColor: "#280776",
								display: "flex",
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "center",
								height: 50,
							}}
							key={coin.symbol}
						>
							<View>
								<Text style={{ fontSize: 16, color: "#FFF" }}>
									{coin.symbol}
								</Text>
								<Text style={{ fontSize: 12, color: "#f0d59b" }}>
									<Text style={{ fontSize: 8 }}>cant:</Text>
									{coinAmount}
								</Text>
							</View>

							{/* <View>
								<Text style={{ fontSize: 16, color: "#FFF" }}>
									Porcentaje de ganancia total:
									{(
										((coinPrice * coinAmount -
											coin.transactions.reduce((acc, transaction) => {
												return acc + transaction.amount * transaction.price;
											}, 0)) /
											coin.transactions.reduce((acc, transaction) => {
												return acc + transaction.amount * transaction.price;
											}, 0)) *
										100
									).toFixed(2)}
									%
								</Text>
								<Text style={{ fontSize: 12, color: "#f0d59b" }}>
									{coinAmount}
								</Text>
							</View> */}

							<View>
								<Text style={{ fontSize: 16, color: "#fff" }}>
									${coinPrice}
								</Text>
								<Text
									style={{
										fontSize: 12,
										color: "#f0d59b",
										alignSelf: "flex-end",
									}}
								>
									${(coinAmount * coinPrice).toFixed(2)}
								</Text>
							</View>
						</Surface>
					);
				})}
			</View>
		);
	};

	return (
		<SafeAreaView style={{ display: "flex" }}>
			{coins.length > 0 && (
				<>
					<CarteraCard />
					<CoinCard />
				</>
			)}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		// flex: 1,
		backgroundColor: "#cc3e82",
		// alignItems: "center",
		justifyContent: "center",
		width: "80%",
		alignSelf: "center",
		borderRadius: 10,
		color: "#fff",
	},
	text: {
		fontSize: 20,
		color: "#fff",
	},
});
