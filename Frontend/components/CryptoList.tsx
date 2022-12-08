import React, { useContext, useEffect } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Surface, Text, useTheme } from "react-native-paper";
import { Item } from "react-native-paper/lib/typescript/components/Drawer/Drawer";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Theme } from "../App";
import { ICoin } from "../types";
import { NavigationContext } from "@react-navigation/native";
import { Animated, Easing } from "react-native";
import AppContext from "./AppContext";

const viewFadeIn = new Animated.Value(0);

const styles = StyleSheet.create({
	container: {
		height: "100%",
	},
	surface: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 10,
	},
	containerContainer: { height: "100%" },
	itemContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 10,
	},
	itemNameContainer: { flex: 2, flexDirection: "column", width: 50 },
	itemNameSymbol: { fontSize: 16 },
	itemNameSub: {
		fontSize: 8,
		fontWeight: "normal",
	},
	itemPriceContainer: { width: 80, flex: 2 },
	itemPrice: { fontSize: 16 },
	tazationContainer: {
		padding: 5,
		flexDirection: "row",
		alignItems: "center",
		width: 60,
		flex: 1,
	},
	tazation: { fontSize: 12 },
});

interface IProps {
	items: ICoin[];
	isFavCallback: (symbol: string) => void;
}

export default function CryptoList(props: IProps) {
	const { items } = props;
	const { isFavCallback } = props;
	const { darkMode } = useContext(AppContext);
	const theme = useTheme<Theme>();
	function ListItem(coin: ICoin) {
		useEffect(() => {
			Animated.timing(viewFadeIn, {
				useNativeDriver: false,
				toValue: 1,
				duration: 300,
				easing: Easing.ease,
			}).start();
		}, [coin]);
		return (
			<Surface
				style={{ ...styles.itemContainer, backgroundColor: theme.colors.soft }}
			>
				<View
					style={{
						...styles.itemNameContainer,
					}}
				>
					<Text style={{ ...styles.itemNameSymbol, color: theme.colors.text }}>
						{coin.symbol}{" "}
					</Text>
					<Text style={{ ...styles.itemNameSub, color: theme.colors.text }}>
						{coin.name}
					</Text>
				</View>
				<Animated.View
					style={{ ...styles.itemPriceContainer, opacity: viewFadeIn }}
				>
					<Text style={{ ...styles.itemPrice, color: theme.colors.text }}>
						${coin.price}
					</Text>
				</Animated.View>
				<Animated.View
					style={{ ...styles.tazationContainer, opacity: viewFadeIn }}
				>
					<Text
						style={{
							...styles.tazation,
							color: coin.change24h > 0 ? "green" : "red",
						}}
					>
						{coin.change24h > 0 ? "+" : ""}
						{coin.change24h}%
					</Text>
				</Animated.View>
				<View>
					<MaterialCommunityIcons
						name={coin.isFav ? "star" : "star-outline"}
						color={coin.isFav ? "orange" : darkMode ? "black" : "white"}
						size={20}
						onPress={() => isFavCallback(coin.symbol)}
					/>
				</View>
			</Surface>
		);
	}
	// We can access navigation object via context
	const navigation = React.useContext(NavigationContext);
	return (
		<View style={{ ...styles.container, backgroundColor: theme.colors.soft }}>
			<Surface
				style={{ ...styles.surface, backgroundColor: theme.colors.dark }}
			>
				<Text style={{ color: theme.colors.light, flex: 2 }}>Name</Text>
				<Text style={{ color: theme.colors.light, flex: 2 }}>Price</Text>
				<Text style={{ color: theme.colors.light, flex: 1 }}>24h</Text>
				<Text style={{ color: theme.colors.light, flex: 0 }}>Favs</Text>
			</Surface>
			<ScrollView style={styles.containerContainer}>
				{items.map((coin) => (
					<TouchableOpacity
						key={coin.name + coin.symbol}
						onPress={() => navigation.navigate("Detail", { coin })}
					>
						<ListItem key={coin.name + coin.symbol} {...coin} />
					</TouchableOpacity>
				))}
			</ScrollView>
		</View>
	);
}
