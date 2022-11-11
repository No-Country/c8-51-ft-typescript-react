import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useTheme, Button, withTheme } from "react-native-paper";

function LoginScreen(props) {
	const { colors } = props.theme;
	return (
		<View
			style={{
				backgroundColor: colors.dark,
				flex: 1,
				flexDirection: "column-reverse",
			}}
		>
			<View
				style={{
					backgroundColor: colors.ligth,
					width: "100%",
					height: "50%",
					borderRadius: 20,
					// flex:1,
					justifyContent: "center",
					padding: 40,
				}}
			>
				<TouchableOpacity>
					<Button mode="outlined" style={{}}>
						Sign in
					</Button>
				</TouchableOpacity>
				<TouchableOpacity>
					<Button
						mode="contained"
						// elevation={4}
						buttonColor={colors.primary}
						style={{ marginTop: 10 }}
					>
						Log in
					</Button>
				</TouchableOpacity>
			</View>

			<StatusBar style="auto" />
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
});

export default withTheme(LoginScreen);
