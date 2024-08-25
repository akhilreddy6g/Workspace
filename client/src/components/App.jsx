import {useReducer} from 'react';
import Header from './Header';
import Features from './Features';
import Setyourday from './F7/Setyourday';
import Currentschedule from './F1/Currentschedule';
import Backgroundmode from './Backgroundmode';
import featuresTabHook,{dayStatus} from './Noncomponents';
import Dailyactivities from './F2/Dailyactivities';
import Addactivity from './F2/Addactivity';
import Quicksession from './F3/Quicksession';

export default function App() {
  function changeStateInfo(state, action){
    switch (action.type) {
      case "changeFthState":
        return {
          fthState: !state.fthState,
          stdState: state.stdState,
          darkMode: state.darkMode,
          schedulestate: state.schedulestate,
          dailyactstate: state.dailyactstate,
          qastate: state.qastate
        };
      case "changeStdState":
        return {
          fthState: state.fthState,
          stdState: !state.stdState,
          darkMode: state.darkMode,
          schedulestate: false,
          dailyactstate: false,
          qastate: false
        };
      case "changeBgState":
        return {
          fthState: state.fthState,
          stdState: state.stdState,
          darkMode: !state.darkMode,
          schedulestate: state.schedulestate,
          dailyactstate: state.dailyactstate,
          qastate: state.qastate
        }
      case "changeScheduleState":
        return {
          fthState: state.fthState,
          stdState: false,
          darkMode: state.darkMode,
          schedulestate: true,
          dailyactstate: false,
          qastate: false
        }
      case "changeDailyActState":
        return {
          fthState: state.fthState,
          stdState: false,
          darkMode: state.darkMode,
          schedulestate: false,
          dailyactstate: true,
          qastate: false
        }

      case "changeQuickSessState":
        return {
          fthState: state.fthState,
          stdState: false,
          darkMode: state.darkMode,
          schedulestate: false,
          dailyactstate: false,
          qastate: !state.qastate
        }
      default:
        return state;
    };
  };

  const [state, takeAction] = useReducer(changeStateInfo, {fthState:true, stdState:false, darkMode: dayStatus(), schedulestate: false, dailyactstate:false, qastate:false});
  return (
    <featuresTabHook.Provider value={{state, takeAction}}>
     <Header></Header>
     <Features></Features>
     <Setyourday></Setyourday>
     <Quicksession></Quicksession>
     <Currentschedule></Currentschedule>
     <Dailyactivities></Dailyactivities>
     <Addactivity></Addactivity>
     <Backgroundmode></Backgroundmode>
    </featuresTabHook.Provider>
  );
}
