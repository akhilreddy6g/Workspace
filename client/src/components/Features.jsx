import React, {useContext} from "react";
import Feature from "./Feature";
import { featuresTabHook } from "./App";
import { Navigate } from "./Navigate";

export default function Features(){
    let {state} = useContext(featuresTabHook);
    return (<div className="featureContainer" style={{left: state.fthState? "0px": "-200px"}}>
        <div className="background">
    <Navigate id="0" elementName="activityManager" title="Navigate" src="src/assets/transfer.png"></Navigate>
    <Feature id="1" featureName="currentSchedule" title="Current Schedule"></Feature>
    <Feature id="2" featureName="dailyActivities" title="Daily Activities"></Feature>
    <Feature id="3" featureName="quickActivitySession" title="Quick Session"></Feature>
    <Feature id="4" featureName="streakNProgress" title="Streak and Progress"></Feature>
    <Feature id="5" featureName="missedActivities" title="Missed Activities"></Feature>
    <Feature id="6" featureName="planAhead" title="Plan Ahead"></Feature>
    <Feature id="7" featureName="setYourDay" title="Set Your Day" show="sd"></Feature></div>
    </div>);
}