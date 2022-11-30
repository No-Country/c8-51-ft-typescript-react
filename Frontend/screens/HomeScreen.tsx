import { useContext, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
	Button,
	Searchbar,
	withTheme,
	Surface,
	IconButton,
	useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Theme } from "../App";
import { ICoin } from "../types";
import CryptoList from "../components/CryptoList";
import Search from "../components/Search";
import { useFetchBinance } from "../hooks/useFetchBinance";
import AppContext from "../components/AppContext";
import DetailScreen from "./DetailScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Tab = createMaterialTopTabNavigator();
// import BottomNav from '../components/BottomNav';
const cryptoJson: ICoin[] = [
	{
		name: "Bitcoin",
		symbol: "BTC",
		price: 15100.12,
		change24h: 10.5,
		isFav: true,
	},
	{
		name: "Ethereum",
		symbol: "ETH",
		price: 400.51,
		change24h: -2.5,
		isFav: false,
	},
	{
		name: "Litecoin",
		symbol: "LTC",
		price: 100,
		change24h: 0.5,
		isFav: false,
	},
];

function Home({ navigation }: any) {
	const theme = useTheme<Theme>();
	const { coins, setCoins } = useContext(AppContext);
	const [searchQuery, setSearchQuery] = useState("");
	const isFavCallback = (symbol: string) => {
		const newAllCoins = coins.map((item) => {
			if (item.symbol === symbol) {
				item.isFav = !item.isFav;
			}
			return item;
		});
		setCoins(newAllCoins);
	};

	const onChangeSearch = (query) => {
		setSearchQuery(query);
		setCoins(
			cryptoJson.filter(
				(item) =>
					item.name.toLowerCase().includes(query.toLowerCase()) ||
					item.symbol.toLowerCase().includes(query.toLowerCase()),
			),
		);
	};

	return (
		<>
			<SafeAreaView
				style={{ ...styles.container, backgroundColor: theme.colors.light }}
			>
				<Search onChangeText={onChangeSearch} value={searchQuery} />
				<View style={styles.containerContainer}>
					<Tab.Navigator>
						<Tab.Screen name='All'>
							{() => <CryptoList items={coins} isFavCallback={isFavCallback} />}
						</Tab.Screen>
						<Tab.Screen name='Favs'>
							{() => (
								<CryptoList
									items={coins.filter((item) => item.isFav)}
									isFavCallback={isFavCallback}
								/>
							)}
						</Tab.Screen>
					</Tab.Navigator>
				</View>
			</SafeAreaView>
		</>
	);
}

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Screen name="Home" component={Home} />
			<Stack.Screen name="Detail" component={DetailScreen} />
		</Stack.Navigator>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	containerContainer: { height: "100%" },
});

export default withTheme(StackNavigator);
