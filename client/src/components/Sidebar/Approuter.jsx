import { Routes, Route, Navigate } from "react-router-dom";
import Currentschedule from './F1/Currentschedule';
import DailyActivitiesSetup from "./F2/DailyActivitiesSetup";
import Quicksession from './F3/Quicksession';
import Trendsandprogress from "./F4/Trendsandprogress";
import Missedactivitysetup from "./F5/Missedactivitysetup";
import Planahead from "./F6/Planahead";
import Setyourday from './F7/Setyourday';
import { Target } from "../Target";
import Login from "../Login";
import featuresTabHook from "../Noncomponents";
import { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Approuter() {
  const {state, takeAction} = useContext(featuresTabHook);
  const location = useLocation().pathname;
  const mail = sessionStorage.getItem('email');
  const flag = mail!=null? true : false;
  useEffect(()=>{
    if(state.disclaimerButtons){
      takeAction({type:'changeDisclaimerButtons'});
    };
    if(state.disclaimerState){
      takeAction({type:'changeDisclaimerState', payload:'false'});;
    };
    if(state.editUpcActivity){
      takeAction({type:'changeEditUpcActivityState'})
    };
    if(state.editActivity){
      takeAction({type:'changeEditActivityState'})
    };
    if(state.editMissedActivity){
      takeAction({type:'changeEditMissedActivityState'})
    };
    if(state.resolve){
      state.resolve(false);
      takeAction({type:'clearResolve'});
    };
  }, [location]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {flag && <Route path="/current-schedule" element={<Currentschedule />} />}
      {flag && <Route path="/daily-activities" element={<DailyActivitiesSetup />} />}
      {flag && <Route path="/quick-session" element={<Quicksession />} />}
      {flag && <Route path="/trends-and-progress" element={<Trendsandprogress />} />}
      {flag && <Route path="/missed-activities" element={<Missedactivitysetup />} />}
      {flag && <Route path="/plan-ahead" element={<Planahead />} />}
      {flag && <Route path="/set-your-day" element={<Setyourday />} />}
      {flag && <Route path="/target" element={<Target />} />}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}