import {useReducer} from 'react';
import Header from './Header/Header';
import Features from './Sidebar/Features';
import featuresTabHook,{dayStatus} from './Noncomponents';
import { BrowserRouter as Router} from 'react-router-dom';
import Approuter from './Sidebar/Approuter';
import Disclaimersetup from './Disclaimersetup';
import { futureDate } from './Noncomponents';
import Failedaction from './Failedaction';

export default function App() {
  function changeStateInfo(state, action){
    switch (action.type) {
      case "changeFthState":
        return {
          ...state,
          fthState: !state.fthState,
          activeTab: 0,
          updateActivity: false,
          updateMissedActivity: false,
          updateUpcomActivity:false,
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
          addUpcActState: false,
          qastate: false,
          updateActivity:false,
          updateMissedActivity: false,
          updateUpcomActivity:false,
          disclaimerButtons:false,
        };
      case "changeBgState":
        return {
          ...state,
          darkMode: !state.darkMode,
          updateActivity: false,
          updateMissedActivity: false,
          updateUpcomActivity:false,
          editActivity: false,
          editMissedActivity:false,
          editUpcActivity:false,
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
          addUpcActState: false,
          qastate: false,
          updateActivity:false,
          updateMissedActivity: false,
          updateUpcomActivity:false,
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
          addUpcActState: false,
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
          addUpcActState: false,
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
          addUpcActState: false,
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
          addUpcActState: false,
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
          updateMissedActivity: false,
          updateUpcomActivity:false,
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
          addUpcActState: false,
          qastate: false,
          disclaimerButtons:false,
          filterButton : false
        }
      case "changeAddUpcActState":
        return {
          ...state,
          stdState: false,
          schedulestate: false,
          addCurrentDayActivity: false,
          csActivityIndex: 0,
          activityTabButtRef: null,
          activeTab: 0,
          addDailyActState: false,
          addUpcActState: action.payload,
          qastate: false,
          disclaimerButtons:false,
          filterButton : false
        }
      case "changeActDate":
        return{
          ...state,
          stdState: false,
          schedulestate: false,
          addCurrentDayActivity: false,
          csActivityIndex: 0,
          activityTabButtRef: null,
          activeTab: 0,
          addDailyActState: false,
          addUpcActState: false,
          actDate: action.payload,
          qastate: false,
          disclaimerButtons:false,
          filterButton : false
        }
      case "changeActDateTabRef":
        return {
          ...state,
          stdState: false,
          schedulestate: false,
          addCurrentDayActivity: false,
          csActivityIndex: 0,
          activityTabButtRef: null,
          activeTab: 0,
          addDailyActState: false,
          actDateTabRef: action.payload,
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
          addUpcActState: false,
          qastate: !state.qastate,
          updateActivity:false,
          updateMissedActivity: false,
          updateUpcomActivity:false,
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
          addUpcActState: false,
          qastate: false,
          combinedActivityData: action.payload,
          disclaimerButtons:false,
          filterButton : false
        };
      case "changeMissedActivityData":
        return{
          ...state,
          stdState: false,
          schedulestate: false,
          csActivityIndex: 0,
          activityTabButtRef: null,
          activeTab: 0,
          missedActivities: action.payload,
          dailyactstate: false,
          addDailyActState: false,
          addUpcActState: false,
          qastate: false,
          disclaimerButtons:false,
          filterButton : false
        };
      case "changeUpcomActivityData":
        return{
          ...state,
          stdState: false,
          schedulestate: false,
          csActivityIndex: 0,
          activityTabButtRef: null,
          activeTab: 0,
          upcomActivityData: action.payload,
          dailyactstate: false,
          addDailyActState: false,
          qastate: false,
          disclaimerButtons:false,
          filterButton : false
        };
      case "changeMissedActivityState":
        return{
          ...state,
          stdState: false,
          schedulestate: false,
          csActivityIndex: 0,
          activityTabButtRef: null,
          activeTab: 0,
          updateMissedActivity: action.payload,
          dailyactstate: false,
          addDailyActState: false,
          addUpcActState: false,
          qastate: false,
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
          updateMissedActivity: false,
          updateUpcomActivity:false,
          editActivity: false,
          editMissedActivity:false,
          editUpcActivity: false,
          filterButton : false
        };
      case "changeUpcActivityState":
        return{
          ...state,
          stdState: false,
          schedulestate: false,
          csActivityIndex: 0,
          activityTabButtRef: null,
          activeTab: 0,
          dailyactstate: false,
          qastate: false,
          updateActivity: false,
          updateMissedActivity: false,
          updateUpcomActivity:action.payload,
          editActivity: false,
          editMissedActivity:false,
          filterButton : false
        }
      case "changeEditUpcActivityState":
        return{
          ...state,
          stdState: false,
          schedulestate: false,
          csActivityIndex: 0,
          activityTabButtRef: null,
          activeTab: 0,
          dailyactstate: false,
          qastate: false,
          updateActivity: false,
          updateMissedActivity: false,
          editActivity: false,
          editMissedActivity:false,
          editUpcActivity: !state.editUpcActivity,
          filterButton : false
        }
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
          editMissedActivity:false,
          editUpcActivity: false,
          disclaimerButtons:false,
          filterButton : false
        };
      case "changeEditMissedActivityState":
        return{
          ...state,
          stdState: false,
          schedulestate: false,
          addCurrentDayActivity: false,
          csActivityIndex: 0,
          activityTabButtRef: null,
          activeTab: 0,
          dailyactstate: false,
          qastate: false,
          editActivity: false,
          editMissedActivity: !state.editMissedActivity,
          editUpcActivity: false,
          disclaimerButtons:false,
          filterButton : false
        }
      case "changeDisclaimerState":
        return{
          ...state,
          stdState: false,
          schedulestate: false,
          addCurrentDayActivity: false,
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
          qastate: false,
          disclaimerButtons: !state.disclaimerButtons,
          filterButton : false
        }
      case "changeCurrentAction":
        return {
          ...state,
          stdState: false,
          schedulestate: false,
          addCurrentDayActivity: false,
          qastate: false,
          filterButton : false,
          currentAction : action.payload,
        }
      case "changeFailedAction":
        return {
          ...state,
          failedActionMessage: action.payload!=null? action.payload : state.failedActionMessage,
          failedAction:!state.failedAction,
        }
      case "setResolve":
        return {
          ...state,
          stdState: false,
          schedulestate: false,
          addCurrentDayActivity: false,
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
    addUpcActState: false,
    actDate: futureDate(),
    actDateTabRef: null,
    qastate:false, 
    activityData:[],
    combinedActivityData:[],
    missedActivities:[],
    upcomActivityData:[],
    updateActivity:false,
    updateMissedActivity:false,
    updateUpcomActivity:false,
    editUpcActivity:false,
    editActivity:false,
    editMissedActivity:false,
    currentAction:null,
    failedActionMessage:null,
    failedAction:false,
    disclaimerState:false,
    disclaimerButtons:false, 
    resolve: null,
    filterButton : false,
  });
  
  return (
    <Router>
    <featuresTabHook.Provider value={{state, takeAction}}>
     <Header></Header>
     <Features></Features>
     <Disclaimersetup></Disclaimersetup>
     <Failedaction></Failedaction>
     <Approuter></Approuter>
    </featuresTabHook.Provider>
    </Router>
  );
};
