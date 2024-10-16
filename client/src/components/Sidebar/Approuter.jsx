import {Routes, Route} from "react-router-dom";
import Currentschedule from './F1/Currentschedule';
import DailyActivitiesSetup from "./F2/DailyActivitiesSetup";
import Quicksession from './F3/Quicksession';
import Setyourday from './F7/Setyourday';
import Missedactivitysetup from "./F5/Missedactivitysetup";
import Planahead from "./F6/Planahead";
import { Target } from "../Target";

export default function Approuter(){
    return (<Routes>
        <Route path="/current-schedule" element={<Currentschedule/>}/>
        <Route path="/daily-activities" element={<DailyActivitiesSetup/>}/>
        <Route path="/quick-session" element={<Quicksession/>}/>
        <Route path="/streak-and-progress"/>
        <Route path="/missed-activities" element={<Missedactivitysetup/>}/>
        <Route path="/plan-ahead" element={<Planahead/>}/>
        <Route path="/set-your-day" element={<Setyourday/>}/>
        <Route path="/target" element={<Target/>}/>
    </Routes>);
};