import {
	View,
	StyleSheet,
	TouchableOpacity,
	Linking,
	FlatList,
} from "react-native";
import {
	useTheme,
	Card,
	Title,
	Paragraph,
	ActivityIndicator,
} from "react-native-paper";
import { Theme } from "../App";
import { SafeAreaView } from "react-native-safe-area-context";
import React  from "react";
import Search from "../components/Search";
import { useFetchNews } from "../hooks/useFetchNews";
import AppContext from "../components/AppContext";

interface NewsArticle {
	tittle: string;
	paragraph: string;
	image_url: string;
	url: string;
	isFav: boolean;
	id: number;
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

function NewsCard({ news, isBookmarkedCallback }) {
	const theme = useTheme<Theme>();
	const [loading, setLoading] = React.useState(true);
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
				</View>
			</Card>
		</View>
	);
}

export default function NewsSceeen() {
	const { darkMode } = React.useContext(AppContext);
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
				</View>
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
