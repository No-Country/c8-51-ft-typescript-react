import { View, StyleSheet, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { Menu, Searchbar, useTheme } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AppContext from "./AppContext";
import { Theme } from "../App";
import { StatusBar } from "expo-status-bar";

interface SearchProps {
	value: string;
	onChangeText: (query: string) => void;
}

export default function Search(props: SearchProps) {
	const theme = useTheme<Theme>();
	const { setUser, user, darkMode, setDarkMode } = useContext(AppContext);
	const { value, onChangeText } = props;
	const [visible, setVisible] = React.useState(false);
	const openMenu = () => setVisible(true);
	const closeMenu = () => setVisible(false);
	return (
		<>
			<StatusBar style={!darkMode ? "light" : "dark"} />
			<View
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					backgroundColor: theme.colors.soft,
				}}
			>
				<View style={{ flex: 1 }}>
					<Searchbar
						placeholder='Search'
						onChangeText={onChangeText}
						value={value}
						style={{
							...styles.search,
							backgroundColor: !darkMode
								? theme.colors.dark
								: theme.colors.soft,
						}}
					/>
				</View>
				<Menu
					visible={visible}
					onDismiss={closeMenu}
					contentStyle={{ backgroundColor: theme.colors.soft }}
					anchor={
						<TouchableOpacity
							style={{ flex: 0, marginRight: 10 }}
							onPress={openMenu}
						>
							<MaterialCommunityIcons
								color={theme.colors.text}
								name='menu'
								size={22}
							/>
						</TouchableOpacity>
					}
				>
					<Menu.Item
						onPress={() => {}}
						titleStyle={{ color: theme.colors.text }}
						title="Settings"
						trailingIcon='cog'
					/>
					<Menu.Item
						onPress={() => {
							setDarkMode(!darkMode);
						}}
						titleStyle={{ color: theme.colors.text }}
						title={darkMode ? "Dark Mode" : "Light Mode"}
						trailingIcon={darkMode ? "weather-night" : "weather-sunny"}
					/>
					<Menu.Item
						titleStyle={{ color: theme.colors.text }}
						onPress={() => setUser(null)}
						title='Log out'
					/>
				</Menu>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	search: {
		flexGrow: 1,
		margin: 10,
		borderRadius: 40,
		height: 40,
	},
});
