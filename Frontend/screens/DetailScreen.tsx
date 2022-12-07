import {
	Dimensions,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import React from "react";
import { LineChart } from "react-native-chart-kit";
import {SafeAreaView}from 'react-native-safe-area-context';
import { ICoin } from "../types";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { ActivityIndicator, Portal, useTheme } from "react-native-paper";
import { Theme } from "../App";
import { StatusBar } from "expo-status-bar";

const binanceKlinesUrl = (symbol) => {
	return `https://api.binance.com/api/v3/klines?symbol=${symbol}USDT&interval=1d&limit=30`;
};
type Kline = [
	openTime: number,
	open: string,
	high: string,
	low: string,
	close: string,
	volume: string,
	closeTime: number,
	quoteAssetVolume: string,
	numberOfTrades: number,
	takerBuyBaseAssetVolume: string,
	takerBuyQuoteAssetVolume: string,
	ignore: string,
];

const DetailScreen = (params) => {
	const coin = params.route.params.coin as ICoin;
	const [data, setData] = React.useState<Kline[]>([]);
	const [isLoading, setIsLoading] = React.useState(true);
	React.useEffect(() => {
		if (isLoading && coin.symbol) {
			fetch(binanceKlinesUrl(coin.symbol))
				.then((res) => res.json())
				.then((data: Kline[]) => {
					setData(data);
					setIsLoading(false);
				});
		}
	}, []);
	let count = 0;

	const Chart = () => {
		return (
			<>
				<StatusBar style="inverted" />
				{isLoading && (
					<Portal>
						<View
							style={{
								position: "absolute",
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
								justifyContent: "center",
								alignItems: "center",
								backgroundColor: "rgba(0,0,0,0.5)",
							}}
						>
							<ActivityIndicator
								animating={true}
								size="large"
								style={{ position: "absolute" }}
							/>
						</View>
					</Portal>
				)}
				<LineChart
					data={{
						labels: data
							.map((item, index) => {
								if (count > 5) {
									const date = new Date(item[0]);
									count = 0;
									return `${date.toLocaleDateString().split("/")[1]}/${
										date.toLocaleDateString().split("/")[0]
									}`;
								}
								count++;
								return "";
							})
							.reverse(),
						datasets: [
							{
								data: data.map((item) => parseFloat(item[4]) || 0).reverse(),
							},
						],
					}}
					width={Dimensions.get("window").width - 20} // from react-native
					height={200}
					yAxisLabel="$"
					yAxisInterval={1} // optional, defaults to 1
					chartConfig={{
						// backgroundColor: "#744aa5",
						backgroundGradientFrom: "#6b226a",
						backgroundGradientTo: "#b370ff",
						decimalPlaces: 0, // optional, defaults to 2dp
						color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
						labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
						style: {
							borderRadius: 16,
						},
						propsForDots: {
							r: "3",
							strokeWidth: "1",
							stroke: "#484848",
						},
					}}
					bezier={true}
					style={{
						marginVertical: 8,
						borderRadius: 16,
						marginHorizontal: 4,
					}}
				/>
			</>
		);
	};
	const InfoCard = () => {
		const [expand, setExpand] = React.useState(false);
		return (
			<View
				style={{
					...styles.Card,
					height: expand ? 300 : 200,
					width: expand ? 300 : 200,
					padding: expand ? 0 : 10,
				}}
			>
				<View
					style={{
						flex: 1,
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between",
					}}
				>
					<Text style={styles.textMedium}>{coin.symbol}</Text>
					<Text style={styles.textMedium}>
						${Number(coin.price).toFixed(2)}
					</Text>
				</View>
				<View
					style={{
						display: "flex",
						flexDirection: "column",
						flex: 1,
						alignItems: "center",
					}}
				>
					<Text
						style={{
							color: "white",
							fontSize: 30,
							fontWeight: "bold",
							margin: 0,
						}}
					>
						{coin.change24h > 0 ? (
							<>
								<MaterialCommunityIcons
									name="arrow-up"
									size={30}
									color="white"
								/>
								{`${coin.change24h}%`}
							</>
						) : (
							<>
								<MaterialCommunityIcons
									name="arrow-down"
									size={30}
									color="white"
								/>
								{`${coin.change24h}%`}
							</>
						)}
					</Text>
					<Text
						style={{
							fontSize: 10,
							fontWeight: "bold",
							color: "white",
							margin: 2,
						}}
					>
						24h Change:
					</Text>
				</View>
				{expand ? (
					<View
						style={{
							display: "flex",
							flexDirection: "column",
							flex: 1,
							padding: 10,
							alignItems: "center",
						}}
					>
						<Text
							style={{
								color: "white",
								fontSize: 18,
								fontWeight: "bold",
								margin: 0,
							}}
						>
							Low: $
							{data
								.map((item) => Number(item[3]))
								.sort((a, b) => a - b)[0]
								.toFixed(0)}
						</Text>
						<Text
							style={{
								color: "white",
								fontSize: 10,
								fontWeight: "bold",
								margin: 10,
							}}
						>
							Volume 30 days:{"  "}
							{data
								.map((item) => Number(item[5]))
								.reduce((a, b) => a + b)
								.toFixed(0)}
						</Text>
						<Text
							style={{
								color: "white",
								fontSize: 30,
								fontWeight: "bold",
								margin: 0,
							}}
						>
							High: $
							{data
								.map((item) => Number(item[2]))
								.sort((a, b) => b - a)[0]
								.toFixed(0)}
						</Text>
					</View>
				) : null}
				<TouchableOpacity
					style={{
						flex: 0,
						display: "flex",
						flexDirection: "row",
						justifyContent: "center",
					}}
					onPress={() => setExpand(!expand)}
				>
					<MaterialCommunityIcons
						name={expand ? "chevron-up" : "chevron-down"}
						size={30}
						color="white"
					/>
				</TouchableOpacity>
			</View>
		);
	};
	const theme = useTheme<Theme>();
	return (
		<SafeAreaView
			style={{ ...styles.container, backgroundColor: theme.colors.soft }}
		>
			{data.length > 0 && (
				<>
					<Chart />
					<InfoCard />
				</>
			)}
		</SafeAreaView>
	);
};

export default DetailScreen;

const styles = StyleSheet.create({
	container: {
		display: "flex",
		height: "100%",
		flexDirection: "column",
		// backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "flex-start",
	},
	Card: {
		display: "flex",
		backgroundColor: "#3a007d",
		alignSelf: "center",
		margin: 10,
		borderRadius: 10,
		elevation: 5,
	},
	textMedium: {
		fontSize: 20,
		fontWeight: "bold",
		color: "white",
		margin: 10,
	},
});
