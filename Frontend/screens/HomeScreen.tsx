import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {
  Button,
  Searchbar,
  withTheme,
  Surface,
  IconButton,
  useTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Theme } from '../App';
import { ICoin } from '../types';
import CryptoList from '../components/CryptoList';

const Tab = createMaterialTopTabNavigator();
// import BottomNav from '../components/BottomNav';
const cryptoJson: ICoin[] = [
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 15100.12,
    change24h: 10.5,
    isFav: true,
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    price: 400.51,
    change24h: -2.5,
    isFav: false,
  },
  {
    name: 'Litecoin',
    symbol: 'LTC',
    price: 100,
    change24h: 0.5,
    isFav: false,
  },
];



function Home(props) {
  const theme = useTheme<Theme>();
  const [searchQuery, setSearchQuery] = useState('');
  const [allCoins, setAllCoins] = useState(cryptoJson);

  const isFavCallback = (symbol: string) => {
    const newAllCoins = allCoins.map((item) => {
      if (item.symbol === symbol) {
        item.isFav = !item.isFav;
      }
      return item;
    });
    setAllCoins(newAllCoins);
  };

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    setAllCoins(
      cryptoJson.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.symbol.toLowerCase().includes(query.toLowerCase()),
      ),
    );
  };

  return (
    <>
      <SafeAreaView style={{ ...styles.container, backgroundColor: theme.colors.light }}>
        <Searchbar
          placeholder='Search'
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.search}
        />
        <View style={styles.containerContainer}>
          <Tab.Navigator>
            <Tab.Screen name='All'>
              {() => <CryptoList
                items={allCoins}
                isFavCallback={isFavCallback}
              />}
            </Tab.Screen>
            <Tab.Screen name='Favs'>
              {() => <CryptoList
                items={allCoins.filter((item) => item.isFav)}
                isFavCallback={isFavCallback}
              />}
            </Tab.Screen>
          </Tab.Navigator>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  search: { margin: 10, borderRadius: 40, height: 40 },
  containerContainer: { height: '100%' }
});

export default withTheme(Home);
