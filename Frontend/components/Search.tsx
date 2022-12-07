import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { Menu, Searchbar, ThemeProvider, useTheme } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AppContext from "./AppContext";
import { Theme } from "../App";

interface SearchProps {
	value: string;
	onChangeText: (query: string) => void;
}

export default function Search(props: SearchProps) {
	const theme = useTheme<Theme>();
	const { setUser, user } = useContext(AppContext);
	const { value, onChangeText } = props;
	const [visible, setVisible] = React.useState(false);
	const openMenu = () => setVisible(true);
	const closeMenu = () => setVisible(false);
	return (
		<View
			style={{
				display: "flex",
				flexDirection: "row",
				// justifyContent: "center",
				alignItems: "center",
				backgroundColor: theme.colors.soft,
			}}
		>
			<View style={{ flex: 1 }}>
				<Searchbar
					placeholder='Search'
					onChangeText={onChangeText}
					value={value}
					style={{ ...styles.search, backgroundColor: theme.colors.soft }}
				/>
			</View>
			<Menu
				visible={visible}
				onDismiss={closeMenu}
				// style={{ backgroundColor: theme.colors.soft}}
				anchor={
					<TouchableOpacity
						style={{ flex: 0, marginRight: 10 }}
						onPress={openMenu}
					>
						<MaterialCommunityIcons name='menu' size={22} />
					</TouchableOpacity>
				}
			>
				<Menu.Item
					onPress={() => {}}
					title="Settings"
					trailingIcon='cog'
					// style={{ backgroundColor: theme.colors.soft }}
				/>
				<Menu.Item onPress={() => setUser(null)} title='Log out' />
				{/* <Menu.Item onPress={() => {}} title='Item 2' /> */}
			</Menu>
		</View>
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
