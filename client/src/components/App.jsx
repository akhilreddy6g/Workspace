import React,{createContext, useState} from 'react';
import Header from './Header';
import Features from './Features';
import Background from './FeatureBackground';
export const truthHook = createContext();

export default function App() {
  const [data,changeData] = useState(true);
  return (
    <truthHook.Provider value={{data,changeData}}>
     <Header></Header>
     <Background></Background>
     <Features></Features>
    </truthHook.Provider>
  );
}
