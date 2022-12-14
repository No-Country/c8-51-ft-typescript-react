import { Theme } from "../App";
import AppContext from "../components/AppContext";
import CryptoList from "../components/CryptoList";
import Search from "../components/Search";
import { ICoin } from "../types";
import DetailScreen from "./DetailScreen";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
	useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
const Tab = createMaterialTopTabNavigator();

const Stack = createNativeStackNavigator();

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
	const [loading, setLoading] = useState(true);
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
				"https://c8-51-ft-typescript-react-production.up.railway.app/api/favs/delete/",
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
		if (loading && coins.length > 0) {
			fetch("https://c8-51-ft-typescript-react-production.up.railway.app/api/favs/read", {
				method: "POST",
				body: JSON.stringify({ userID: user.user[0]._id }),
				headers: {
					"Content-Type": "application/json",
				},
			})
				.then((res) => res.json())
				.then((data) => {
					if (!data.message) {
						const newCoins: ICoin[] = coins.map((item) => {
							if (data.favs_id.favs.includes(item.symbol)) {
								return { ...item, isFav: true };
							}
							return { ...item, isFav: false };
						});

						setCoins(newCoins);
					}
					setLoading(false);
				})
				.catch((err) => {
					console.log(err);
					setLoading(false);
				});
		}
	}, [coins, loading, setCoins, user.user]);

	const onChangeSearch = (query) => {
		setSearchQuery(query);
	};

	return (
		<>
			<SafeAreaView
				style={{
					...styles.container,
					backgroundColor: theme.colors.soft,
				}}
			>
				<Search onChangeText={onChangeSearch} value={searchQuery} />
				<View style={styles.containerContainer}>
					<Tab.Navigator
						initialRouteName='All'
						screenOptions={{
							tabBarActiveTintColor: theme.colors.accent,
							tabBarInactiveTintColor: theme.colors.light,
							tabBarStyle: {
								backgroundColor: theme.colors.dark,
								borderTopWidth: 2,
								borderTopColor: theme.colors.light,
							},
							tabBarIndicatorStyle: {
								backgroundColor: theme.colors.accent,
								width: 50,
								marginLeft: 70,
							},
						}}
					>
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
	const theme = useTheme<Theme>();
	return (
		<Stack.Navigator
			screenOptions={{
				headerStyle: {
					backgroundColor: theme.colors.dark,
				},
				headerTintColor: theme.colors.light,
				headerTitleStyle: {
					fontWeight: "bold",
				},
			}}
		>
			<Stack.Screen
				name="Home"
				component={Home}
				options={{ headerShown: false }}
			/>
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
