import React,{createContext, useReducer} from 'react';
import Header from './Header';
import Features from './Features';
import Setyourday from './Setyourday';
import { dayStatus } from './Backgroundmode';
import Backgroundmode from './Backgroundmode';

export const featuresTabHook = createContext();

export default function App() {
  function changeStateInfo(state, action){
    switch (action.type) {
      case "changeFthState":
        return {
          fthState: !state.fthState,
          stdState: state.stdState,
          darkMode: state.darkMode
        };
      case "changeStdState":
        return {
          fthState: state.fthState,
          stdState: !state.stdState,
          darkMode: state.darkMode
        };
      case "changeBgState":
        return {
          fthState: state.fthState,
          stdState: state.stdState,
          darkMode: !state.darkMode
        }
      default:
        return state;
        break;
    };
  };

  const [state, takeAction] = useReducer(changeStateInfo, {fthState:true, stdState:false, darkMode: dayStatus()});
  return (
    <featuresTabHook.Provider value={{state, takeAction}}>
     <Header></Header>
     <Features></Features>
     <Setyourday></Setyourday>
     <Backgroundmode></Backgroundmode>
    </featuresTabHook.Provider>
  );
}
