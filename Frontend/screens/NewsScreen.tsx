import {
	View,
	StyleSheet,
	TouchableOpacity,
	ScrollViewComponent,
	ScrollView,
	Linking,
	FlatList,
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
	ActivityIndicator,
	Divider,
} from "react-native-paper";
import { Theme } from "../App";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import React, { useEffect } from "react";
import { AppbarHeader } from "react-native-paper/lib/typescript/components/Appbar/AppbarHeader";
import Search from "../components/Search";
import { useFetchNews } from "../hooks/useFetchNews";
import { black } from "react-native-paper/lib/typescript/styles/themes/v2/colors";
import AppContext from "../components/AppContext";

interface NewsArticle {
	tittle: string;
	paragraph: string;
	image_url: string;
	url: string;
	isFav: boolean;
	id: number;
}

const NewsJson = [
	{
		tittle: "Bitcoin surges to the moon",
		paragraph:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		image_url: "https://picsum.photos/400",
		isFav: true,
		id: 1,
		url: "https://www.google.com",
	},
	{
		tittle: "Ethereum surges to the moon",
		paragraph:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		// picsum image
		image_url: "https://picsum.photos/500",
		isFav: false,
		id: 2,
		url: "https://www.google.com",
	},
	{
		tittle: "Litecoin surges to the moon",
		paragraph:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
		image_url: "https://picsum.photos/700",
		isFav: false,
		id: 3,
		url: "https://www.google.com",
	},
];

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

function NewsCard({ news, isBookmarkedCallback }) {
	const theme = useTheme<Theme>();
	const [loading, setLoading] = React.useState(true);
	// const [isBookmarked, setIsBookmarked] = React.useState(news.isFav);
	return (
		<View style={{ flex: 1, marginTop: 8 }}>
			<Card
				mode="elevated"
				style={{ backgroundColor: theme.colors.pastel, position: "relative" }}
			>
				<View style={{ position: "relative" }}>
					{loading && (
						<ActivityIndicator
							style={{
								position: "absolute",
								zIndex: 100,
								top: -30,
								left: 0,
								right: 0,
								bottom: 0,
								// alignItems: "center",
								// justifyContent: "center",
							}}
							size="large"
							color={theme.colors.dark}
						/>
					)}
					<Card.Cover
						onLoadStart={() => setLoading(true)}
						onLoadEnd={() => setLoading(false)}
						source={{ uri: news.image_url }}
					/>
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
					{/* <IconButton
						icon={isBookmarked ? "bookmark" : "bookmark-outline"}
						iconColor={theme.colors.light}
						onPress={() => {
							setIsBookmarked(!isBookmarked);
							isBookmarkedCallback(news.id);
						}}
					/> */}
				</View>
			</Card>
		</View>
	);
}

export default function NewsSceeen() {
	const { darkMode } = React.useContext(AppContext);
	const [onlyFav, setOnlyFav] = React.useState(false);
	const theme = useTheme<Theme>();
	const [searchQuery, setSearchQuery] = React.useState("");
	const [loading, setLoading] = React.useState(true);
	const [newsArticles, setNewsArticles] = React.useState<NewsArticle[]>([]);
	const [page, setPage] = React.useState(1);
	useFetchNews(loading, setLoading, setNewsArticles, page);
	const onChangeSearch = (query) => {
		setSearchQuery(query);
		if (query.length > 0) {
			setNewsArticles(
				newsArticles.filter(
					(news) =>
						news.tittle.toLowerCase().includes(query.toLowerCase()) ||
						news.paragraph.toLowerCase().includes(query.toLowerCase()),
				),
			);
		}
	};

	const isBookmarkedCallback = (id: number) => {
		setNewsArticles(
			newsArticles.map((news) => {
				if (news.id === id) {
					news.isFav = !news.isFav;
				}
				return news;
			}),
		);
	};

	return (
		<>
			<SafeAreaView style={{ backgroundColor: theme.colors.soft, flex: 1 }}>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<View
						style={{
							flex: 1,
              zIndex: 100,
							shadowColor: "#000000",
							shadowOffset: { width: 0, height: 5 },
							shadowOpacity: 0.5,
							shadowRadius: 2,
						}}
					>
						<Search value={searchQuery} onChangeText={onChangeSearch} />
					</View>
					{/* <IconButton
						icon='bookmark'
						iconColor={onlyFav ? theme.colors.dark : theme.colors.primary}
						onPress={onToggleFav}
					/> */}
				</View>
				{/* <Divider style={{ height: 2, backgroundColor: theme.colors.pastel }} /> */}
				<FlatList
					style={{
						backgroundColor: darkMode ? theme.colors.soft : "#000",
						minHeight: 1000,
					}}
					data={newsArticles}
					renderItem={({ item }) => (
						<TouchableOpacity
							style={{
								shadowColor: "#000000",
								shadowOffset: { width: 0, height: 2 },
								shadowOpacity: 0.5,
								shadowRadius: 2,
							}}
							onPress={() => Linking.openURL(item.url)}
						>
							<NewsCard
								news={item}
								isBookmarkedCallback={isBookmarkedCallback}
							/>
						</TouchableOpacity>
					)}
					keyExtractor={(item) => item.id.toString()}
					onEndReached={() => {
						setPage(page + 1);
						setLoading(true);
					}}
					onEndReachedThreshold={0.1}
					ListFooterComponent={() => (
						<ActivityIndicator animating={loading} size="small" />
					)}
				/>
			</SafeAreaView>
		</>
	);
}
