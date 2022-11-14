import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import {
	Button,
	Searchbar,
	withTheme,
	Surface,
	IconButton,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Tab = createMaterialTopTabNavigator();
// import BottomNav from "../components/BottomNav";
const cryptoJson = [
	{
		name: "Bitcoin",
		symbol: "BTC",
		price: 15100.12,
		change24h: 10.5,
		fav: true,
	},
	{
		name: "Ethereum",
		symbol: "ETH",
		price: 400.51,
		change24h: -2.5,
		fav: false,
	},
	{
		name: "Litecoin",
		symbol: "LTC",
		price: 100,
		change24h: 0.5,
		fav: false,
	},
];

const AllCoinsComponent = (props) => {
	const { colors } = props.theme;
	const { items } = props;
	return (
		<View style={{ height: "100%", backgroundColor: colors.background }}>
			<Surface
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
					padding: 10,
					backgroundColor: colors.background,
					// borderBottomWidth: 1,
					// borderBottomColor: colors.border,
				}}
			>
				<Text style={{ color: colors.text, width: 50 }}>Name</Text>
				<Text style={{ color: colors.text, width: 80 }}>Price</Text>
				<Text style={{ color: colors.text }}>24h</Text>
				<Text style={{ color: colors.text }}>Favs</Text>
			</Surface>
			{items.map((item) => {
				{
					var bg = item.change24h > 0 ? "green" : "red";
				}
				return (
					<Surface
						key={item.symbol}
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							padding: 10,
						}}
					>
						<View style={{ flex: 0, flexDirection: "column", width: 50 }}>
							<Text style={{ color: colors.text, fontSize: 16 }}>
								{item.symbol}/{" "}
							</Text>
							<Text
								style={{
									color: colors.text,
									fontSize: 8,
									fontWeight: "normal",
								}}
							>
								USDT
							</Text>
						</View>
						<View style={{ width: 80 }}>
							<Text style={{ color: colors.text, fontSize: 16 }}>
								${item.price}
							</Text>
						</View>
						<View
							style={{
								padding: 5,
								flexDirection: "row",
								alignItems: "center",
								backgroundColor: bg,
								width: 60,
								justifyContent: "center",
							}}
						>
							<Text
								style={{
									color: colors.text,
									fontSize: 12,
								}}
							>
								{bg === "green" ? "+" : ""}
								{item.change24h}%
							</Text>
						</View>
						<View
							style={
								{
									// flex: 0,
									// padding:0,
									// alignSelf: "flex-end",
								}
							}
						>
							<MaterialCommunityIcons
								name="star-outline"
								// icon="star-outline"
								// color={colors.text}
								size={20}
								onPress={() => console.log("Pressed")}
							/>
						</View>
					</Surface>
				);
			})}
		</View>
	);
};

const FavsCoinsComponent = () => {
	return (
		<View>
			<Text>allCoinsComponent</Text>
		</View>
	);
};

function Home(props) {
	const { colors } = props.theme;
	const [searchQuery, setSearchQuery] = useState("");

	const onChangeSearch = (query) => setSearchQuery(query);

	return (
		<>
			<SafeAreaView style={{ flex: 1, backgroundColor: colors.ligth }}>
				<Searchbar
					placeholder="Search"
					onChangeText={onChangeSearch}
					value={searchQuery}
					style={{ margin: 10, borderRadius: 40, height: 40 }}
				/>
				<View style={{ height: "100%" }}>
					<Tab.Navigator>
						<Tab.Screen name="All">
							{() => (
								<AllCoinsComponent items={cryptoJson} theme={props.theme} />
							)}
						</Tab.Screen>
						<Tab.Screen name="Favs">
							{() => (
								<AllCoinsComponent
									items={cryptoJson.filter((item) => item.fav)}
									theme={props.theme}
								/>
							)}
						</Tab.Screen>
					</Tab.Navigator>
				</View>
			</SafeAreaView>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});

export default withTheme(Home);
