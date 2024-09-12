import {useContext} from "react";
import Feature from "./Feature";
import featuresTabHook from "../Noncomponents";
import Userprofile from "./Userprofile";

export default function Features(){
    let {state} = useContext(featuresTabHook);
    return (<div className={`featureContainer ${state.fthState? "featureContainer1" : "featureContainer2"}`}>
        <div className={`background ${state.darkMode && "backgdarkMode"}`}>
    <Userprofile id="0" title="userPicture" src="src/assets/user.svg"></Userprofile>
    <Feature id="1" featureName="currentSchedule" title="Current Schedule" show="cs" path="/current-schedule"></Feature>
    <Feature id="2" featureName="dailyActivities" title="Daily Activities" show="da" path="/daily-activities"></Feature>
    <Feature id="3" featureName="quickActivitySession" title="Quick Session" show="qa" path="/quick-session"></Feature>
    <Feature id="4" featureName="streakNProgress" title="Streak and Progress" show="snp" path="/streak-and-progress"></Feature>
    <Feature id="5" featureName="missedActivities" title="Missed Activities" show="ma" path="/missed-activities"></Feature>
    <Feature id="6" featureName="planAhead" title="Plan Ahead" show="pa" path="/plan-ahead"></Feature>
    <Feature id="7" featureName="setYourDay" title="Set Your Day" show="syd" path="/set-your-day"></Feature></div>
    </div>);
}