import React,{createContext, useState} from 'react';
import Header from './Header';
import Features from './Features';
export const truthHook = createContext();

export default function App() {
  const [data,changeData] = useState(true);
  return (
    <truthHook.Provider value={{data,changeData}}>
     <Header></Header>
     <Features></Features>
    </truthHook.Provider>
  );
}
