import {useReducer} from 'react';
import Header from './Header';
import Features from './Features';
import Setyourday from './Setyourday';
import Currentschedule from './Currentschedule';
import Backgroundmode from './Backgroundmode';
import featuresTabHook,{dayStatus} from './Noncomponents';
import Dailyactivities from './Dailyactivities';
import Addactivity from './Addactivity';

export default function App() {
  function changeStateInfo(state, action){
    switch (action.type) {
      case "changeFthState":
        return {
          fthState: !state.fthState,
          stdState: state.stdState,
          darkMode: state.darkMode,
          schedulestate: state.schedulestate,
          dailyactstate: state.dailyactstate
        };
      case "changeStdState":
        return {
          fthState: state.fthState,
          stdState: !state.stdState,
          darkMode: state.darkMode,
          schedulestate: false,
          dailyactstate: false
        };
      case "changeBgState":
        return {
          fthState: state.fthState,
          stdState: state.stdState,
          darkMode: !state.darkMode,
          schedulestate: state.schedulestate,
          dailyactstate: state.dailyactstate
        }
      case "changeScheduleState":
        return {
          fthState: state.fthState,
          stdState: false,
          darkMode: state.darkMode,
          schedulestate: true,
          dailyactstate: false
        }
      case "changeDailyActState":
        return {
          fthState: state.fthState,
          stdState: false,
          darkMode: state.darkMode,
          schedulestate: false,
          dailyactstate: true
        }
      default:
        return state;
    };
  };

  const [state, takeAction] = useReducer(changeStateInfo, {fthState:true, stdState:false, darkMode: dayStatus(), schedulestate: false, dailyactstate:false});
  return (
    <featuresTabHook.Provider value={{state, takeAction}}>
     <Header></Header>
     <Features></Features>
     <Setyourday></Setyourday>
     <Currentschedule></Currentschedule>
     <Dailyactivities></Dailyactivities>
     <Addactivity></Addactivity>
     <Backgroundmode></Backgroundmode>
    </featuresTabHook.Provider>
  );
}
