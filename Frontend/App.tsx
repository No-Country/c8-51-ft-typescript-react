import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/HomeScreen";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
	Provider as PaperProvider,
	DefaultTheme,
	useTheme,
	ThemeBase,
} from "react-native-paper";
import { useState } from "react";
import LoginScreen from "./screens/LoginScreen";
import NewsScreen from "./screens/NewsScreen";
import CurrencyConverterScreen from "./screens/CurrencyConverterScreen";
import { ICoin } from "./types";
import AppContext from "./components/AppContext";
import { useFetchBinance } from "./hooks/useFetchBinance";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

declare global {
	namespace ReactNativePaper {
		interface ThemeColors {
			dark: string;
			ligth: string;
		}
	}
}

const theme = {
	...DefaultTheme,
	// Specify custom property
	// myOwnProperty: true,
	// Specify custom property in nested object
	colors: {
		...DefaultTheme.colors,
		dark: "#000022",
		light: "#FDFDFD",
		text: "#000",
		// primary: "#000000",
		// secondary: "#ffffff",
	},
};

export type Theme = typeof theme;

export default function App() {
	const [loggedIn] = useState(true);
	const [coins, setCoins] = useState<ICoin[]>([]);
	useFetchBinance(coins, setCoins);
	return (
		<PaperProvider theme={theme}>
			<AppContext.Provider value={{ coins, setCoins }}>
				<NavigationContainer>
					{loggedIn ? (
						<Tab.Navigator>
							<Tab.Screen
								name="HomeScreen"
								component={HomeScreen}
								options={{
									tabBarLabel: () => null,
									headerShown: false,
									tabBarIcon: ({ size }) => (
										<MaterialCommunityIcons
											name="home"
											color={theme.colors.primary}
											size={size}
										/>
									),
								}}
							/>
							<Tab.Screen
								name="Converter"
								component={CurrencyConverterScreen}
								options={{
									tabBarLabel: () => null,
									headerShown: false,
									tabBarIcon: ({ color, size }) => (
										<MaterialCommunityIcons
											name="currency-usd"
											color={theme.colors.primary}
											size={size}
										/>
									),
								}}
							/>
							<Tab.Screen
								name="News"
								component={NewsScreen}
								options={{
									tabBarLabel: () => null,
									headerShown: false,
									tabBarIcon: ({ color, size }) => (
										<MaterialCommunityIcons
											name="newspaper-variant-outline"
											color={theme.colors.primary}
											size={size}
										/>
									),
								}}
							/>
						</Tab.Navigator>
					) : (
						<LoginScreen />
					)}
				</NavigationContainer>
			</AppContext.Provider>
		</PaperProvider>
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
