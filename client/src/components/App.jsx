import {useReducer} from 'react';
import Header from './Header';
import Features from './Features';
import Setyourday from './Setyourday';
import Currentschedule from './Currentschedule';
import Backgroundmode from './Backgroundmode';
import featuresTabHook,{dayStatus} from './Noncomponents';

export default function App() {
  function changeStateInfo(state, action){
    switch (action.type) {
      case "changeFthState":
        return {
          fthState: !state.fthState,
          stdState: state.stdState,
          darkMode: state.darkMode,
          schedulestate: state.schedulestate
        };
      case "changeStdState":
        return {
          fthState: state.fthState,
          stdState: !state.stdState,
          darkMode: state.darkMode,
          schedulestate: state.schedulestate
        };
      case "changeBgState":
        return {
          fthState: state.fthState,
          stdState: state.stdState,
          darkMode: !state.darkMode,
          schedulestate: state.schedulestate
        }
      case "changeScheduleState":
        return {
          fthState: state.fthState,
          stdState: state.stdState,
          darkMode: state.darkMode,
          schedulestate: !state.schedulestate
        }
      default:
        return state;
    };
  };

  const [state, takeAction] = useReducer(changeStateInfo, {fthState:true, stdState:false, darkMode: dayStatus(), schedulestate: false});
  return (
    <featuresTabHook.Provider value={{state, takeAction}}>
     <Header></Header>
     <Features></Features>
     <Setyourday></Setyourday>
     <Currentschedule></Currentschedule>
     <Backgroundmode></Backgroundmode>
    </featuresTabHook.Provider>
  );
}
