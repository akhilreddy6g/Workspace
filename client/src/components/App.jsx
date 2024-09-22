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
          fthState: !state.fthState,
          stdState: state.stdState,
          darkMode: state.darkMode,
          schedulestate: state.schedulestate,
          addCurrentDayActivity: state.addCurrentDayActivity,
          csActivityIndex: state.csActivityIndex,
          activityTabButtRef: state.activityTabButtRef,
          activeTab: 0,
          dailyactstate: state.dailyactstate,
          addDailyActState: state.addDailyActState,
          qastate: state.qastate,
          activityData: state.activityData,
          combinedActivityData: state.combinedActivityData,
          updateActivity: false,
          editActivity: state.editActivity,
          disclaimerState: state.disclaimerState,
          disclaimerButtons:false,
          resolve: state.resolve,
          filterButton : state.filterButton 
        };
      case "changeStdState":
        return {
          fthState: state.fthState,
          stdState: !state.stdState,
          darkMode: state.darkMode,
          schedulestate: false,
          addCurrentDayActivity: false,
          csActivityIndex: 0,
          activityTabButtRef: null,
          activeTab: 0,
          dailyactstate: false,
          addDailyActState: false,
          qastate: false,
          activityData: state.activityData,
          combinedActivityData: state.combinedActivityData,
          updateActivity:false,
          editActivity: state.editActivity,
          disclaimerState: state.disclaimerState,
          disclaimerButtons:false,
          resolve: state.resolve,
          filterButton : state.filterButton 
        };
      case "changeBgState":
        return {
          fthState: state.fthState,
          stdState: state.stdState,
          darkMode: !state.darkMode,
          schedulestate: state.schedulestate,
          addCurrentDayActivity: state.addCurrentDayActivity,
          csActivityIndex: state.csActivityIndex,
          activityTabButtRef: state.activityTabButtRef,
          activeTab: state.activeTab,
          dailyactstate: state.dailyactstate,
          addDailyActState: state.addDailyActState,
          qastate: state.qastate,
          activityData: state.activityData,
          combinedActivityData:state.combinedActivityData,
          updateActivity: false,
          editActivity: false,
          disclaimerState: state.disclaimerState,
          disclaimerButtons:false,
          resolve: state.resolve,
          filterButton : state.filterButton 
        };
      case "changeScheduleState":
        return {
          fthState: state.fthState,
          stdState: false,
          darkMode: state.darkMode,
          schedulestate: true,
          addCurrentDayActivity: state.addCurrentDayActivity,
          csActivityIndex: 0,
          activityTabButtRef: null,
          activeTab: 0,
          dailyactstate: false,
          addDailyActState: false,
          qastate: false,
          activityData: state.activityData,
          combinedActivityData:state.combinedActivityData,
          updateActivity:false,
          editActivity: state.editActivity,
          disclaimerState: state.disclaimerState,
          disclaimerButtons:false,
          resolve: state.resolve,
          filterButton : state.filterButton 
        };
      case "changeCurrentDayState":
        return {
          fthState: state.fthState,
          stdState: false,
          darkMode: state.darkMode,
          schedulestate: true,
          addCurrentDayActivity: action.payload,
          csActivityIndex: state.csActivityIndex,
          activityTabButtRef: state.activityTabButtRef,
          activeTab: state.activeTab,
          dailyactstate: false,
          addDailyActState: false,
          qastate: false,
          activityData: state.activityData,
          combinedActivityData:state.combinedActivityData,
          updateActivity:state.updateActivity,
          editActivity: state.editActivity,
          disclaimerState: state.disclaimerState,
          disclaimerButtons:false,
          resolve: state.resolve,
          filterButton : state.filterButton 
        }
      case "changeCsActivityIndex":
        return {
          fthState: state.fthState,
          stdState: false,
          darkMode: state.darkMode,
          schedulestate: state.schedulestate,
          addCurrentDayActivity: state.addCurrentDayActivity,
          csActivityIndex: state.csActivityIndex+action.payload,
          activityTabButtRef: action.button,
          dailyactstate: false,
          addDailyActState: false,
          activeTab: state.activeTab,
          qastate: false,
          activityData: state.activityData,
          combinedActivityData:state.combinedActivityData,
          updateActivity:state.updateActivity,
          editActivity: state.editActivity,
          disclaimerState: state.disclaimerState,
          disclaimerButtons:false,
          resolve: state.resolve,
          filterButton : state.filterButton 
        }
      case "changeActTabButtRef":
        return {
          fthState: state.fthState,
          stdState: false,
          darkMode: state.darkMode,
          schedulestate: state.schedulestate,
          addCurrentDayActivity: state.addCurrentDayActivity,
          csActivityIndex: action.payload,
          activityTabButtRef: action.button,
          activeTab: state.activeTab,
          dailyactstate: false,
          addDailyActState: false,
          qastate: false,
          activityData: state.activityData,
          combinedActivityData:state.combinedActivityData,
          updateActivity:state.updateActivity,
          editActivity: state.editActivity,
          disclaimerState: state.disclaimerState,
          disclaimerButtons:false,
          resolve: state.resolve,
          filterButton : state.filterButton 
        }
      case "changeActiveTab":
        return {
          fthState: state.fthState,
          stdState: false,
          darkMode: state.darkMode,
          schedulestate: state.schedulestate,
          addCurrentDayActivity: state.addCurrentDayActivity,
          csActivityIndex: state.csActivityIndex,
          activityTabButtRef: state.activityTabButtRef,
          activeTab: action.payload,
          dailyactstate: false,
          addDailyActState: false,
          qastate: false,
          activityData: state.activityData,
          combinedActivityData:state.combinedActivityData,
          updateActivity:state.updateActivity,
          editActivity: state.editActivity,
          disclaimerState: state.disclaimerState,
          disclaimerButtons:false,
          resolve: state.resolve,
          filterButton : state.filterButton 
        }

      case "changeDailyActState":
        return {
          fthState: state.fthState,
          stdState: false,
          darkMode: state.darkMode,
          schedulestate: false,
          addCurrentDayActivity: false,
          csActivityIndex: 0,
          activityTabButtRef: null,
          activeTab: 0,
          dailyactstate: true,
          addDailyActState: state.addDailyActState,
          qastate: false,
          activityData: state.activityData,
          combinedActivityData: state.combinedActivityData,
          updateActivity:false,
          editActivity: state.editActivity,
          disclaimerState: state.disclaimerState,
          disclaimerButtons:false,
          resolve: state.resolve,
          filterButton : false
        };
      case "changeAddDailyActState":
        return {
          fthState: state.fthState,
          stdState: false,
          darkMode: state.darkMode,
          schedulestate: false,
          addCurrentDayActivity: false,
          csActivityIndex: 0,
          activityTabButtRef: null,
          activeTab: 0,
          dailyactstate: state.dailyactstate,
          addDailyActState: action.payload,
          qastate: false,
          activityData: state.activityData,
          combinedActivityData: state.combinedActivityData,
          updateActivity: state.updateActivity,
          editActivity: state.editActivity,
          disclaimerState: state.disclaimerState,
          disclaimerButtons:false,
          resolve: state.resolve,
          filterButton : false
        }
      case "changeQuickSessState":
        return {
          fthState: state.fthState,
          stdState: false,
          darkMode: state.darkMode,
          schedulestate: false,
          addCurrentDayActivity: false,
          csActivityIndex: 0,
          activityTabButtRef: null,
          activeTab: 0,
          dailyactstate: false,
          addDailyActState: false,
          qastate: !state.qastate,
          activityData: state.activityData,
          combinedActivityData: state.combinedActivityData,
          updateActivity:false,
          editActivity: state.editActivity,
          disclaimerState: state.disclaimerState,
          disclaimerButtons:false,
          resolve: state.resolve,
          filterButton : false
        };
      case "changeActivityData":
        return{
          fthState: state.fthState,
          stdState: false,
          darkMode: state.darkMode,
          schedulestate: false,
          addCurrentDayActivity: state.addCurrentDayActivity,
          csActivityIndex: 0,
          activityTabButtRef: null,
          activeTab: 0,
          dailyactstate: true,
          addDailyActState: state.addDailyActState,
          qastate: false,
          activityData: action.payload,
          combinedActivityData: state.combinedActivityData,
          updateActivity: state.updateActivity,
          editActivity: state.editActivity,
          disclaimerState: state.disclaimerState,
          disclaimerButtons:false,
          resolve: state.resolve,
          filterButton : false
        };
      case "changeCombinedActivityData":
        return{
          fthState: state.fthState,
          stdState: false,
          darkMode: state.darkMode,
          schedulestate: false,
          addCurrentDayActivity: state.addCurrentDayActivity,
          csActivityIndex: 0,
          activityTabButtRef: null,
          activeTab: 0,
          dailyactstate: false,
          addDailyActState: false,
          qastate: false,
          activityData: state.activityData,
          combinedActivityData: action.payload,
          updateActivity: state.updateActivity,
          editActivity: state.editActivity,
          disclaimerState: state.disclaimerState,
          disclaimerButtons:false,
          resolve: state.resolve,
          filterButton : false
        };
      case "changeActivityState":
        return{
          fthState: state.fthState,
          stdState: false,
          darkMode: state.darkMode,
          schedulestate: false,
          addCurrentDayActivity: state.addCurrentDayActivity,
          csActivityIndex: 0,
          activityTabButtRef: null,
          activeTab: 0,
          dailyactstate: true,
          addDailyActState: state.addDailyActState,
          qastate: false,
          activityData: state.activityData,
          combinedActivityData: state.combinedActivityData,
          updateActivity: action.payload,
          editActivity: false,
          disclaimerState: state.disclaimerState,
          disclaimerButtons: state.disclaimerButtons,
          resolve: state.resolve,
          filterButton : false
        };
      case "changeEditActivityState":
        return{
          fthState: state.fthState,
          stdState: false,
          darkMode: state.darkMode,
          schedulestate: false,
          addCurrentDayActivity: false,
          csActivityIndex: 0,
          activityTabButtRef: null,
          activeTab: 0,
          dailyactstate: true,
          addDailyActState: state.addDailyActState,
          qastate: false,
          activityData: state.activityData,
          combinedActivityData: state.combinedActivityData,
          updateActivity: state.updateActivity,
          editActivity: !state.editActivity,
          disclaimerState: state.disclaimerState,
          disclaimerButtons:false,
          resolve: state.resolve,
          filterButton : false
        };
      case "changeDisclaimerState":
        return{
          fthState: state.fthState,
          stdState: false,
          darkMode: state.darkMode,
          schedulestate: false,
          addCurrentDayActivity: false,
          csActivityIndex: 0,
          activityTabButtRef: null,
          activeTab: 0,
          dailyactstate: true,
          addDailyActState: state.addDailyActState,
          qastate: false,
          activityData: state.activityData,
          combinedActivityData: state.combinedActivityData,
          updateActivity: state.updateActivity,
          editActivity: state.editActivity,
          disclaimerState: action.payload,
          disclaimerButtons: state.disclaimerButtons,
          resolve: state.resolve,
          filterButton : false
        }
      case "changeDisclaimerButtons":
        return {
          fthState: state.fthState,
          stdState: false,
          darkMode: state.darkMode,
          schedulestate: false,
          addCurrentDayActivity: false,
          csActivityIndex: 0,
          activityTabButtRef: null,
          activeTab: 0,
          dailyactstate: true,
          addDailyActState: state.addDailyActState,
          qastate: false,
          activityData: state.activityData,
          combinedActivityData: state.combinedActivityData,
          updateActivity: state.updateActivity,
          editActivity: state.editActivity,
          disclaimerState: state.disclaimerState,
          disclaimerButtons: !state.disclaimerButtons,
          resolve: state.resolve,
          filterButton : false
        }
      case "setResolve":
        return {
          fthState: state.fthState,
          stdState: false,
          darkMode: state.darkMode,
          schedulestate: false,
          addCurrentDayActivity: false,
          csActivityIndex: 0,
          activityTabButtRef: null,
          activeTab: 0,
          dailyactstate: true,
          addDailyActState: state.addDailyActState,
          qastate: false,
          activityData: state.activityData,
          combinedActivityData: state.combinedActivityData,
          updateActivity: state.updateActivity,
          editActivity: state.editActivity,
          disclaimerState: state.disclaimerState,
          disclaimerButtons: state.disclaimerButtons,
          resolve: action.payload,
          filterButton : false
        }
      case "changeFilterButton":
        return {
          fthState: state.fthState,
          stdState: false,
          darkMode: state.darkMode,
          schedulestate: false,
          addCurrentDayActivity: false,
          csActivityIndex: 0,
          activityTabButtRef: null,
          activeTab: 0,
          dailyactstate: true,
          addDailyActState: state.addDailyActState,
          qastate: false,
          activityData: state.activityData,
          combinedActivityData: state.combinedActivityData,
          updateActivity: state.updateActivity,
          editActivity: state.editActivity,
          disclaimerState: state.disclaimerState,
          disclaimerButtons: state.disclaimerButtons,
          resolve: state.resolve,
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
