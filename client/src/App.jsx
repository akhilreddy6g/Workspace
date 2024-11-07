import {useReducer, useLayoutEffect, useRef, useEffect} from 'react';
import Header from './components/Header/Header';
import Features from './components/Sidebar/Features';
import featuresTabHook,{dayStatus} from './components/Noncomponents';
import Approuter from './components/Sidebar/Approuter';
import Disclaimersetup from './components/Disclaimersetup';
import { futureDate } from './components/Noncomponents';
import Failedaction from './components/Failedaction';
import { apiUrl } from './components/Noncomponents';
import { useNavigate, useLocation } from 'react-router-dom';
import "./styles/style.css"

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const paths = ['/current-schedule', '/daily-activities', '/quick-session', '/trends-and-progress', '/missed-activities', '/plan-ahead', '/set-your-day', '/target']
  function changeStateInfo(state, action){
    switch (action.type) {
      case "changeFthState":
        return {
          ...state,
          fthState: !state.fthState,
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
          activityTabButtRef: null,
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
        };
      case "changeScheduleState":
        return {
          ...state,
          stdState: false,
          schedulestate: true,
          activityTabButtRef: null,
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
          activityTabButtRef: null,
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
          activityTabButtRef: null,
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
          activityTabButtRef: null,
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
          activityTabButtRef: null,
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
          activityTabButtRef: null,
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
          activityTabButtRef: null,
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
          activityTabButtRef: null,
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
          activityTabButtRef: null,
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
          activityTabButtRef: null,
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
          activityTabButtRef: null,
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
          activityTabButtRef: null,
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
          activityTabButtRef: null,
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
          activityTabButtRef: null,
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
          activityTabButtRef: null,
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
          activityTabButtRef: null,
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
          activityTabButtRef: null,
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
      case 'clearResolve':
        return {
          ...state, 
          resolve: null };
      case "changeFilterButton":
        return {
          ...state,
          stdState: false,
          schedulestate: false,
          addCurrentDayActivity: false,
          activityTabButtRef: null,
          qastate: false,
          filterButton : action.payload
        }
      case "changeTrend":
        return {
          ...state,
          trend: action.payload
        }
      case "changeInitialComponentsState":
        return {
          ...state,
          initialComponentState: action.payload,
        }
      case "changeEmailId":
        return {
          ...state,
          emailId : action.payload,
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
    csActivityIndex: null,
    activeTab: null,
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
    trend: 0, 
    initialComponentState: false,
    emailId: null,
  });

  useLayoutEffect(() => {
    const requestInterceptor = apiUrl.interceptors.request.use(function(config){
      const storedToken = sessionStorage.getItem('token');
      config.headers.Authorization = !config._retry && storedToken ? `Bearer ${storedToken}`: config.headers.Authorization;
      return config;
    }, function (error) {
      return Promise.reject(error);
    });
    return () => {
      apiUrl.interceptors.request.eject(requestInterceptor);
    };
  }, []);
  
  useLayoutEffect(() => {
    const responseInterceptor = apiUrl.interceptors.response.use(
      function (response){
        return response;
      },
      async function(error){
        const originalRequest = error.config;
        if (error.response!=null && ((error.response.status === 403 && error.response.data.message === 'Token expired or invalid') || (error.response.status === 401 && error.response.data.message === 'Access token missing')) && (originalRequest._retry === undefined)) {
          originalRequest._retry = true;
          try {
            const data = await apiUrl.post('/refresh-token');
            sessionStorage.setItem('token', data.data.token); 
            apiUrl.defaults.headers.common['Authorization'] = `Bearer ${data.data.token}`;
            originalRequest.headers['Authorization'] = `Bearer ${data.data.token}`;
            return apiUrl(originalRequest);
          } catch (refreshError) {
            navigate('/login');
            return Promise.reject(refreshError);
          }
        } else {
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );
    return () => {
      apiUrl.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  setInterval(()=>{
    const now = new Date();
        const currentTimeMinutes = now.getHours() * 60 + now.getMinutes(); 
        if(currentTimeMinutes==0 && now.getSeconds() == 1){
            sessionStorage.clear();
        };
  },1000);
  
  return (
    <featuresTabHook.Provider value={{state, takeAction}}>
     {paths.includes(location.pathname) && <Header></Header>}
     {paths.includes(location.pathname) && <Features></Features>}
     {paths.includes(location.pathname) && <Disclaimersetup></Disclaimersetup>}
     {paths.includes(location.pathname) && <Failedaction></Failedaction>}
     <Approuter></Approuter>
    </featuresTabHook.Provider>
  );
};
