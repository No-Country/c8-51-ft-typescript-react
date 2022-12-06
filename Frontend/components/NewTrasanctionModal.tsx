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
	const theme = useTheme();
	const styles = StyleSheet.create({
		contentStyle: {
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
			backgroundColor: theme.colors.background,
			borderRadius: 20,
			padding: 20,
			width: "100%",
		},
		menuTouchable: {
			flexDirection: "row",
			justifyContent: "center",
			alignItems: "center",
			backgroundColor: theme.colors.backdrop,
			padding: 10,
			borderRadius: 10,
			margin: 10,
		},
	});
	const containerStyle = {
		backgroundColor: "white",
		padding: 20,
		height: 400,
		margin: 20,
		borderRadius: 20,
	};
	const [modalType, setModalType] = useState<"buy" | "sell">(
		initialValues.type || null,
	);
	const { user, setUser } = useContext(AppContext);
	const [modalCoin, setModalCoin] = useState(initialValues.symbol || null);
	const [modalAmount, setModalAmount] = useState(initialValues.amount || null);
	const [modalPrice, setModalPrice] = useState(initialValues.price || null);
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
		},
		resolver: yupResolver(validationSchema),
	});

	useEffect(() => {
		setModalCoin(initialValues.symbol || null);
		setValue("type", initialValues.type || null);
		setValue("amount", initialValues.amount || null);
		setValue("price", initialValues.price || null);
	}, [initialValues]);
	function addTransaction(data) {
		console.log("submit", data);
		console.log("json", {
			name: namesForSymbols[modalCoin],
			symbol: modalCoin,
			date: new Date(),
			userID: user.user[0]._id,
			amount: data.amount,
			price: data.price,
			type: data.type,
		});
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
				console.log(data);
				// update the portfolio_id in the user
				setLoading(true);
				let newUser = { ...user };
				newUser.user[0].portfolio_id = data.portfolio_id;
				setUser(newUser);
			})
			.catch((err) => {
				console.log(err);
			});
		hideModal();
	}

	return (
		<Portal>
			<Modal
				visible={visible}
				onDismiss={hideModal}
				contentContainerStyle={containerStyle}
			>
				<View
					style={{
						flex: 1,
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Text style={{ fontSize: 20, fontWeight: "bold" }}>
						Agregar Transacción
					</Text>
					<Menu
						visible={menuSymbolVisible}
						onDismiss={() => setMenuSymbolVisible(false)}
						contentStyle={styles.contentStyle}
						anchor={
							<TouchableOpacity
								onPress={() => setMenuSymbolVisible(true)}
								style={styles.menuTouchable}
							>
								<Text style={{ color: "#fff" }}>
									{modalCoin ? modalCoin : "Seleccionar moneda"}
								</Text>
							</TouchableOpacity>
						}
					>
						{coins.map((coin) => (
							<Menu.Item
								key={coin.symbol}
								onPress={() => {
									setModalCoin(coin.symbol);
									setMenuSymbolVisible(false);
								}}
								title={coin.symbol}
							/>
						))}
					</Menu>
					<Controller
						name="type"
						control={control}
						rules={{ required: true }}
						render={({ field: { onChange, value } }) => (
							<RadioButton.Group onValueChange={onChange} value={value}>
								<View
									style={{
										flexDirection: "row",
										backgroundColor: "#ebb2b2",
									}}
								>
									<RadioButton.Item label="Compra" value="buy" />
									<RadioButton.Item label="Venta" value="sell" />
								</View>
							</RadioButton.Group>
						)}
					/>
					<HelperText type="error" visible={errors.type ? true : false}>
						{errors.type && "Selecciona un tipo de transacción"}
					</HelperText>
					<Controller
						name="price"
						control={control}
						rules={{ required: true }}
						render={({ field: { onChange, onBlur, value } }) => (
							<TextInput
								mode="outlined"
								label={"Precio"}
								style={{ width: 200 }}
								onChangeText={onChange}
								value={value}
								placeholder="Precio"
							/>
						)}
					/>
					<HelperText type="error" visible={errors.price ? true : false}>
						{errors.price && "Ingresa un precio"}
					</HelperText>
					<Controller
						name="amount"
						control={control}
						rules={{ required: true }}
						render={({ field: { onChange, onBlur, value } }) => (
							<TextInput
								mode="outlined"
								label={"Cantidad"}
								style={{ width: 200 }}
								onChangeText={onChange}
								value={value}
								placeholder="Cantidad"
							/>
						)}
					/>
					<HelperText type="error" visible={errors.amount ? true : false}>
						{errors.amount && "Ingresa una cantidad"}
					</HelperText>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-around",
							width: "70%",
						}}
					>
						<Button
							onPress={handleSubmit(addTransaction)}
							mode="contained"
							style={{ margin: 10 }}
						>
							Agregar
						</Button>
						<Button
							onPress={() => {
								hideModal();
							}}
							mode="contained"
							style={{ margin: 10 }}
						>
							Cancelar
						</Button>
					</View>
					{initialValues.amount && (
						<Button
							onPress={() => {
								hideModal();
							}}
							mode="contained"
							style={{ margin: 0 }}
						>
							Delete
						</Button>
					)}
				</View>
			</Modal>
		</Portal>
	);
}
