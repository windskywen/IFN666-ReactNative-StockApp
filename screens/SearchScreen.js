import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Keyboard, TextInput, FlatList, Text } from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';
import { Ionicons } from '@expo/vector-icons';
import { gray, white } from 'color-name';
import * as Font from "expo-font";
import { TouchableOpacity } from 'react-native-gesture-handler';


// FixMe: implement other components and functions used in SearchScreen here (don't just put all the JSX in SearchScreen below)


export default function SearchScreen({ navigation }) {
  const { ServerURL, addToWatchlist } = useStocksContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isSearch, setIsSearch] = useState(false);
  const [sourceData, setSourceData] = useState({});
  const [filteredData, setFilteredData] = useState({});

  // can put more code here
  const inputHandler = (enteredText) => {
    if(enteredText == ""){
      setIsSearch(false);
    }else{
      // once the entered text match either the symbol or the name of a company 
      // the stock will be displayed on the screen
      const newData = sourceData.filter(item => {      
        const itemData = item.symbol.toUpperCase();
        const itemName = item.name.toUpperCase();
        const textData = enteredText.toUpperCase()
        if(itemData.indexOf(textData) > -1 || itemName.indexOf(textData) > -1){
          return true;    
        }
      });
      setFilteredData(newData);
      setIsSearch(true);
    }
  }

  // pressHandler controls the action after click a specific stock
  // add the symbol of the stock to watchList and navigate the page to Stock page
  const pressHandler = (item) =>{
    addToWatchlist(item.symbol);
    navigation.navigate('Stocks');
  }

  useEffect(() => {
    // FixMe: fetch symbol names from the server and save in local SearchScreen state
    async function doFetch() {
      try {
        const response = await fetch(ServerURL+"/all");
        if(response.ok){
          const data = await response.json();
          isLoading ? setSourceData(data) : null;
          isLoading ? setFilteredData(data) : null;
        }
      } catch (error) {
        // We might want to provide this error information to an error reporting service
        console.warn(error);
      } 
      setIsLoading(false);
    }
    doFetch();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View>
          <TextInput
            style={styles.searchBar} 
            placeholder="Search a stock symbol or name" 
            placeholderTextColor='white' 
            onChangeText={text => inputHandler(text)}
          />
        </View>
        { isSearch ?
          <FlatList 
            keyExtractor={item => item.symbol}
            data={filteredData}
            renderItem={({item})=>(
              <TouchableOpacity activeOpacity={0.4} style={styles.itemContainer} onPress={() => pressHandler(item)}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <Text style={styles.itemSymbol}>{item.symbol}</Text>
                  <Text style={styles.itemIndustry}>{item.industry}</Text>
                </View>
                <Text style={styles.itemName}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
          : null
        }
      </View>
    </TouchableWithoutFeedback>    
  )
}

const styles = StyleSheet.create({
// FixMe: add styles here ...
// use scaleSize(x) to adjust sizes for small/large screens
  container: {
    flex: 1,
  },
  icon:{
    color: "white",
    marginTop: 15,
  },
  searchBar: {
    height: scaleSize(40),
    width: '95%',
    marginVertical: 10,
    marginLeft: 3,
    padding: 10,
    backgroundColor: "#242423",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    color: "white"
  },
  itemContainer:{
    marginVertical: 1,
    borderTopColor: "#696969", 
    borderTopWidth: 0.3,
    marginHorizontal: 5,
    paddingTop: 8,
    paddingBottom: 10,
    
  },
  itemSymbol:{
    color: "white",
    backgroundColor: "black",
    marginVertical: 1,
    marginRight: 1,
    fontSize: 25,
    width: scaleSize(78),
  },
  itemIndustry:{
    color: "#a9a9a9",
    backgroundColor: "black",
    marginTop: 11,
    fontSize: 14,
  },
  itemName:{
    color: "#778899",
    backgroundColor: "black",
    marginVertical: 1,
    fontSize: 18,
  },
});