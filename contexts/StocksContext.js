import React, { useState, useContext, useEffect } from "react";
import { AsyncStorage } from "react-native";

const StocksContext = React.createContext();

export const StocksProvider = ({ children }) => {
  const [state, setState] = useState([]);

  return (
    <StocksContext.Provider value={[state, setState]}>
      {children}
    </StocksContext.Provider>
  );
};

export const useStocksContext = () => {
  const [state, setState] = useContext(StocksContext);

  // can put more code here
  async function loadFromDisk(){
    try{
      const dataFromDisk = await AsyncStorage.getItem("log");
      if(dataFromDisk !== null) setState(JSON.parse(dataFromDisk));
    }catch{
      alert("Disk corrupted");
    }
  }

  function addToWatchlist(newSymbol) {
    //FixMe: add the new symbol to the watchlist, save it in useStockContext state and persist to AsyncStorage
    if(!state.includes(newSymbol)){
      setState( prev => {
        return prev.concat(newSymbol);
      });
      try {
        AsyncStorage.setItem("log", JSON.stringify(state));
      } catch{
        alert("Error");
      }
    } else {
      alert("The selected stock is already in the WatchList!");
    }
  }

  useEffect(() => {
    // FixMe: Retrieve watchlist from persistent storage
    loadFromDisk();
  }, []);

  return { ServerURL: 'http://131.181.190.87:3001', watchList: state,  addToWatchlist };
};
