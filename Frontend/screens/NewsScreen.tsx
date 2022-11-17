import {
	View,
	StyleSheet,
	TouchableOpacity,
	ScrollViewComponent,
	ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
	useTheme,
	Button,
	withTheme,
	Card,
	Title,
	Paragraph,
	IconButton,
	Appbar,
	Searchbar,
} from "react-native-paper";
import { Theme } from "../App";
import { SafeAreaView } from "react-native-safe-area-context";
// import material icon bookmark
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import React from "react";
import { AppbarHeader } from "react-native-paper/lib/typescript/components/Appbar/AppbarHeader";

const NewsJson = [
	{
		tittle: "Bitcoin surges to the moon",
		paragraph:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		image_url: "https://picsum.photos/400",
		isFav: true,
		id: 1,
	},
	{
		tittle: "Ethereum surges to the moon",
		paragraph:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		// picsum image
		image_url: "https://picsum.photos/500",
		isFav: false,
		id: 2,
	},
	{
		tittle: "Litecoin surges to the moon",
		paragraph:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		image_url: "https://picsum.photos/700",
		isFav: false,
		id: 3,
	},
];

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

function NewsCard({ news, isBookmarkedCallback }) {
	const theme = useTheme<Theme>();
	const [isBookmarked, setIsBookmarked] = React.useState(news.isFav);

	return (
		<View style={{ flex: 1, marginVertical: 8 }}>
			<Card mode="elevated" style={{ backgroundColor: theme.colors.light }}>
				<View>
					<Card.Cover source={{ uri: news.image_url }} />
				</View>
				<Card.Content style={{ padding: 0 }}>
					<Title
						style={{
							color: theme.colors.text,
							fontSize: 20,
							fontWeight: "bold",
							paddingVertical: 4,
						}}
					>
						{news.tittle}
					</Title>
					<Paragraph
						style={{
							color: theme.colors.text,
							fontSize: 12,
							paddingVertical: 4,
							textAlign: "justify",
						}}
					>
						{news.paragraph}
					</Paragraph>
				</Card.Content>
				<View
					style={{
						position: "absolute",
						right: 0,
						top: 0,
					}}
				>
					<IconButton
						icon={isBookmarked ? "bookmark" : "bookmark-outline"}
						// containerColor={theme.colors.light}
						iconColor={theme.colors.light}
						onPress={() => {
							setIsBookmarked(!isBookmarked);
							isBookmarkedCallback(news.id);
						}}
					/>
				</View>
			</Card>
		</View>
	);
}
export default function NewsSceeen() {
	const [newsState, setNewsState] = React.useState(NewsJson);
	const [onlyFav, setOnlyFav] = React.useState(false);
	const theme = useTheme<Theme>();
	const [searchQuery, setSearchQuery] = React.useState("");
	const onChangeSearch = (query) => {
		setSearchQuery(query);
		if (query.length > 0) {
			setNewsState(
				NewsJson.filter(
					(news) =>
						news.tittle.toLowerCase().includes(query.toLowerCase()) ||
						news.paragraph.toLowerCase().includes(query.toLowerCase()),
				),
			);
		}
	};
	const onToggleFav = () => {
		setOnlyFav(!onlyFav);
		if (onlyFav) {
			setNewsState(NewsJson.filter((news) => news.isFav));
		} else {
			setNewsState(NewsJson);
		}
	};
	const isBookmarkedCallback = (id: number) => {
		setNewsState(
			newsState.map((news) => {
				if (news.id === id) {
					news.isFav = !news.isFav;
				}
				return news;
			}),
		);
	};

	return (
		<>
			<SafeAreaView style={{ backgroundColor: theme.colors.light, flex: 1 }}>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<View style={{ flex: 1 }}>
						<Searchbar
							style={{ margin: 10, borderRadius: 40, height: 40 }}
							value={searchQuery}
							onChangeText={onChangeSearch}
							placeholder="Search"
						/>
					</View>
					<IconButton
						icon='bookmark'
						iconColor={onlyFav ? theme.colors.dark : theme.colors.primary}
						onPress={onToggleFav}
					/>
				</View>
				<ScrollView style={{ backgroundColor: theme.colors.background }}>
					{newsState.map((news, index) =>
						(onlyFav || news.isFav ) ? (
							<NewsCard
								news={news}
								key={index}
								isBookmarkedCallback={isBookmarkedCallback}
							/>
						) : null,
					)}
				</ScrollView>
			</SafeAreaView>
		</>
	);
}
