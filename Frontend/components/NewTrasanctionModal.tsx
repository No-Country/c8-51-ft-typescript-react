import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import {
	useTheme,
	Menu,
	Portal,
	Button,
	Modal,
	TextInput,
	ToggleButton,
	RadioButton,
} from "react-native-paper";
import { namesForSymbols } from "../hooks/useFetchBinance";
import { Portfolio, Transaction } from "../screens/PortfolioScreen";
import { ICoin } from "../types";
import { useForm, Controller } from "react-hook-form";

export default function NewTransactionModal({
	visible,
	setVisible,
	coins,
	initialValues,
	hideModal,
	portfolio,
	setPortfolio,
}: {
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
}) {
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
	const [modalCoin, setModalCoin] = useState(initialValues.symbol || null);
	const [modalAmount, setModalAmount] = useState(initialValues.amount || null);
	const [modalPrice, setModalPrice] = useState(initialValues.price || null);
	const [menuSymbolVisible, setMenuSymbolVisible] = useState(false);
	console.log(initialValues);
	const {
		control,
		handleSubmit,
		formState: { errors },
    setValue,
	} = useForm({
		defaultValues: {
			symbol: modalCoin,
			amount: initialValues.amount || null,
			type: initialValues.type || null,
			price: initialValues.price || null,
		},
	});

	const addTransaccion = (data) => {
		console.log(data);
		const newTransaction: Transaction = {
			date: new Date(),
			type: data.type,
			amount: parseFloat(data.amount),
			price: parseFloat(data.price),
		};
		if (portfolio.find((coin) => coin.symbol === modalCoin)) {
			const newPortfolio = portfolio.map((coin) => {
				if (coin.symbol === modalCoin) {
					return {
						...coin,
						transactions: [...coin.transactions, newTransaction],
					};
				}
				return coin;
			});
			setPortfolio(newPortfolio);
		} else {
			const newPortfolio = [
				...portfolio,
				{
					symbol: modalCoin,
					name: namesForSymbols[modalCoin],
					transactions: [newTransaction],
				},
			];
			setPortfolio(newPortfolio);
		}
		hideModal();
	};
	useEffect(() => {
		setModalCoin(initialValues.symbol || null);
    setValue("type", initialValues.type || null);
    setValue("amount", initialValues.amount || null);
    setValue("price", initialValues.price || null);
	}, [initialValues]);

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
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-around",
							width: "70%",
						}}
					>
						<Button
							onPress={handleSubmit(addTransaccion)}
							mode="contained"
							style={{ margin: 10 }}
						>
							Agregar
						</Button>
						{/* cancel button */}
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
