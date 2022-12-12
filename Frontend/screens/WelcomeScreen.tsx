import { Theme } from "../App";
import AppContext from "../components/AppContext";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import { NavigationContext } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Animated, Easing } from "react-native";
import { Button, useTheme } from "react-native-paper";

const viewPosition = new Animated.Value(0);

function WelcomeScreen() {
	const navigation = React.useContext(NavigationContext);
	const { darkMode } = React.useContext(AppContext);
	const theme = useTheme<Theme>();
	useEffect(() => {
		Animated.timing(viewPosition, {
			useNativeDriver: false,
			toValue: 1,
			duration: 1000,
			easing: Easing.bounce,
		}).start();
	}, []);

	return (
		<>
			<StatusBar style={darkMode ? "light" : "dark"} />
			<View
				style={{
					...styles.container,
					backgroundColor: theme.colors.dark,
				}}
			>
				<Animated.View
					style={{
						...styles.header,
						top: viewPosition.interpolate({
							inputRange: [0, 1],
							outputRange: [-400, 0],
						}),
					}}
				>
					<View
						style={{
							...styles.headerContent,
							backgroundColor: theme.colors.dark,
						}}
					>
						<Text style={{ ...styles.title, color: theme.colors.pastel }}>
							CryptoHub
						</Text>
						<Text style={{ ...styles.subtitle, color: theme.colors.soft }}>
							The best place to manage your crypto
						</Text>
					</View>
				</Animated.View>
				<Animated.View
					style={{
						...styles.body,
						backgroundColor: theme.colors.soft,
						bottom: viewPosition.interpolate({
							inputRange: [0, 1],
							outputRange: [-400, 0],
						}),
					}}
				>
					<Button
						mode='contained'
						buttonColor={theme.colors.dark}
						style={styles.button}
						textColor={theme.colors.soft}
						onPress={() => navigation.navigate("Login")}
					>
						Log in
					</Button>
					<Button
						mode='contained'
						buttonColor={theme.colors.accent}
						textColor={theme.colors.dark}
						style={styles.button}
						onPress={() => navigation.navigate("Register")}
					>
						Register
					</Button>
				</Animated.View>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#3c2525",
		alignItems: "center",
		justifyContent: "center",
	},
	header: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",

		width: "100%",
	},
	headerContent: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		position: "absolute",
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
	},
	title: {
		fontSize: 45,
		fontWeight: "bold",
		letterSpacing: 9,
	},
	subtitle: {
		fontSize: 16,
	},
	body: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		width: "100%",
		height: "100%",
	},
	button: {
		width: 300,
		margin: 10,
		padding: 10,
		borderRadius: 5,
		fontSize: 18,
	},
});

const Stack = createNativeStackNavigator();

const WelcomeNavigator = () => {
	const theme = useTheme<Theme>();
	return (
		<>
			<StatusBar />
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
					name='Welcome'
					component={WelcomeScreen}
					options={{ headerShown: false }}
				/>
				<Stack.Screen name='Login' component={LoginScreen} />
				<Stack.Screen name='Register' component={RegisterScreen} />
			</Stack.Navigator>
		</>
	);
};

export default WelcomeNavigator;
