import React,{createContext, useReducer} from 'react';
import Header from './Header';
import Features from './Features';
import Setyourday from './Setyourday';
export const featuresTabHook = createContext();

export default function App() {
  function changeStateInfo(state, action){
    switch (action.type) {
      case "changeFthState":
        return {
          fthState: !state.fthState,
          stdState: state.stdState
        };
      case "changeStdState":
        return {
          fthState: state.fthState,
          stdState: !state.stdState
        };
      default:
        break;
    };
  };

  const [state, takeAction] = useReducer(changeStateInfo, {fthState:true, stdState:false});
  return (
    <featuresTabHook.Provider value={{state, takeAction, changeStateInfo}}>
     <Header></Header>
     <Features></Features>
     <Setyourday></Setyourday>
    </featuresTabHook.Provider>
  );
}
