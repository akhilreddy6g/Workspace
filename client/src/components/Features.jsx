import React from "react";
import Feature from "./Feature";

export default function Features(){
    return <div className="featureContainer">
    <Feature id="1" featureName="currentSchedule" title="Current Schedule"></Feature>
    <Feature id="2" featureName="dailyActivities" title="Daily Activities"></Feature>
    <Feature id="3" featureName="quickActivitySession" title="Quick Session"></Feature>
    <Feature id="4" featureName="streakNProgress" title="Streak and Progress"></Feature>
    <Feature id="5" featureName="missedActivities" title="Missed Activities"></Feature>
    <Feature id="6" featureName="planAhead" title="Plan Ahead"></Feature>
    <Feature id="7" featureName="setYourDay" title="Set Your Day"></Feature>
    </div>;
}