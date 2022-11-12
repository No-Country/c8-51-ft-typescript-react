import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Button, Searchbar, withTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();
// import BottomNav from "../components/BottomNav";
const criptoJson = {
	BTC: {
		name: "Bitcoin",
		symbol: "BTC",
		price: 15100.12,
		change24h: 1.5,
	},
	ETH: {
		name: "Ethereum",
		symbol: "ETH",
		price: 400.51,
		change24h: -2.5,
	},
	LTC: {
		name: "Litecoin",
		symbol: "LTC",
		price: 100,
		change24h: 0.5,
	},
};

const AllCoinsComponent = (props) => {
	const { colors } = props.theme;
	return (
		<View style={{ height: "100%", backgroundColor: colors.background }}>
			{/* add headers */}
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
					padding: 10,
					borderBottomWidth: 1,
					borderBottomColor: colors.border,
				}}
			>
				<Text style={{ color: colors.text }}>Name</Text>
				<Text style={{ color: colors.text }}>Price</Text>
				<Text style={{ color: colors.text }}>24h</Text>
			</View>
			{Object.keys(criptoJson).map((key) => {
				{
					var bg = criptoJson[key].change24h > 0 ? "green" : "red";
				}
				return (
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							padding: 10,
							borderBottomWidth: 1,
							borderBottomColor: colors.border,
						}}
					>
						<View style={{ flexDirection: "row", alignItems: "center" }}>
							<Text style={{ color: colors.text, fontSize: 16 }}>
								{criptoJson[key].symbol}/{" "}
								<Text
									style={{
										color: colors.text,
										fontSize: 8,
										fontWeight: "normal",
									}}
								>
									USDT
								</Text>
							</Text>
						</View>
						<View style={{ flexDirection: "row", alignItems: "center" }}>
							<Text style={{ color: colors.text, fontSize: 16 }}>
								${criptoJson[key].price}
							</Text>
						</View>
						<View
							style={{
								padding: 5,
								flexDirection: "row",
								alignItems: "center",
								backgroundColor: bg,
							}}
						>
							<Text style={{ color: colors.text, fontSize: 16 }}>
								{bg === "green" ? "+" : ""}
								{criptoJson[key].change24h}%
							</Text>
						</View>
					</View>
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
						<Tab.Screen name="All" component={withTheme(AllCoinsComponent)} />
						<Tab.Screen name="Favs" component={FavsCoinsComponent} />
					</Tab.Navigator>
				</View>
			</SafeAreaView>
		</>
	);
	// return (
	// 	<View style={styles.container}>
	// 		<Text>Home Screen</Text>
	// 		<Button
	// 			icon="camera"
	// 			mode="contained"
	// 			onPress={() => console.log("Pressed")}
	// 		>
	// 			Press me
	// 		</Button>

	// 		<StatusBar style="auto" />
	// 	</View>
	// );
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
