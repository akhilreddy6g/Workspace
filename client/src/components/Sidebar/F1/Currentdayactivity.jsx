import { useContext, useState } from "react";
import featuresTabHook from "../../Noncomponents";
import Currentactivitysetup from "./Currentactivitysetup";

export default function Currentdayactivity(){
    const {state, takeAction} = useContext(featuresTabHook);
    return (state.addCurrentDayActivity ? <div className={`addActivityBar ${state.fthState? "addActivityBar1" : "addActivityBar2"}`}>
        <Currentactivitysetup></Currentactivitysetup> </div> : <div className={`currentActivities ${state.fthState? "scheduleDisclaimer1" : "scheduleDisclaimer2"}`}>
        <button className="addCurrentActivityButton" onClick={()=>{takeAction({type:"changeCurrentDayState", payload:true})}}>Add Present Day Activities</button> </div>
    )
}


