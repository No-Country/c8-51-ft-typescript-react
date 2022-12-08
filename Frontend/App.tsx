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
	MD3LightTheme,
	MD2LightTheme,
	MD3DarkTheme,
} from "react-native-paper";
import { useState } from "react";
import LoginScreen from "./screens/LoginScreen";
import NewsScreen from "./screens/NewsScreen";
import CurrencyConverterScreen from "./screens/CurrencyConverterScreen";
import { ICoin } from "./types";
import AppContext from "./components/AppContext";
import { useFetchBinance } from "./hooks/useFetchBinance";
import PortfolioScreen from "./screens/PortfolioScreen";
import RegisterScreen from "./screens/RegisterScreen";
import WelcomeScreen from "./screens/WelcomeScreen";

export type User = {
	token: string;
	user: {
		_id: string;
		username: string;
		portfolio_id: string;
	}[];
};

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
	...MD3LightTheme,
	// Specify custom property
	myOwnProperty: true,
	// Specify custom property in nested object
	colors: {
		...MD3LightTheme.colors,
		dark: "#251541",
		// pastel: "#fbe3ff",
		pastel: "#F0CAA3",
		soft: "#f9f1fe",
		light: "#ffe5bb",
		accent: "#6fbebe",
		text: "#000",
		// primary: "#000000",
		// secondary: "#ffffff",
	},
};
const darkTheme = {
	...MD3DarkTheme,
	// Specify custom property
	myOwnProperty: true,
	// Specify custom property in nested object
	colors: {
		...MD3LightTheme.colors,
		dark: "#fbe3ff",
		// pastel: "#fbe3ff",
		pastel: "#160b0b",
		soft: "#251541",
		light: "#b57712",
		accent: "#0c75ae",
		text: "#ffe5bb",
		// primary: "#000000",
		// secondary: "#ffffff",
	},
};

export type Theme = typeof theme;

export default function App() {
	const [coins, setCoins] = useState<ICoin[]>([]);
	const [showFAB, setShowFAB] = useState<boolean>(false);
	const [darkMode, setDarkMode] = useState<boolean>(true);
	const [user, setUser] = useState<User>(null);
	// const [user, setUser] = useState<User>({
	// 	token:
	// 		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzAyNjY2NjUsImV4cCI6MTY3MDM1MzA2NX0.uj1AbdAE9tnNC0TFpDbxu3e7KDU45TZKmB8w490MdWA",
	// 	user: [
	// 		{
	// 			_id: "638ca579e4152971d5ab5b87",
	// 			portfolio_id: "638fa89522cbc0087a73f637",
	// 			username: "test1",
	// 		},
	// 	],
	// });
	useFetchBinance(coins, setCoins);
	return (
		<PaperProvider theme={darkMode ? theme : darkTheme}>
			<AppContext.Provider
				value={{
					coins,
					setCoins,
					user,
					setUser,
					showFAB,
					darkMode,
					setDarkMode,
				}}
			>
				<NavigationContainer>
					{user ? (
						<Tab.Navigator
							screenListeners={{
								tabPress: (e) => {
									if (e.target.includes("Portfolio")) {
										setShowFAB(true);
									} else {
										setShowFAB(false);
									}
								},
							}}
							screenOptions={{
								tabBarStyle: {
									backgroundColor: darkMode
										? theme.colors.pastel
										: darkTheme.colors.pastel,
									borderTopColor: darkMode
										? theme.colors.pastel
										: darkTheme.colors.pastel,
									height: 70,
								},
								tabBarIconStyle: {
									marginTop: 10,
									color: theme.colors.soft,
								},

								tabBarActiveTintColor: darkMode
									? theme.colors.accent
									: darkTheme.colors.accent,
								tabBarInactiveTintColor: darkMode
									? theme.colors.dark
									: darkTheme.colors.dark,
								tabBarShowLabel: false,
							}}
						>
							<Tab.Screen
								name="HomeScreen"
								component={HomeScreen}
								options={{
									tabBarLabel: () => null,
									headerShown: false,
									tabBarIcon: ({ size, color }) => (
										<MaterialCommunityIcons
											name="home"
											color={color}
											size={size}
										/>
									),
								}}
							/>
							<Tab.Screen
								name="Portfolio"
								component={PortfolioScreen}
								options={{
									tabBarLabel: () => null,
									headerShown: false,
									tabBarIcon: ({ color, size }) => (
										<MaterialCommunityIcons
											name="chart-line"
											color={color}
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
											color={color}
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
											color={color}
											size={size}
										/>
									),
								}}
							/>
						</Tab.Navigator>
					) : (
						// <LoginScreen />
						// <RegisterScreen />
						<WelcomeScreen />
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
