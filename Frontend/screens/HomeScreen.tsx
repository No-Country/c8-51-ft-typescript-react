import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Button, Searchbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();
// import BottomNav from "../components/BottomNav";
const criptoJson = {
	BTC: {
		name: "Bitcoin",
		symbol: "BTC",
		price: 100,
		change24h: 0.5,
	},
	ETH: {
		name: "Ethereum",
		symbol: "ETH",
		price: 100,
		change24h: 0.5,
	},
	LTC: {
		name: "Litecoin",
		symbol: "LTC",
		price: 100,
		change24h: 0.5,
	},
};

const AllCoinsComponent = () => {
	return (
		<View>
			<Text>allCoinsComponent</Text>
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

export default function Home() {
	const [searchQuery, setSearchQuery] = useState("");

	const onChangeSearch = (query) => setSearchQuery(query);

	return (
		<>
			<SafeAreaView style={{flex:1}}>
			<Searchbar
				placeholder="Search"
				onChangeText={onChangeSearch}
				value={searchQuery}
				style={{ margin: 10, borderRadius: 40, height: 40 }}
			/>
			<Tab.Navigator>
				<Tab.Screen name="All" component={AllCoinsComponent} />
				<Tab.Screen name="Favs" component={FavsCoinsComponent} />
			</Tab.Navigator>
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
