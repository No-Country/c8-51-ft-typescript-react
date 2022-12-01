import {
	Dimensions,
	ScrollView,
	StyleSheet,
	Text,
	Touchable,
	TouchableOpacity,
	View,
} from "react-native";
import React from "react";
import {
	LineChart,
	BarChart,
	PieChart,
	ProgressChart,
	ContributionGraph,
	StackedBarChart,
} from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContext } from "@react-navigation/native";
import { ICoin } from "../types";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const binanceKlinesUrl =
	"https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=30";

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
	const navigation = React.useContext(NavigationContext);
	console.log("coin", params.route.params);
	const coin = params.route.params.coin as ICoin;
	const [data, setData] = React.useState<Kline[]>([]);
	const [isLoading, setIsLoading] = React.useState(true);
	navigation.setOptions({ title: coin.symbol });
	React.useEffect(() => {
		if (isLoading) {
			fetch(binanceKlinesUrl)
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
					backgroundColor: "#e26a00",
					backgroundGradientFrom: "#fb8c00",
					backgroundGradientTo: "#ffa726",
					decimalPlaces: 0, // optional, defaults to 2dp
					color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
					labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
					style: {
						borderRadius: 16,
					},
					propsForDots: {
						r: "6",
						strokeWidth: "2",
						stroke: "#ffa726",
					},
				}}
				bezier={true}
				style={{
					marginVertical: 8,
					borderRadius: 16,
					marginHorizontal: 4,
				}}
			/>
		);
	};
	const InfoCard = () => {
		return (
			<View
				style={{
					display: "flex",
					height: 150,
					width: 200,
					backgroundColor: "#3a007d",
					alignSelf: "center",
					margin: 10,
					borderRadius: 10,
					elevation: 5,
				}}
			>
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between",
						padding: 10,
					}}
				>
					<Text
						style={{
							fontSize: 20,
							fontWeight: "bold",
							color: "white",
							margin: 10,
						}}
					>
						{coin.symbol}
					</Text>
					<Text
						style={{
							fontSize: 20,
							fontWeight: "bold",
							color: "white",
							margin: 10,
						}}
					>
						${Number(coin.price).toFixed(2)}
					</Text>
				</View>
				<View
					style={{
						display: "flex",
						flexDirection: "column",

						padding: 10,
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
							<MaterialCommunityIcons name="arrow-up" size={30} color="white" />
							{`${coin.change24h}%`}
              </>
						) : (
              <>
							<MaterialCommunityIcons name="arrow-down" size={30} color="white" />
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
			</View>
		);
	};
	return (
		<View>
			{data.length > 0 && (
				<SafeAreaView style={styles.container}>
					<Chart />
					<InfoCard />
				</SafeAreaView>
			)}
		</View>
	);
};

export default DetailScreen;

const styles = StyleSheet.create({
	container: {
		display: "flex",
		height: "100%",
		flexDirection: "column",
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "flex-start",
	},
});
