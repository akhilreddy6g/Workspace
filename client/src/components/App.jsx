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
          activityData: state.activityData,
          updateActivity: false,
          editActivity: state.editActivity,
        };
      case "changeStdState":
        return {
          fthState: state.fthState,
          stdState: !state.stdState,
          darkMode: state.darkMode,
          schedulestate: false,
          dailyactstate: false,
          qastate: false,
          activityData: state.activityData,
          updateActivity:false,
          editActivity: state.editActivity,
        };
      case "changeBgState":
        return {
          fthState: state.fthState,
          stdState: state.stdState,
          darkMode: !state.darkMode,
          schedulestate: state.schedulestate,
          dailyactstate: state.dailyactstate,
          qastate: state.qastate,
          activityData: state.activityData,
          updateActivity: false,
          editActivity: false,
        };
      case "changeScheduleState":
        return {
          fthState: state.fthState,
          stdState: false,
          darkMode: state.darkMode,
          schedulestate: true,
          dailyactstate: false,
          qastate: false,
          activityData: state.activityData,
          updateActivity:false,
          editActivity: state.editActivity,
        };
      case "changeDailyActState":
        return {
          fthState: state.fthState,
          stdState: false,
          darkMode: state.darkMode,
          schedulestate: false,
          dailyactstate: true,
          qastate: false,
          activityData: state.activityData,
          updateActivity:false,
          editActivity: state.editActivity,
        };
      case "changeQuickSessState":
        return {
          fthState: state.fthState,
          stdState: false,
          darkMode: state.darkMode,
          schedulestate: false,
          dailyactstate: false,
          qastate: !state.qastate,
          activityData: state.activityData,
          updateActivity:false,
          editActivity: state.editActivity,
        };
      case "changeActivityData":
        return{
          fthState: state.fthState,
          stdState: false,
          darkMode: state.darkMode,
          schedulestate: false,
          dailyactstate: true,
          qastate: false,
          activityData: action.payload,
          updateActivity: state.updateActivity,
          editActivity: state.editActivity,
        };
      case "changeActivityState":
        return{
          fthState: state.fthState,
          stdState: false,
          darkMode: state.darkMode,
          schedulestate: false,
          dailyactstate: true,
          qastate: false,
          activityData: state.activityData,
          updateActivity: !state.updateActivity,
          editActivity: false,
        };
      case "changeEditActivityState":
        return{
          fthState: state.fthState,
          stdState: false,
          darkMode: state.darkMode,
          schedulestate: false,
          dailyactstate: true,
          qastate: false,
          activityData: state.activityData,
          updateActivity: state.updateActivity,
          editActivity: !state.editActivity,
        };
      default:
        return state;
    };
  };

  const [state, takeAction] = useReducer(changeStateInfo, {
    fthState:true, 
    stdState:false, 
    darkMode: dayStatus(), 
    schedulestate: false, 
    dailyactstate:false, 
    qastate:false, 
    activityData:[], 
    updateActivity:false,
    editActivity:false,
  });
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
