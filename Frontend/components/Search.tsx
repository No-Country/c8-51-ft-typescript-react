import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Searchbar } from "react-native-paper";

interface SearchProps {
	value: string;
	onChangeText: (query: string) => void;
}

export default function Search(props: SearchProps) {
	const { value, onChangeText } = props;
	return (
		<Searchbar
			placeholder='Search'
			onChangeText={onChangeText}
			value={value}
			style={styles.search}
		/>
	);
}

const styles = StyleSheet.create({
	search: {
		margin: 10,
		borderRadius: 40,
		height: 40,
	},
});
