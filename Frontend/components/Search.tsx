import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Button, Menu, Searchbar } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

interface SearchProps {
	value: string;
	onChangeText: (query: string) => void;
}

export default function Search(props: SearchProps) {
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
			}}
		>
			<View style={{ flex: 1 }}>
				<Searchbar
					placeholder='Search'
					onChangeText={onChangeText}
					value={value}
					style={styles.search}
				/>
			</View>
			<Menu
				visible={visible}
				onDismiss={closeMenu}
				// style={{ flex: 0, marginRight: 10 }}
				anchor={
					<TouchableOpacity
						style={{ flex: 0, marginRight: 10 }}
						onPress={openMenu}
					>
						<MaterialCommunityIcons name='menu' size={22} />
					</TouchableOpacity>
				}
			>
				<Menu.Item onPress={() => {}} title='Item 1' />
				<Menu.Item onPress={() => {}} title='Item 2' />
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
