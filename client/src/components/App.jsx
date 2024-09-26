import {useReducer} from 'react';
import Header from './Header/Header';
import Features from './Sidebar/Features';
import featuresTabHook,{dayStatus} from './Noncomponents';
import { BrowserRouter as Router} from 'react-router-dom';
import Approuter from './Sidebar/Approuter';
import Deletedisclaimer from './Sidebar/F2/Deletedisclaimer';

export default function App() {
  function changeStateInfo(state, action){
    switch (action.type) {
      case "changeFthState":
        return {
          ...state,
          fthState: !state.fthState,
          activeTab: 0,
          updateActivity: false,
          disclaimerButtons:false,
        };
      case "changeStdState":
        return {
          ...state,
          stdState: !state.stdState,
          schedulestate: false,
          addCurrentDayActivity: false,
          csActivityIndex: 0,
          activityTabButtRef: null,
          activeTab: 0,
          dailyactstate: false,
          addDailyActState: false,
          qastate: false,
          updateActivity:false,
          disclaimerButtons:false,
        };
      case "changeBgState":
        return {
          ...state,
          darkMode: !state.darkMode,
          updateActivity: false,
          editActivity: false,
          disclaimerButtons:false,
        };
      case "changeScheduleState":
        return {
          ...state,
          stdState: false,
          schedulestate: true,
          csActivityIndex: 0,
          activityTabButtRef: null,
          activeTab: 0,
          dailyactstate: false,
          addDailyActState: false,
          qastate: false,
          updateActivity:false,
          disclaimerButtons:false,
        };
      case "changeCurrentDayState":
        return {
          ...state,
          stdState: false,
          schedulestate: true,
          addCurrentDayActivity: action.payload,
          dailyactstate: false,
          addDailyActState: false,
          qastate: false,
          disclaimerButtons:false,
        }
      case "changeCsActivityIndex":
        return {
          ...state,
          stdState: false,
          csActivityIndex: state.csActivityIndex+action.payload,
          activityTabButtRef: action.button,
          dailyactstate: false,
          addDailyActState: false,
          qastate: false,
          disclaimerButtons:false,
        }
      case "changeActTabButtRef":
        return {
          ...state,
          stdState: false,
          csActivityIndex: action.payload,
          activityTabButtRef: action.button!=null? action.button : state.activityTabButtRef,
          dailyactstate: false,
          addDailyActState: false,
          qastate: false,
          disclaimerButtons:false,
        }
      case "changeActiveTab":
        return {
          ...state,
          stdState: false,
          activeTab: action.payload,
          dailyactstate: false,
          addDailyActState: false,
          qastate: false,
          disclaimerButtons:false,
        }

      case "changeDailyActState":
        return {
          ...state,
          stdState: false,
          schedulestate: false,
          addCurrentDayActivity: false,
          csActivityIndex: 0,
          activityTabButtRef: null,
          activeTab: 0,
          dailyactstate: true,
          qastate: false,
          updateActivity:false,
          disclaimerButtons:false,
          filterButton : false
        };
      case "changeAddDailyActState":
        return {
          ...state,
          stdState: false,
          schedulestate: false,
          addCurrentDayActivity: false,
          csActivityIndex: 0,
          activityTabButtRef: null,
          activeTab: 0,
          addDailyActState: action.payload,
          qastate: false,
          disclaimerButtons:false,
          filterButton : false
        }
      case "changeQuickSessState":
        return {
          ...state,
          stdState: false,
          schedulestate: false,
          addCurrentDayActivity: false,
          csActivityIndex: 0,
          activityTabButtRef: null,
          activeTab: 0,
          dailyactstate: false,
          addDailyActState: false,
          qastate: !state.qastate,
          updateActivity:false,
          disclaimerButtons:false,
          filterButton : false
        };
      case "changeActivityData":
        return{
          ...state,
          stdState: false,
          schedulestate: false,
          csActivityIndex: 0,
          activityTabButtRef: null,
          activeTab: 0,
          dailyactstate: true,
          qastate: false,
          activityData: action.payload,
          disclaimerButtons:false,
          filterButton : false
        };
      case "changeCombinedActivityData":
        return{
          ...state,
          stdState: false,
          schedulestate: false,
          csActivityIndex: 0,
          activityTabButtRef: null,
          activeTab: 0,
          dailyactstate: false,
          addDailyActState: false,
          qastate: false,
          combinedActivityData: action.payload,
          disclaimerButtons:false,
          filterButton : false
        };
      case "changeActivityState":
        return{
          ...state,
          stdState: false,
          schedulestate: false,
          csActivityIndex: 0,
          activityTabButtRef: null,
          activeTab: 0,
          dailyactstate: true,
          qastate: false,
          updateActivity: action.payload,
          editActivity: false,
          filterButton : false
        };
      case "changeEditActivityState":
        return{
          ...state,
          stdState: false,
          schedulestate: false,
          addCurrentDayActivity: false,
          csActivityIndex: 0,
          activityTabButtRef: null,
          activeTab: 0,
          dailyactstate: true,
          qastate: false,
          editActivity: !state.editActivity,
          disclaimerButtons:false,
          filterButton : false
        };
      case "changeDisclaimerState":
        return{
          ...state,
          stdState: false,
          schedulestate: false,
          addCurrentDayActivity: false,
          csActivityIndex: 0,
          activityTabButtRef: null,
          activeTab: 0,
          dailyactstate: true,
          qastate: false,
          disclaimerState: action.payload,
          filterButton : false
        }
      case "changeDisclaimerButtons":
        return {
          ...state,
          stdState: false,
          schedulestate: false,
          addCurrentDayActivity: false,
          csActivityIndex: 0,
          activityTabButtRef: null,
          activeTab: 0,
          dailyactstate: true,
          qastate: false,
          disclaimerButtons: !state.disclaimerButtons,
          filterButton : false
        }
      case "setResolve":
        return {
          ...state,
          stdState: false,
          schedulestate: false,
          addCurrentDayActivity: false,
          csActivityIndex: 0,
          activityTabButtRef: null,
          activeTab: 0,
          dailyactstate: true,
          qastate: false,
          resolve: action.payload,
          filterButton : false
        }
      case "changeFilterButton":
        return {
          ...state,
          stdState: false,
          schedulestate: false,
          addCurrentDayActivity: false,
          csActivityIndex: 0,
          activityTabButtRef: null,
          activeTab: 0,
          dailyactstate: true,
          qastate: false,
          filterButton : action.payload
        }
      default:
        return state;
    };
  };

  const [state, takeAction] = useReducer(changeStateInfo, {
    fthState:true, 
    stdState:false, 
    darkMode: dayStatus(), 
    schedulestate: false, 
    addCurrentDayActivity: false,
    csActivityIndex: 0,
    activityTabButtRef: null,
    activeTab: 0,
    dailyactstate:false, 
    addDailyActState: false,
    qastate:false, 
    activityData:[],
    combinedActivityData:[],
    updateActivity:false,
    editActivity:false,
    disclaimerState:false,
    disclaimerButtons:false, 
    resolve: null,
    filterButton : false
  });
  
  return (
    <Router>
    <featuresTabHook.Provider value={{state, takeAction}}>
     <Header></Header>
     <Features></Features>
     <Deletedisclaimer></Deletedisclaimer>
     <Approuter></Approuter>
    </featuresTabHook.Provider>
    </Router>
  );
};
