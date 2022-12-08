import React, { useContext, useEffect, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import {
	useTheme,
	Menu,
	Portal,
	Button,
	Modal,
	TextInput,
	RadioButton,
	HelperText,
} from "react-native-paper";
import { namesForSymbols } from "../hooks/useFetchBinance";
import { Portfolio, Transaction } from "../screens/PortfolioScreen";
import { ICoin } from "../types";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import AppContext from "./AppContext";
import { Theme } from "../App";

interface NewTransactionModalInterface {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	coins: ICoin[];
	hideModal: () => void;
	initialValues?: {
		symbol: string;
		amount: string;
		type: "buy" | "sell";
		price: string;
		_id: string;
		date: string;
	};
	portfolio: Portfolio;
	setPortfolio: (portfolio: Portfolio) => void;
	setLoading: (loading: boolean) => void;
}

const validationSchema: yup.ObjectSchema<{}> = yup.object().shape({
	amount: yup
		.number()
		.required("Amount is required")
		.positive("Amount must be positive"),
	type: yup.string().required("Type is required"),
	price: yup
		.number()
		.required("Price is required")
		.positive("Price must be positive"),
	date: yup.string().required("Date is required"),
});

export default function NewTransactionModal({
	visible,
	setVisible,
	coins,
	initialValues,
	hideModal,
	portfolio,
	setPortfolio,
	setLoading,
}: NewTransactionModalInterface) {
	const theme = useTheme<Theme>();
	const styles = StyleSheet.create({
		contentStyle: {
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
		},
		menuTouchable: {
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			textAlign: "center",
			backgroundColor: theme.colors.pastel,
			height: 52,
			width: 100,
			// borderRadius: 10,
			// margin: 10,
		},
	});
	const containerStyle = {
		backgroundColor: theme.colors.soft,
		padding: 20,
		height: 400,
		margin: 20,
		borderRadius: 20,
	};
	const { user, setUser } = useContext(AppContext);
	const [modalCoin, setModalCoin] = useState(initialValues.symbol || null);
	const [menuSymbolVisible, setMenuSymbolVisible] = useState(false);
	const {
		control,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm({
		defaultValues: {
			amount: initialValues.amount || null,
			type: initialValues.type || null,
			price: initialValues.price || null,
			date: initialValues.date || "",
		},
		resolver: yupResolver(validationSchema),
	});
	useEffect(() => {
		setModalCoin(initialValues.symbol || null);
		setValue("type", initialValues.type || null);
		setValue("amount", initialValues.amount || null);
		setValue("price", initialValues.price || null);
		setValue("date", initialValues.date || null);
	}, [initialValues]);
	function addTransaction(data) {
		fetch(
			"https://c8-51-ft-typescript-react-production.up.railway.app/api/portfolio/create",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					cors: "no-cors",
				},
				body: JSON.stringify({
					name: namesForSymbols[modalCoin],
					symbol: modalCoin,
					date: "1/1/2020",
					userID: user.user[0]._id,
					amount: data.amount,
					price: data.price,
					type: data.type,
				}),
			},
		)
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				console.log("create", data);
				// update the portfolio_id in the user
				let newUser = { ...user };
				newUser.user[0].portfolio_id = data.portfolio_id;
				setUser(newUser);
				setLoading(true);
			})
			.catch((err) => {
				setLoading(true);
				console.log(err);
			});
		hideModal();
	}
	const handleDelete = () => {
		fetch(
			"https://c8-51-ft-typescript-react-production.up.railway.app/api/portfolio/delete",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					cors: "no-cors",
				},

				body: JSON.stringify({
					_id: initialValues._id,
				}),
			},
		)
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				hideModal();
				setTimeout(() => {
					setLoading(true);
				}, 300);
			})
			.catch((err) => {
				console.log(err);
				setTimeout(() => {
					setLoading(true);
				}, 300);
			});
	};
	return (
		<Portal>
			<Modal
				visible={visible}
				onDismiss={hideModal}
				contentContainerStyle={{
					...containerStyle,
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<View
					style={{
						// flex: 1,
						display: "flex",
						backgroundColor: theme.colors.soft,
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Text
						style={{
							fontSize: 20,
							fontWeight: "bold",
							marginBottom: 5,
							color: theme.colors.text,
						}}
					>
						Agregar Transacción
					</Text>
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "flex-end",
							marginVertical: 10,
						}}
					>
						<Menu
							visible={menuSymbolVisible}
							onDismiss={() => setMenuSymbolVisible(false)}
							contentStyle={{ backgroundColor: theme.colors.soft }}
							anchor={
								<TouchableOpacity
									onPress={() => setMenuSymbolVisible(true)}
									style={styles.menuTouchable}
								>
									<Text style={{ color: theme.colors.text }}>
										{modalCoin ? modalCoin : "Seleccionar"}
									</Text>
									<Text
										style={{
											color: theme.colors.text,
											display: modalCoin ? "none" : "flex",
										}}
									>
										{modalCoin ? null : "moneda"}
									</Text>
								</TouchableOpacity>
							}
						>
							{coins.map((coin) => (
								<Menu.Item
									key={coin.symbol}
									titleStyle={{ color: theme.colors.text }}
									onPress={() => {
										setModalCoin(coin.symbol);
										setMenuSymbolVisible(false);
									}}
									dense
									contentStyle={{
										backgroundColor: theme.colors.soft,
										...styles.contentStyle,
									}}
									style={{
										backgroundColor: theme.colors.soft,
										...styles.contentStyle,
									}}
									title={coin.symbol}
								/>
							))}
						</Menu>
						{/* input for date */}
						<Controller
							name="date"
							control={control}
							rules={{ required: true }}
							render={({ field: { onChange, onBlur, value } }) => (
								<TextInput
									mode="outlined"
									label={"Fecha"}
									style={{
										width: 100,
										height: 50,
										marginLeft: 10,
										backgroundColor: theme.colors.soft,
										// color: theme.colors.light,
									}}
									onChangeText={onChange}
									textColor={theme.colors.text}
									outlineStyle={{ borderColor: theme.colors.dark }}
									placeholderTextColor={theme.colors.text}
									activeOutlineColor={theme.colors.dark}
									value={value}
									placeholder="Fecha"
								/>
							)}
						/>
					</View>
					<Controller
						name="type"
						control={control}
						rules={{ required: true }}
						render={({ field: { onChange, value: formValue } }) => (
							<RadioButton.Group onValueChange={onChange} value={formValue}>
								<View
									style={{
										flexDirection: "row",
										backgroundColor: theme.colors.pastel,
									}}
								>
									<RadioButton.Item
										label="Compra"
										value="buy"
										color={formValue === "buy" ? "#fff" : theme.colors.soft}
										style={
											formValue === "buy"
												? { backgroundColor: theme.colors.light }
												: { backgroundColor: theme.colors.pastel }
										}
									/>
									<RadioButton.Item
										label="Venta"
										value="sell"
										color={formValue === "sell" ? "#fff" : theme.colors.soft}
										style={
											formValue === "sell"
												? { backgroundColor: theme.colors.light }
												: { backgroundColor: theme.colors.pastel }
										}
									/>
								</View>
							</RadioButton.Group>
						)}
					/>
					<HelperText type="error" visible={errors.type ? true : false}>
						{errors.type && "Selecciona un tipo de transacción"}
					</HelperText>

					<View
						style={{
							flexDirection: "row",
							justifyContent: "center",
						}}
					>
						<View
							style={{
								flexDirection: "column",
								// justifyContent: "center",
								width: 100,
								marginRight: 5,
							}}
						>
							<Controller
								name="price"
								control={control}
								rules={{ required: true }}
								render={({ field: { onChange, onBlur, value } }) => (
									<TextInput
										mode="outlined"
										label={"Precio"}
										style={{
											width: 100,
											height: 50,
											marginRight: 5,
											backgroundColor: theme.colors.soft,
										}}
										textColor={theme.colors.text}
										outlineStyle={{ borderColor: theme.colors.dark }}
										placeholderTextColor={theme.colors.text}
										activeOutlineColor={theme.colors.dark}
										onChangeText={onChange}
										value={value}
										placeholder="Precio"
									/>
								)}
							/>
							<HelperText type="error" visible={errors.price ? true : false}>
								{errors.price && "Ingresa un precio"}
							</HelperText>
						</View>
						<View
							style={{
								flexDirection: "column",
								// justifyContent: "center",
								width: 100,
							}}
						>
							<Controller
								name="amount"
								control={control}
								rules={{ required: true }}
								render={({ field: { onChange, onBlur, value } }) => (
									<TextInput
										mode="outlined"
										label={"Cantidad"}
										style={{
											width: 100,
											height: 50,
											marginLeft: 0,
											backgroundColor: theme.colors.soft,
										}}
										textColor={theme.colors.text}
										outlineStyle={{ borderColor: theme.colors.dark }}
										placeholderTextColor={theme.colors.text}
										activeOutlineColor={theme.colors.dark}
										onChangeText={onChange}
										value={value}
										placeholder="Cantidad"
									/>
								)}
							/>
							<HelperText type="error" visible={errors.amount ? true : false}>
								{errors.amount && "Ingresa una cantidad"}
							</HelperText>
						</View>
					</View>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-around",
							width: "70%",
						}}
					>
						<Button
							onPress={handleSubmit(addTransaction)}
							textColor={theme.colors.light}
							mode="contained"
							buttonColor={theme.colors.dark}
							style={{
								borderRadius: 5,
								fontSize: 18,
								marginLeft: 5,
							}}
						>
							Agregar
						</Button>
						<Button
							onPress={() => {
								hideModal();
							}}
							textColor={theme.colors.light}
							mode="contained"
							buttonColor={theme.colors.dark}
							style={{ borderRadius: 5, fontSize: 18, marginLeft: 5 }}
						>
							Cancelar
						</Button>
					</View>
					{initialValues.amount && (
						<Button
							onPress={handleDelete}
							textColor={theme.colors.light}
							mode="contained"
							buttonColor={theme.colors.dark}
							style={{
								borderRadius: 5,
								fontSize: 18,
							}}
						>
							Delete
						</Button>
					)}
				</View>
			</Modal>
		</Portal>
	);
}
