import {useContext} from "react";
import Feature from "./Feature";
import featuresTabHook from "../Noncomponents";
import Userprofile from "./Userprofile";

export default function Features(){
    let {state} = useContext(featuresTabHook);
    return (<div className="featureContainer" style={{left: state.fthState? "0px": "-200px"}}>
        <div className="background">
    <Userprofile id="0" title="userPicture" src="src/assets/user.svg"></Userprofile>
    <Feature id="1" featureName="currentSchedule" title="Current Schedule" show="cs"></Feature>
    <Feature id="2" featureName="dailyActivities" title="Daily Activities" show="da"></Feature>
    <Feature id="3" featureName="quickActivitySession" title="Quick Session" show="qa"></Feature>
    <Feature id="4" featureName="streakNProgress" title="Streak and Progress" show="snp"></Feature>
    <Feature id="5" featureName="missedActivities" title="Missed Activities" show="ma"></Feature>
    <Feature id="6" featureName="planAhead" title="Plan Ahead" show="pa"></Feature>
    <Feature id="7" featureName="setYourDay" title="Set Your Day" show="syd"></Feature></div>
    </div>);
}