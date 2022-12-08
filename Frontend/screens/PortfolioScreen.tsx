import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import AppContext from "../components/AppContext";
import { ICoin } from "../types";
import {
	ActivityIndicator,
	FAB,
	List,
	Portal,
	useTheme,
} from "react-native-paper";
import NewTransactionModal from "../components/NewTrasanctionModal";
import { Theme } from "../App";
export interface Transaction {
	date: Date;
	type: "buy" | "sell";
	amount: number;
	price: number;
}
export type Portfolio = {
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
			{
				date: new Date(2021, 1, 2),
				type: "sell",
				amount: 0.5,
				price: 4000,
			},
		],
	},
];

export default function PortfolioScreen() {
	const theme = useTheme<Theme>();
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
		contentStyle: {
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			backgroundColor: theme.colors.background,
			borderRadius: 20,
			padding: 20,
			width: "100%",
		},
		menuTouchable: {
			flexDirection: "row",
			justifyContent: "center",
			alignItems: "center",
			backgroundColor: theme.colors.backdrop,
			padding: 10,
			borderRadius: 10,
			margin: 10,
		},
	});
	const { coins, user, showFAB } = React.useContext(AppContext || null);
	const [portfolio, setPortfolio] = useState([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		if (loading) {
			console.log("loading portfolios", user.user[0].portfolio_id);
			fetch(
				"https://c8-51-ft-typescript-react-production.up.railway.app/api/portfolio/read",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						cors: "no-cors",
					},
					body: JSON.stringify({
						// userID: user.user[0].portfolio_id,
						portfolioID: user.user[0].portfolio_id,
					}),
				},
			)
				.then((res) => {
					return res.json();
				})
				.then((data) => {
					console.log(data);
					if (data.coins.length > 0) {
						console.log(data.coins[0].transactions);
						setPortfolio(
							data.coins.map((coin) => {
								return {
									name: coin.name,
									symbol: coin.symbol,
									transactions: coin.transactions.map((transaction) => {
										return {
											date: new Date(transaction.date),
											type: transaction.type,
											amount: Number(transaction.amount),
											price: Number(transaction.price),
											_id: transaction._id,
										};
									}),
								};
							}),
						);
					} else {
						setPortfolio([]);
					}
					setLoading(false);
				})
				.catch((err) => {
					setLoading(false);
					setPortfolio([]);

					console.log(err);
				});
		}
	}, [loading]);
	let gananciaTotal = 0;
	let portfolioTotal = 0;
	let amount;
	let gananciaDelDia = 0;
	if (coins.length > 0) {
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
			gananciaTotal +=
				amount.amount * currentCoin.price + totalUSDofSell - totalUSDofBuy;
			portfolioTotal += amount.amount * amount.price;
			gananciaDelDia +=
				(amount.amount * currentCoin.price * currentCoin.change24h) / 100;
		});
		gananciaDelDia = Math.floor(gananciaDelDia * 100) / 100;
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
						backgroundColor: "#04111d",
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
						}}
					>
						<View
							style={{
								flexDirection: "column",
								justifyContent: "flex-end",
								backgroundColor: "#04111d",
								flex: 1,
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
								backgroundColor: "#04111d",
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
		const [visible, setVisible] = useState(false);
		const showModal = () => setVisible(true);
		const [initialModalValues, setInitialModalValues] = useState({
			symbol: "",
			amount: "",
			price: "",
			date: null,
			type: null,
			_id: null,
		});
		const hideModal = () => {
			setVisible(false);
			setInitialModalValues({
				symbol: "",
				amount: "",
				price: "",
				date: null,
				type: null,
				_id: null,
			});
		};
		return (
			<>
				<Portal
					children={
						<FAB
							style={{
								display: showFAB ? "flex" : "none",
								position: "absolute",
								right: 16,
								bottom: 94,
								zIndex: 100,
								backgroundColor: theme.colors.accent,
							}}
							icon="plus"
							onPress={showModal}
						/>
					}
				/>
				<NewTransactionModal
					visible={visible}
					setVisible={setVisible}
					hideModal={hideModal}
					portfolio={portfolio}
					setPortfolio={setPortfolio}
					coins={coins}
					initialValues={initialModalValues}
					setLoading={setLoading}
				/>

				<ScrollView
					style={{
						display: "flex",
						flexDirection: "column",
						height: "auto",
						backgroundColor: theme.colors.soft,
						borderRadius: 0,
						zIndex: 1,
						marginTop: 10,
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
							<List.Accordion
								key={coin.symbol}
								title={coin.symbol}
								titleStyle={{ color: theme.colors.soft }}
								style={{
									backgroundColor: theme.colors.dark,
									display: "flex",
									flexDirection: "row",
									justifyContent: "space-between",
									alignItems: "center",
									height: 50,
								}}
								left={(props) => (
									<List.Icon
										{...props}
										icon={coin.name.toLowerCase()}
										color={theme.colors.soft}
									/>
								)}
								right={(props) => (
									<View
										style={{
											display: "flex",
											flexDirection: "row",
											justifyContent: "space-between",
											alignItems: "center",
											width: 100,
										}}
									>
										<Text
											style={{
												alignSelf: "flex-end",
												fontSize: 12,
												color: theme.colors.light,
											}}
										>
											<Text style={{ fontSize: 8 }}>cant:</Text>
											{coinAmount}
										</Text>
										<View>
											<Text style={{ fontSize: 14, color: theme.colors.soft }}>
												${coinPrice}
											</Text>
											<Text
												style={{
													fontSize: 12,
													color: theme.colors.light,
													alignSelf: "flex-end",
												}}
											>
												${(coinAmount * coinPrice).toFixed(2)}
											</Text>
										</View>
									</View>
								)}
							>
								{coin.transactions.map((transaction, index) => (
									<TouchableOpacity
										key={transaction._id}
										style={{
											display: "flex",
											flexDirection: "row",
											justifyContent: "space-between",
											alignItems: "center",
											height: 50,
											padding: 0,
											backgroundColor: theme.colors.pastel,
											borderBottomColor: "#ffffff",
											borderBottomWidth: 1,
											width: "100%",
											paddingRight: 10,
										}}
										onLongPress={() => {
											setInitialModalValues({
												symbol: coin.symbol,
												amount: transaction.amount.toFixed(2),
												price: transaction.price.toFixed(2),
												date: transaction.date,
												type: transaction.type,
												_id: transaction._id,
											});
											console.log("initialModalValues", {
												symbol: coin.symbol,
												amount: transaction.amount.toFixed(2),
												price: transaction.price.toFixed(2),
												date: transaction.date,
												type: transaction.type,
												_id: transaction._id,
											});
											showModal();
										}}
									>
										<View>
											<Text style={{ fontSize: 16, color: theme.colors.dark }}>
												{transaction.type.toLocaleUpperCase()}
											</Text>
										</View>
										<Text style={{ fontSize: 12, color: theme.colors.dark }}>
											<Text style={{ fontSize: 12 }}>cant:</Text>
											{transaction.amount}
										</Text>
										<View>
											<Text style={{ fontSize: 16, color: theme.colors.dark }}>
												${transaction.price}
											</Text>
											<Text
												style={{
													fontSize: 12,
													color: theme.colors.dark,
													alignSelf: "flex-end",
												}}
											>
												Total: ${transaction.amount * transaction.price}
											</Text>
										</View>
									</TouchableOpacity>
								))}
							</List.Accordion>
						);
					})}
				</ScrollView>
			</>
		);
	};

	return (
		<SafeAreaView
			style={{
				display: "flex",
				height: "100%",
				backgroundColor: theme.colors.soft,
			}}
		>
			{loading && (
				<Portal>
					<View
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							backgroundColor: "rgba(0,0,0,0.3)",
						}}
					>
						<ActivityIndicator
							animating={true}
							color="white"
							size="large"
							style={{
								position: "absolute",
								top: "50%",
								left: "50%",
								transform: [{ translateX: -25 }, { translateY: -25 }],
							}}
						/>
					</View>
				</Portal>
			)}
			{coins.length > 0 && (
				<>
					<CarteraCard />
					<CoinCard />
				</>
			)}
		</SafeAreaView>
	);
}
