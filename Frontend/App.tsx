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
	const [coins, setCoins] = useState<ICoin[]>([]);

	// const [user, setUser] = useState<User>(null);
  const [user, setUser] = useState<User>({"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzAyNjY2NjUsImV4cCI6MTY3MDM1MzA2NX0.uj1AbdAE9tnNC0TFpDbxu3e7KDU45TZKmB8w490MdWA", "user": [{"_id": "638ca579e4152971d5ab5b87", "portfolio_id": "638df1ef9297239c3f9fb3ec", "username": "test1"}]});
	useFetchBinance(coins, setCoins);
	return (
		<PaperProvider theme={theme}>
			<AppContext.Provider value={{ coins, setCoins, user, setUser }}>
				<NavigationContainer>
					{user ? (
						<Tab.Navigator>
							<Tab.Screen
								name="Portfolio"
								component={PortfolioScreen}
								options={{
									tabBarLabel: () => null,
									headerShown: false,
									tabBarIcon: ({ color, size }) => (
										<MaterialCommunityIcons
											name="chart-line"
											color={theme.colors.primary}
											size={size}
										/>
									),
								}}
							/>
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
