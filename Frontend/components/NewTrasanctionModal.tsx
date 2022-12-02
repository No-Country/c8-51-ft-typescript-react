import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import {
	useTheme,
	Menu,
	Portal,
	Button,
	Modal,
	TextInput,
} from "react-native-paper";
import { ICoin } from "../types";

export default function NewTransactionModal({
	visible,
	setVisible,
	coins,
	initialValues,
}: {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	coins: ICoin[];
	initialValues?: {
		symbol: string;
		amount: string;
		type: string;
		price: string;
	};
}) {
	console.log({ initialValues });
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
	const hideModal = () => setVisible(false);
	const containerStyle = {
		backgroundColor: "white",
		padding: 20,
		height: 400,
		margin: 20,
		borderRadius: 20,
	};
	const [modalType, setModalType] = useState(initialValues.type || null);
	const [menuTypeVisible, setMenuTypeVisible] = useState(false);
	const [modalCoin, setModalCoin] = useState(initialValues.symbol || null);
	const [modalAmount, setModalAmount] = useState(initialValues.amount || null);
	const [modalPrice, setModalPrice] = useState(initialValues.price || null);
	const [menuSymbolVisible, setMenuSymbolVisible] = useState(false);
	const addTransaccion = () => {
		console.log("addCoin");
	};
  useEffect(() => {
    setModalType(initialValues.type || null);
    setModalCoin(initialValues.symbol || null);
    setModalAmount(initialValues.amount || null);
    setModalPrice(initialValues.price || null);
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
						// display: "flex",
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
					<Menu
						visible={menuTypeVisible}
						onDismiss={() => setMenuTypeVisible(false)}
						contentStyle={styles.contentStyle}
						anchor={
							<TouchableOpacity
								onPress={() => setMenuTypeVisible(true)}
								style={styles.menuTouchable}
							>
								<Text style={{ color: "#fff" }}>
									{modalType ? modalType : "Seleccionar tipo"}
								</Text>
							</TouchableOpacity>
						}
					>
						<Menu.Item
							onPress={() => {
								setModalType("buy");
								setMenuTypeVisible(false);
							}}
							title="Comprar"
						/>
						<Menu.Item
							onPress={() => {
								setModalType("sell");
								setMenuTypeVisible(false);
							}}
							title="Vender"
						/>
					</Menu>

					<TextInput
						mode="outlined"
						label={"Precio"}
						style={{
							width: 200,
						}}
						onChangeText={(text) => setModalPrice(text)}
						value={modalPrice}
						placeholder="Precio"
					/>
					<TextInput
						mode="outlined"
						label={"Cantidad"}
						style={{
							width: 200,
						}}
						onChangeText={(text) => setModalAmount(text)}
						value={modalAmount}
						placeholder="Cantidad"
					/>
					<Button
						// onPress={addCoin}
						onPress={() => {
							addTransaccion();
							hideModal();
						}}
						mode="contained"
						style={{ margin: 10 }}
					>
						Agregar
					</Button>
				</View>
			</Modal>
		</Portal>
	);
}
