import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Button, Drawer, Portal, Menu, Divider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MenuDrawer() {
	return (
		<Portal>
			<View
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundColor: "rgba(0,0,0,0.5)",
				}}
			/>
			<Drawer.Section
				title="Some title"
				style={{
					backgroundColor: "white",
		      paddingTop: 60,
					height: "100%",
					width: "50%",
				}}

			>
				<Drawer.Item label="First Item" onPress={() => {}} />
				<Drawer.Item label="Second Item" onPress={() => {}} />
			</Drawer.Section>
		</Portal>
	);
}

const styles = StyleSheet.create({});
