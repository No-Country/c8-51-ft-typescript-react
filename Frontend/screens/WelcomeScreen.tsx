import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Button, Menu, Searchbar } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AppContext from "../components/AppContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import { NavigationContext, useNavigation } from "@react-navigation/native";

// a welcome screen for a react native app, with a login and register button, using react-native-paper, typescript

function WelcomeScreen() {
	const navigation = React.useContext(NavigationContext);
	const { setUser, user } = React.useContext(AppContext);
	const [visible, setVisible] = React.useState(false);
	const openMenu = () => setVisible(true);
	const closeMenu = () => setVisible(false);
	console.log(user);
	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>Welcome to the app!</Text>
				<Text style={styles.subtitle}>Please log in or register</Text>
			</View>
			<View style={styles.body}>
				<Button
					mode='contained'
					style={styles.button}
					onPress={() => navigation.navigate("Login")}
				>
					Log in
				</Button>
				<Button
					mode='contained'
					style={styles.button}
					onPress={() => navigation.navigate("Register")}
				>
					Register
				</Button>
			</View>
			<View style={styles.footer}>
				<Menu
					visible={visible}
					onDismiss={closeMenu}
					anchor={
						<TouchableOpacity style={styles.menu} onPress={openMenu}>
							<MaterialCommunityIcons name='menu' size={22} />
						</TouchableOpacity>
					}
				>
					<Menu.Item onPress={() => setUser(null)} title='Log out' />
				</Menu>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	header: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: 30,
		fontWeight: "bold",
	},
	subtitle: {
		fontSize: 20,
	},
	body: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	button: {
		width: 200,
		margin: 10,
	},
	footer: {
		flex: 1,
		alignItems: "flex-end",
		justifyContent: "flex-end",
	},
	menu: {
		flex: 0,
		marginRight: 10,
	},
});

const Stack = createNativeStackNavigator();

const WelcomeNavigator = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen name='Welcome' component={WelcomeScreen} />
			<Stack.Screen name='Login' component={LoginScreen} />
			<Stack.Screen name='Register' component={RegisterScreen} />
		</Stack.Navigator>
	);
};

export default WelcomeNavigator;
