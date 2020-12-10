import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text} from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';
import { FlatList } from 'react-native-gesture-handler';
import { TouchableOpacity } from 'react-native-gesture-handler';



// FixMe: implement other components and functions used in StocksScreen here (don't just put all the JSX in StocksScreen below)
function ShowPercentage(props){
  const isRise = props.price.open - props.price.close < 0 ? true : false;
  const Percentage = ((props.price.close - props.price.open)*100 / props.price.open).toFixed(2);
  if(isRise){
    return (
      <Text style={styles.risePercentage}>{"+" + Percentage + "%"}</Text>
    );
  }else if(!isRise){
    return(
      <Text style={styles.downPercentage}>{Percentage + "%"}</Text>
    );
  }
}


export default function StocksScreen({route}) {
  const { ServerURL, watchList } = useStocksContext();
  const [lastData, setLastData] = useState([])
  const [selectedData, setSelectedData] = useState([]);

  // can put more code here
  function showStockInfo(input){
    setLastData(input);
  }

  useEffect(() => {
    // FixMe: fetch stock data from the server for any new symbols added to the watchlist and save in local StocksScreen state  
    Promise.all(watchList.map(item=>{
      return fetch(ServerURL+"/history?symbol="+item)
          .then(res=>res.json())
          .then(data=>{
            setLastData(data)
            return data[0];
          })
    })).then(value=>{setSelectedData(value);})
  }, [watchList]);

  return (
    <React.Fragment>
      <View style={styles.stockContainer}>
          { watchList.length > 0 ?
          <FlatList
            keyExtractor={item => item.symbol} 
            data={selectedData}
            renderItem={({item}) =>(
              <TouchableOpacity activeOpacity={0.4} style={styles.itemContainer} onPress={()=>showStockInfo(item)}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <Text style={styles.itemSymbol}>{item.symbol}</Text>
                  <Text style={styles.itemClose}>{item.close}</Text>
                  <ShowPercentage style={{}} price={item}/>
                </View>
              </TouchableOpacity>
            )}
          />
          : null}
      </View>
      <View style={styles.infoContainer}>
          <View style={styles.infoTitleContainer}>
            <Text style={styles.infoTitle}>{lastData.name}</Text>
          </View>
          <View style={styles.infoPriceContainer}>
            <View style={styles.infoPriceDetail}>
              <Text style={styles.priceTitle}>OPEN</Text>
              <Text style={styles.priceData}>{lastData.open}</Text>
            </View>
            <View style={styles.infoPriceDetail}>
              <Text style={styles.priceTitle}>LOW</Text>
              <Text style={styles.priceData}>{lastData.low}</Text>
            </View>
          </View>
          <View style={styles.infoPriceContainer}>
            <View style={styles.infoPriceDetail}>
              <Text style={styles.priceTitle}>CLOSE</Text>
              <Text style={styles.priceData}>{lastData.close}</Text>
            </View>
            <View style={styles.infoPriceDetail}>
              <Text style={styles.priceTitle}>HIGH</Text>
              <Text style={styles.priceData}>{lastData.high}</Text>
            </View>
          </View>
          <View style={styles.infoPriceContainer}>
            <View style={styles.infoPriceDetail}>
              <Text style={styles.priceTitle}>VOLUMES</Text>
              <Text style={styles.priceData}>{lastData.volumes}</Text>
            </View>
            <View style={styles.infoPriceDetail}>
              <Text style={styles.priceTitle}></Text>
              <Text style={styles.priceData}></Text>
            </View>
          </View>
      </View>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  // FixMe: add styles here ...
  // use scaleSize(x) to adjust sizes for small/large screens
  stockContainer:{
    height: "70%",
  },
  infoContainer:{
    height: "30%",
  },
  itemContainer:{
    marginVertical: 1,
    borderTopColor: "#696969", 
    borderTopWidth: 0.3,
    marginHorizontal: 2,
    paddingTop: 5,
    paddingBottom: 5,
  },
  itemSymbol:{
    color: "white",
    backgroundColor: "black",
    marginVertical: 1,
    marginRight: 1,
    fontSize: scaleSize(22),
    width: "45%",
    textAlignVertical: "center",
    paddingTop: 6,
  },
  itemClose:{
    color: "white",
    backgroundColor: "black",
    marginVertical: 1,
    marginRight: 5,
    fontSize: scaleSize(20),
    width: "25%",
    textAlignVertical: "center",
    textAlign:"right",
    paddingTop: 6,
    paddingRight: 15,
  },
  risePercentage:{
    fontSize:scaleSize(20), 
    color:"white",
    backgroundColor: "red",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "black",
    overflow: "hidden",
    width: "25%",
    marginRight: 3,
    padding:5,
    textAlign: "right", 
  },
  downPercentage:{
    fontSize:20, 
    color:"white",
    backgroundColor: "green",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "black",
    overflow: "hidden",
    width: "25%",
    marginRight: 1,
    padding:5,
    textAlign: "right", 
  },
  infoTitleContainer:{
    borderTopColor: "#a9a9a9", 
    borderTopWidth: 0.3,
    borderBottomColor: "#a9a9a9", 
    borderBottomWidth: 0.3,
    height:"25%",
    backgroundColor: "#242423",
    paddingTop:7,
  },
  infoTitle:{
    color: "white",
    fontSize: 21,
    textAlign: "center",
    textAlignVertical: "center",
  },
  infoPriceContainer:{
    height: "25%",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 12,
    borderBottomColor: "#a9a9a9", 
    borderBottomWidth: 0.3,
    backgroundColor: "#242423",

  },
  infoPriceDetail:{
    width:"40%",
    color:"white",
    flexDirection:"row",
    justifyContent: "space-between",
  },
  priceTitle:{
    color:"#a9a9a9",
    textAlign: "left",
  },
  priceData:{
    color:"white",
    textAlign: "right",
  },
});
