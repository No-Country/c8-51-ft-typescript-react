import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import {
	TextInput,
	Button,
	HelperText,
	ActivityIndicator,
	Portal,
	useTheme,
} from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { NavigationContext } from "@react-navigation/native";
import { Theme } from "../App";
import { Animated, Easing } from "react-native";

const viewFadeIn = new Animated.Value(0);

type FormData = {
	username: string;
	password: string;
	confirmPassword: string;
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
	confirmPassword: yup
		.string()
		.required("Confirm Password is required")
		.oneOf([yup.ref("password"), null], "Passwords must match"),
});

export default function RegisterScreen() {
	const theme = useTheme<Theme>();
	const [serverError, setServerError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	useEffect(() => {
		Animated.timing(viewFadeIn, {
			useNativeDriver: false,
			toValue: 1,
			duration: 700,
			easing: Easing.ease,
		}).start();
	}, []);

	// use the useForm hook to initialize the form and handle form submissions
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		resolver: yupResolver(validationSchema),
	});
	const navigation = useContext(NavigationContext);
 
	const onSubmit = (data) => {
		setLoading(true);
		fetch(
			"https://c8-51-ft-typescript-react-production.up.railway.app/api/auth/register",
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
				console.log(data);
				setLoading(false);
				if (data.message) {
					setServerError(data.message);
				} else {
					navigation.navigate("Login");
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

			<Animated.View
				style={{
					...styles.container,
					backgroundColor: theme.colors.soft,
					opacity: viewFadeIn,
				}}
			>
				<Controller
					name="username"
					control={control}
					defaultValue=""
					render={({ field: { onChange, onBlur, value } }) => (
						<TextInput
							label="Username"
							autoCapitalize="none"
							outlineColor={theme.colors.dark}
							onBlur={onBlur}
							onChangeText={(value) => onChange(value)}
							mode="outlined"
							value={value}
						/>
					)}
				/>
				<HelperText type="error" visible={!!errors.username}>
					{errors.username?.message}
				</HelperText>
				<Controller
					name="password"
					control={control}
					defaultValue=""
					render={({ field: { onChange, onBlur, value } }) => (
						<TextInput
							right={
								<TextInput.Icon
									icon={showPassword ? "eye" : "eye-off"}
									onPress={() => setShowPassword(!showPassword)}
								/>
							}
							secureTextEntry={!showPassword}
							autoCapitalize="none"
							outlineColor={theme.colors.dark}
							label="Password"
							onBlur={onBlur}
							mode="outlined"
							onChangeText={(value) => onChange(value)}
							value={value}
						/>
					)}
				/>
				<HelperText type="error" visible={!!errors.password}>
					{errors.password?.message}
				</HelperText>
				<Controller
					name="confirmPassword"
					control={control}
					defaultValue=""
					render={({ field: { onChange, onBlur, value } }) => (
						<TextInput
							right={
								<TextInput.Icon
									icon={showPassword ? "eye" : "eye-off"}
									onPress={() => setShowPassword(!showPassword)}
								/>
							}
							secureTextEntry={!showPassword}
							label="Confirm Password"
							autoCapitalize="none"
							outlineColor={theme.colors.dark}
							onBlur={onBlur}
							onChangeText={(value) => onChange(value)}
							mode="outlined"
							value={value}
						/>
					)}
				/>
				<HelperText type="error" visible={!!errors.confirmPassword}>
					{errors.confirmPassword?.message}
				</HelperText>
				<Button
					mode="contained"
					onPress={handleSubmit(onSubmit)}
					buttonColor={theme.colors.accent}
					textColor={theme.colors.dark}
					elevation={5}
					style={styles.button}
				>
					Register
				</Button>
				<HelperText type="error" visible={!!serverError}>
					{serverError}
				</HelperText>
			</Animated.View>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		padding: 20,
	},
	button: {
		// width: 200,
		// margin: 10,
		padding: 5,
		borderRadius: 5,
		fontSize: 18,
	},
});
