import {useReducer} from 'react';
import Header from './Header/Header';
import Features from './Sidebar/Features'
import Setyourday from './Sidebar/F7/Setyourday';
import Currentschedule from './Sidebar/F1/Currentschedule';
import Backgroundmode from './Header/Backgroundmode';
import featuresTabHook,{dayStatus} from './Noncomponents';
import Dailyactivities from './Sidebar/F2/Dailyactivities';
import Addactivity from './Sidebar/F2/Addactivity';
import Quicksession from './Sidebar/F3/Quicksession';

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
          qastate: state.qastate,
          activityHeading: state.activityHeading
        };
      case "changeStdState":
        return {
          fthState: state.fthState,
          stdState: !state.stdState,
          darkMode: state.darkMode,
          schedulestate: false,
          dailyactstate: false,
          qastate: false,
          activityHeading: false
        };
      case "changeBgState":
        return {
          fthState: state.fthState,
          stdState: state.stdState,
          darkMode: !state.darkMode,
          schedulestate: state.schedulestate,
          dailyactstate: state.dailyactstate,
          qastate: state.qastate,
          activityHeading: state.activityHeading
        }
      case "changeScheduleState":
        return {
          fthState: state.fthState,
          stdState: false,
          darkMode: state.darkMode,
          schedulestate: true,
          dailyactstate: false,
          qastate: false,
          activityHeading: false
        }
      case "changeDailyActState":
        return {
          fthState: state.fthState,
          stdState: false,
          darkMode: state.darkMode,
          schedulestate: false,
          dailyactstate: true,
          qastate: false,
          activityHeading: false
        }

      case "changeQuickSessState":
        return {
          fthState: state.fthState,
          stdState: false,
          darkMode: state.darkMode,
          schedulestate: false,
          dailyactstate: false,
          qastate: !state.qastate,
          activityHeading:false
        }

      case "changeActivityHeading":
        return {
          fthState: state.fthState,
          stdState: false,
          darkMode: state.darkMode,
          schedulestate: false,
          dailyactstate: true,
          qastate: false,
          activityHeading: true
        }
      default:
        return state;
    };
  };

  const [state, takeAction] = useReducer(changeStateInfo, {fthState:true, stdState:false, darkMode: dayStatus(), schedulestate: false, dailyactstate:false, qastate:false, activityHeading:false});
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
