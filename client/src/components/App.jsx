import {useReducer} from 'react';
import Header from './Header/Header';
import Features from './Sidebar/Features';
import Backgroundmode from './Header/Backgroundmode';
import featuresTabHook,{dayStatus} from './Noncomponents';
import { BrowserRouter as Router} from 'react-router-dom';
import Approuter from './Sidebar/Approuter';

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
          activityHeading: state.activityHeading,
          zeroActivity: state.zeroActivity
        };
      case "changeStdState":
        return {
          fthState: state.fthState,
          stdState: !state.stdState,
          darkMode: state.darkMode,
          schedulestate: false,
          dailyactstate: false,
          qastate: false,
          activityHeading: false,
          zeroActivity: state.zeroActivity
        };
      case "changeBgState":
        return {
          fthState: state.fthState,
          stdState: state.stdState,
          darkMode: !state.darkMode,
          schedulestate: state.schedulestate,
          dailyactstate: state.dailyactstate,
          qastate: state.qastate,
          activityHeading: state.activityHeading,
          zeroActivity: state.zeroActivity
        };
      case "changeScheduleState":
        return {
          fthState: state.fthState,
          stdState: false,
          darkMode: state.darkMode,
          schedulestate: true,
          dailyactstate: false,
          qastate: false,
          activityHeading: false,
          zeroActivity: state.zeroActivity
        };
      case "changeDailyActState":
        return {
          fthState: state.fthState,
          stdState: false,
          darkMode: state.darkMode,
          schedulestate: false,
          dailyactstate: true,
          qastate: false,
          activityHeading: false,
          zeroActivity: state.zeroActivity
        };
      case "changeQuickSessState":
        return {
          fthState: state.fthState,
          stdState: false,
          darkMode: state.darkMode,
          schedulestate: false,
          dailyactstate: false,
          qastate: !state.qastate,
          activityHeading:false,
          zeroActivity: state.zeroActivity
        };
      case "changeActivityHeading":
        return {
          fthState: state.fthState,
          stdState: false,
          darkMode: state.darkMode,
          schedulestate: false,
          dailyactstate: true,
          qastate: false,
          activityHeading: true,
          zeroActivity: state.zeroActivity
        };
      case "changeZeroActivity":
        return{
          fthState: state.fthState,
          stdState: false,
          darkMode: state.darkMode,
          schedulestate: false,
          dailyactstate: true,
          qastate: false,
          activityHeading: true,
          zeroActivity: action.payload? true : false
        };
      default:
        return state;
    };
  };

  const [state, takeAction] = useReducer(changeStateInfo, {fthState:true, stdState:false, darkMode: dayStatus(), schedulestate: false, dailyactstate:false, qastate:false, activityHeading:false, zeroActivity:true});
  return (
    <Router>
    <featuresTabHook.Provider value={{state, takeAction}}>
     <Header></Header>
     <Features></Features>
     <Backgroundmode></Backgroundmode>
     <Approuter></Approuter>
    </featuresTabHook.Provider>
    </Router>
  );
};
