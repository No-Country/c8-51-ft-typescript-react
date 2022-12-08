import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useContext, useEffect, useState } from "react";
import { ICoin } from "../types";
import Search from "../components/Search";
import {
	TextInput,
	List,
	ThemeProvider,
	useTheme,
	Menu,
	Divider,
	Button,
} from "react-native-paper";
import { Theme } from "../App";
import AppContext from "../components/AppContext";

type currencyItem = {
	name: string;
	symbol: string;
};
interface ExchangeInputProps {
	value: string;
	OnChangeInput: (value: string) => void;
	selectedCoin: currencyItem;
	setSelectedCoin: (item: currencyItem) => void;
	data: currencyItem[];
}

const ExchangeInput = ({
	value,
	OnChangeInput,
	selectedCoin,
	setSelectedCoin,
	data,
}: ExchangeInputProps) => {
	const theme = useTheme<Theme>();
	const [visible, setVisible] = useState(false);
	const openMenu = () => setVisible(true);
	const closeMenu = () => setVisible(false);

	return (
		<View style={{ flexDirection: "row",alignItems:"flex-end", backgroundColor: theme.colors.soft }}>
			<TextInput
				mode="outlined"
				value={value}
				onChangeText={(value) => OnChangeInput(value)}
				label={selectedCoin ? `${selectedCoin.symbol} Amount` : "Amount"}
				style={{ ...styles.textInput, backgroundColor: theme.colors.soft }}
				textColor={theme.colors.text}
				outlineStyle={{ borderColor: theme.colors.dark }}
				placeholderTextColor={theme.colors.text}
				activeOutlineColor={theme.colors.dark}
			/>
			<View style={{ ...styles.menuContainer }}>
				<Menu
					visible={visible}
					onDismiss={closeMenu}
          contentStyle={{
            backgroundColor: theme.colors.soft,
            ...styles.contentStyle,
          }}
					anchor={
						<Button
            buttonColor={theme.colors.dark} 
            onPress={openMenu}>
							{selectedCoin ? selectedCoin.name : "Select a coin"}
						</Button>
					}
				>
					{data.map((item) => {
						return (
							<Menu.Item
								contentStyle={{
									backgroundColor: theme.colors.soft,
									...styles.contentStyle,
								}}
								style={{
									backgroundColor: theme.colors.soft,
									...styles.contentStyle,
								}}
								key={item.symbol}
								titleStyle={{ color: theme.colors.text }}
								onPress={() => {
									setSelectedCoin(item);
									closeMenu();
								}}
								title={item.name}
							/>
						);
					})}
				</Menu>
			</View>
		</View>
	);
};
export default function CurrencyConverterScreen() {
	const theme = useTheme<Theme>();
	const [searchQuery, setSearchQuery] = useState("");
	const { coins, setCoins } = useContext(AppContext);
	const data = coins.map((item) => {
		return { name: item.symbol, symbol: item.symbol };
	});
	const [firstSelectedCoin, setFirstSelectedCoin] =
		useState<currencyItem>(null);

	const [firtCoinValue, setFirstCoinValue] = useState("");
	const [secondSelectedCoin, setSecondSelectedCoin] =
		useState<currencyItem>(null);
	const [secondCoinValue, setSecondCoinValue] = useState("");
	const [currency, setCurrency] = useState("USD");
	const [currencyValue, setCurrencyValue] = useState("");

	const OnChangeFirstInput = (value: string) => {
		setFirstCoinValue(value);
		if (firstSelectedCoin) {
			const firstCoinPrice = coins.find(
				(item) => item.symbol === firstSelectedCoin.symbol,
			).price;
			const result = (
				(parseFloat(value || "0") * firstCoinPrice).toFixed(2) || ""
			).toString();
			setCurrencyValue(result);
			if (secondSelectedCoin) {
				const secondCoinPrice = coins.find(
					(item) => item.symbol === secondSelectedCoin.symbol,
				).price;
				const result = (
					(
						(parseFloat(value || "0") * firstCoinPrice) /
						secondCoinPrice
					).toFixed(2) || ""
				).toString();
				setSecondCoinValue(result);
			}
		}
	};
	useEffect(() => {
		OnChangeFirstInput(firtCoinValue);
	}, [firstSelectedCoin, secondSelectedCoin]);
	const OnChangeSecondInput = (value: string) => {
		setSecondCoinValue(value);
		if (secondSelectedCoin) {
			const secondCoinPrice = coins.find(
				(item) => item.symbol === secondSelectedCoin.symbol,
			).price;
			const result = (
				(parseFloat(value || "0") * secondCoinPrice).toFixed(2) || ""
			).toString();
			setCurrencyValue(result);
			if (firstSelectedCoin) {
				const firstCoinPrice = coins.find(
					(item) => item.symbol === firstSelectedCoin.symbol,
				).price;
				const result = (
					(
						(parseFloat(value || "0") * secondCoinPrice) /
						firstCoinPrice
					).toFixed(2) || ""
				).toString();
				setFirstCoinValue(result);
			}
		}
	};
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.soft }}>
			<Search value={searchQuery} onChangeText={setSearchQuery} />
			<View style={{ flex: 1 }}>
				<ExchangeInput
					value={firtCoinValue}
					OnChangeInput={OnChangeFirstInput}
					selectedCoin={firstSelectedCoin}
					setSelectedCoin={setFirstSelectedCoin}
					data={data}
				/>
				<ExchangeInput
					value={secondCoinValue}
					OnChangeInput={OnChangeSecondInput}
					selectedCoin={secondSelectedCoin}
					setSelectedCoin={setSecondSelectedCoin}
					data={data}
				/>
				<View
					style={{
						height: 50,
						margin: 10,
						backgroundColor: theme.colors.dark,
						display: "flex",
						justifyContent: "center",
						shadowColor: "#000000",
						shadowOffset: { width: 0, height: 2 },
						shadowOpacity: 0.5,
						shadowRadius: 2,
					}}
				>
					<Text
						style={{
							margin: 10,
							fontSize: 20,
							// backgroundColor: theme.colors.dark,
							color: theme.colors.light,
						}}
					>
						${currencyValue} USDT
					</Text>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
	},
	textInput: {
		flex: 1,
		height: 40,
		margin: 10,
	},
	menuContainer: {
		flex: 1,
		height: 40,
		margin: 10,
		justifyContent: "center",
		alignItems: "center",
	},
	contentStyle: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
});
