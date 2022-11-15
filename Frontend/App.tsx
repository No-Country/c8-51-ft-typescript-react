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

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

declare global {
	namespace ReactNativePaper {
		interface ThemeColors {
			dark: string;
			ligth: string;
		}

		// interface Theme {
		// 	myOwnProperty: boolean;
		// }
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
		text: '#000',
		// primary: "#000000",
		// secondary: "#ffffff",
	},
};

export type Theme = typeof theme;

export default function App() {
	const [loggedIn] = useState(true);

	return (
		<PaperProvider theme={theme}>
			<NavigationContainer>
				{loggedIn ? (
					<Tab.Navigator>
						<Tab.Screen
							name="Home"
							component={HomeScreen}
							options={{
								tabBarIcon: ({ size }) => (
									<MaterialCommunityIcons
										name="home"
										color={theme.colors.primary}
										size={size}
									/>
								),
								tabBarLabel: () => null,
								headerShown: false,
							}}
						/>
					</Tab.Navigator>
				) : (
					<LoginScreen />
				)}
			</NavigationContainer>
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
