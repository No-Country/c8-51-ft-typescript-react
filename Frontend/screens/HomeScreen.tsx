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
import AppContext from "../components/AppContext";
import DetailScreen from "./DetailScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Tab = createMaterialTopTabNavigator();

const Stack = createNativeStackNavigator();

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

const filterCoins = (coins: ICoin[], query: string) => {
	if (query === "") {
		return coins;
	}
	return coins.filter((coin) => {
		return coin.name.toLowerCase().includes(query.toLowerCase());
	});
};

function Home() {
	const theme = useTheme<Theme>();
	const { coins, setCoins, user } = useContext(AppContext);
	const [searchQuery, setSearchQuery] = useState("");
	const isFavCallback = (symbol: string) => {
		if (coins.find((item) => item.symbol === symbol && item.isFav)) {
			console.log("found");
			setCoins(
				coins.map((item) => {
					if (item.symbol === symbol) {
						return { ...item, isFav: false };
					}
					return item;
				}),
			);
			fetch(
				"https://c8-51-ft-typescript-react-production.up.railway.app/api/favs/delete",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						userID: user.user[0]._id,
						symbol: symbol,
					}),
				},
			)
				.then((res) => res.json())
				.then((data) => console.log(data))
				.catch((err) => console.log(err));
			return;
		}
		const newCoin = coins.find((item) => item.symbol === symbol)!;
		newCoin.isFav = true;
		setCoins(
			coins.map((item) => {
				if (item.symbol === symbol) {
					return { ...item, isFav: true };
				}
				return item;
			}),
		);
		fetch(
			"https://c8-51-ft-typescript-react-production.up.railway.app/api/favs/create",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userID: user.user[0]._id,
					symbol: symbol,
				}),
			},
		)
			.then((res) => res.json())
			.then((data) => console.log(data))
			.catch((err) => console.log(err));
	};
	useEffect(() => {
		fetch(
			"https://c8-51-ft-typescript-react-production.up.railway.app/api/favs/read",
			{
				method: "POST", //should be get
				body: JSON.stringify({ userID: user.user[0]._id }),
				headers: {
					"Content-Type": "application/json",
				},
			},
		)
			.then((res) => res.json())
			.then((data) => {
				console.log("data", data);
				if (!data.message) {
					setCoins(
						coins.map((item) => {
							if (data.favs_id.favs.includes(item.symbol)) {
								return { ...item, isFav: true };
							}
							return item;
						}),
					);
				}
			})
			.catch((err) => console.log(err));
	}, []);

	const onChangeSearch = (query) => {
		setSearchQuery(query);
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
							{() => (
								<CryptoList
									items={filterCoins(coins, searchQuery)}
									isFavCallback={isFavCallback}
								/>
							)}
						</Tab.Screen>
						<Tab.Screen name='Favs'>
							{() => (
								<CryptoList
									items={filterCoins(coins, searchQuery).filter(
										(item) => item.isFav,
									)}
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
const StackNavigator = () => {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Screen name="Home" component={Home} />
			<Stack.Screen
				options={{ headerShown: true }}
				name="Detail"
				component={DetailScreen}
			/>
		</Stack.Navigator>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	containerContainer: { height: "100%" },
});

export default StackNavigator;
