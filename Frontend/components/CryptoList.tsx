import { StyleSheet, View } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import { Item } from 'react-native-paper/lib/typescript/components/Drawer/Drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Theme } from '../App';
import { ICoin } from '../types';

const styles = StyleSheet.create({
    container: {
        height: '100%'
    },
    surface: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        // borderBottomWidth: 1,
        // borderBottomColor: colors.border,
    },
    containerContainer: { height: '100%' },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    itemNameContainer: { flex: 0, flexDirection: 'column', width: 50 },
    itemNameSymbol: { fontSize: 16 },
    itemNameSub: {
        fontSize: 8,
        fontWeight: 'normal',
    },
    itemPriceContainer: { width: 80 },
    itemPrice: { fontSize: 16 },
    tazationContainer: {
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center',
        width: 60,
        justifyContent: 'center',
    },
    tazation: { fontSize: 12 },
});

interface IProps {
    items: ICoin[],
    isFavCallback: (symbol: string) => void,
}

export default function CryptoList(props: IProps) {
    const { items } = props;
    const { isFavCallback } = props;
    const theme = useTheme<Theme>();

    function ListItem(coin: ICoin) {
        return (
            <Surface style={styles.itemContainer}>
                <View style={styles.itemNameContainer}>
                    <Text style={{ ...styles.itemNameSymbol, color: theme.colors.text }}>{coin.symbol}{' '}</Text>
                    <Text style={{ ...styles.itemNameSub, color: theme.colors.text }}>{coin.name}</Text>
                </View>
                <View style={styles.itemPriceContainer}>
                    <Text style={{ ...styles.itemPrice, color: theme.colors.text }}>${coin.price}</Text>
                </View>
                <View style={styles.tazationContainer}>
                    <Text style={{ ...styles.tazation, color: coin.change24h > 0 ? 'green' : 'red' }}>
                        {coin.change24h > 0 ? '+' : ''}{coin.change24h}%
                    </Text>
                </View>
                <View>
                    <MaterialCommunityIcons
                        name={coin.isFav ? 'star' : 'star-outline'}
                        color={coin.isFav ? 'orange' : 'black'}
                        size={20}
                        onPress={() => isFavCallback(coin.symbol)}
                    />
                </View>
            </Surface >
        );
    }

    return (
        <View style={{ ...styles.container, backgroundColor: theme.colors.background }}>
            <Surface style={{ ...styles.surface, backgroundColor: theme.colors.background }}>
                <Text style={{ color: theme.colors.text, width: 50 }}>Name</Text>
                <Text style={{ color: theme.colors.text, width: 80 }}>Price</Text>
                <Text style={{ color: theme.colors.text }}>24h</Text>
                <Text style={{ color: theme.colors.text }}>Favs</Text>
            </Surface>
            {items.map((coin) => <ListItem key={coin.name + coin.symbol} {...coin} />)}
        </View>
    );
};