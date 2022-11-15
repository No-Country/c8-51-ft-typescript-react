import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme, Button, withTheme } from 'react-native-paper';
import { Theme } from '../App';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column-reverse',
	},
	containerContainer: {
		width: '100%',
		height: '50%',
		borderRadius: 20,
		// flex:1,
		justifyContent: 'center',
		padding: 40,
	}
});

function LoginScreen(props) {
	// const { colors } = props.theme;
	const theme = useTheme<Theme>();

	return (
		<View style={{ ...styles.container, backgroundColor: theme.colors.dark }}>
			<View style={{ ...styles.containerContainer, backgroundColor: theme.colors.light }}>
				<TouchableOpacity>
					<Button mode='outlined'>
						Sign in
					</Button>
				</TouchableOpacity>
				<TouchableOpacity>
					<Button
						mode='contained'
						// elevation={4}
						buttonColor={theme.colors.primary}
						style={{ marginTop: 10 }}
					>
						Log in
					</Button>
				</TouchableOpacity>
			</View>

			<StatusBar style='auto' />
		</View>
	);
}

export default withTheme(LoginScreen);
