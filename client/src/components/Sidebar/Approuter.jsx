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
import { useContext } from "react";

export default function Approuter() {
  const {state, takeAction} = useContext(featuresTabHook);
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {state.initialComponentState && <Route path="/current-schedule" element={<Currentschedule />} />}
      {state.initialComponentState && <Route path="/daily-activities" element={<DailyActivitiesSetup />} />}
      {state.initialComponentState && <Route path="/quick-session" element={<Quicksession />} />}
      {state.initialComponentState && <Route path="/trends-and-progress" element={<Trendsandprogress />} />}
      {state.initialComponentState && <Route path="/missed-activities" element={<Missedactivitysetup />} />}
      {state.initialComponentState && <Route path="/plan-ahead" element={<Planahead />} />}
      {state.initialComponentState && <Route path="/set-your-day" element={<Setyourday />} />}
      {state.initialComponentState && <Route path="/target" element={<Target />} />}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}