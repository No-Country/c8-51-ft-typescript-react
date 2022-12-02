import {
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import React, { useState } from "react";
import AppContext from "../components/AppContext";
import { ICoin } from "../types";
import {
	Button,
	FAB,
	List,
	Menu,
	Modal,
	Portal,
	Surface,
	TextInput,
	useTheme,
} from "react-native-paper";
import NewTransactionModal from "../components/NewTrasanctionModal";
interface Transaction {
	date: Date;
	type: "buy" | "sell";
	amount: number;
	price: number;
}
type Portfolio = {
	symbol: string;
	transactions: Transaction[];
}[];

const PortfolioJson: Portfolio = [
	{
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
	const theme = useTheme();
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
	const { coins } = React.useContext(AppContext || null);
	const portfolio = PortfolioJson;
	console.log(coins);
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
						}}
					>
						<View
							style={{
								flexDirection: "column",
								justifyContent: "flex-end",
								backgroundColor: "#012136",
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
		const [visible, setVisible] = useState(false);
    const [transactionsVisible, setTransactionsVisible] = useState(true);
		const showModal = () => setVisible(true);
		const [initialModalValues, setInitialModalValues] = useState({
			symbol: "",
			amount: "",
			price: "",
			date: "",
			type: "",
		});
		return (
			<>
				<NewTransactionModal
					visible={visible}
					setVisible={setVisible}
					coins={coins}
					initialValues={initialModalValues}
				/>
				<ScrollView
					style={{
						display: "flex",
						flexDirection: "column",
						height: "100%",
						backgroundColor: "#c9dfee",
						borderRadius: 0,
						position: "relative",
					}}
				>
					<FAB
						style={{
							position: "absolute",
							margin: 16,
							right: 0,
							bottom: -516,
							backgroundColor: "#6567dc",
							zIndex: 100,
						}}
						icon="plus"
						onPress={showModal}
					/>
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
							<TouchableOpacity
								onLongPress={() => {
									setInitialModalValues({
										symbol: coin.symbol,
										amount: "2",
										price: "4",
										date: "",
										type: "",
									});
									showModal();
								}}
								key={coin.symbol}
							>
								<Surface
									style={{
										backgroundColor: "#04111d",
										display: "flex",
										flexDirection: "row",
										justifyContent: "space-between",
										alignItems: "center",
										height: transactionsVisible ? 200 : 50,
									}}
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
                  { coin.transactions.length > 0 && 
                    transactionsVisible && 
                    coin.transactions.map((transactio,index) => (
                      <View
                        key={index}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          alignItems: "center",
                          height: 50,
                          backgroundColor: "#04111d",
                          borderBottomColor: "#6567dc",
                          borderBottomWidth: 1,
                        }}
                      >
                        <View>
                          <Text style={{ fontSize: 16, color: "#FFF" }}>
                            {transactio.type}
                          </Text>
                          <Text style={{ fontSize: 12, color: "#f0d59b" }}>
                            <Text style={{ fontSize: 8 }}>cant:</Text>
                            {transactio.amount}
                          </Text>
                        </View>
                        <View>
                          <Text style={{ fontSize: 16, color: "#fff" }}>
                            ${transactio.price}
                          </Text>
                          <Text
                            style={{
                              fontSize: 12,
                              color: "#f0d59b",
                              alignSelf: "flex-end",
                            }}
                          >
                            ${transactio.amount * transactio.price}
                          </Text>
                        </View>
                      </View>
                    ))}
								</Surface>
							</TouchableOpacity>
						);
					})}
				</ScrollView>
			</>
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
