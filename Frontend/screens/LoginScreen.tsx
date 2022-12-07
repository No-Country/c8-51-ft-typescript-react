import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import {
	TextInput,
	Button,
	HelperText,
	withTheme,
	Portal,
	ActivityIndicator,
	useTheme,
} from "react-native-paper";
import { useForm, Controller, set } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import AppContext from "../components/AppContext";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "@react-navigation/native";
import { Theme } from "../App";

type FormData = {
	username: string;
	password: string;
};

const validationSchema: yup.ObjectSchema<{}> = yup.object().shape({
	username: yup
		.string()
		.required("Username is required")
		.min(3, "Username must be at least 3 characters"),
	password: yup
		.string()
		.required("Password is required")
		.min(4, "Password must be at least 4 characters"),
});
const LoginPage = () => {
	const theme = useTheme<Theme>();
	const { user, setUser } = useContext(AppContext);
	const [serverError, setServerError] = useState(null);
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	// use the useForm hook to initialize the form and handle form submissions
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		resolver: yupResolver(validationSchema),
	});

	// define the submit handler
	const onSubmit = (data) => {
		setLoading(true);
		fetch(
			"https://c8-51-ft-typescript-react-production.up.railway.app/api/auth/login",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			},
		)
			.then((res) => res.json())
			.then((data) => {
				setLoading(false);
				if (data.message) {
					setServerError(data.message);
				} else {
					setUser(data);
					console.log(data);
				}
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
			});
	};
	return (
		<>
			{loading && (
				<Portal>
					<View
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							backgroundColor: "rgba(0,0,0,0.3)",
						}}
					>
						<ActivityIndicator
							animating={true}
							color="white"
							size="large"
							style={{
								position: "absolute",
								top: "50%",
								left: "50%",
								transform: [{ translateX: -25 }, { translateY: -25 }],
							}}
						/>
					</View>
				</Portal>
			)}
			<View
				style={{
					...styles.container,
					backgroundColor: theme.colors.soft,
				}}
			>
				<Controller
					name="username"
					control={control}
					defaultValue=""
					render={({ field: { onChange, onBlur, value } }) => (
						<TextInput
							label="Username"
							mode="outlined"
							error={errors.username ? true : false}
							style={{ ...styles.input }}
							outlineColor={theme.colors.dark}
							onBlur={onBlur}
							value={value}
							onChangeText={onChange}
							autoCapitalize="none"
						/>
					)}
				/>
				<HelperText type="error" visible={errors.username ? true : false}>
					{errors.username?.message}
				</HelperText>
				<Controller
					name="password"
					control={control}
					defaultValue=""
					render={({ field: { onChange, onBlur, value } }) => (
						<TextInput
							label="Password"
							mode="outlined"
							outlineColor={theme.colors.dark}
							right={
								<TextInput.Icon
									icon={showPassword ? "eye" : "eye-off"}
									onPress={() => setShowPassword(!showPassword)}
								/>
							}
							secureTextEntry={!showPassword}
							value={value}
							error={errors.password ? true : false}
							style={styles.input}
							onBlur={onBlur}
							onChangeText={onChange}
							autoCapitalize="none"
						/>
					)}
				/>
				<HelperText type="error" visible={errors.password ? true : false}>
					{errors.password?.message}
				</HelperText>
				<HelperText type="error" visible={serverError ? true : false}>
					{serverError}
				</HelperText>
				<Button
					mode='contained'
					buttonColor={theme.colors.accent}
					textColor={theme.colors.dark}
					elevation={5}
					style={styles.button}
					onPress={handleSubmit(onSubmit)}
				>
					Login
				</Button>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	input: {
		width: "80%",
		marginTop: 20,
	},
	button: {
		width: 310,
		padding: 5,
		borderRadius: 5,
		fontSize: 18,
	},
});

export default withTheme(LoginPage);
