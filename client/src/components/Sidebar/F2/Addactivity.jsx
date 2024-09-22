import { useContext } from "react";
import featuresTabHook from "../../Noncomponents";
import Activitysetup from "./Activitysetup";

export default function Addactivity(){
    const {state, takeAction} = useContext(featuresTabHook);
    return <>
    <div className={`scrollHide ${state.fthState? "scrollHideBottom1" : "scrollHideBottom2" } ${state.darkMode? "scrollHideBottomDark" : "scrollHideBottomNormal"}`}></div>
    <div className={`dailyActivity ${state.fthState? "dailyActivity1" : "dailyActivity2"}`}>
      <div className="activityBar abid"></div>
      <div className="activityBar aba">Activity</div>
      <div className="activityBar ab">Start</div>
      <div className="activityBar ab">End</div>
      <div className="activityBar ab">Priority</div>
      <div className="activityBar ab">Status </div>
      {state.activityData.length>0 && <div className="activityBar abf"><img className="asset1" src="src/assets/controls.svg" alt="controls" onMouseOver={() => {takeAction({type:"changeFilterButton", payload:true});}} onClick={() => {takeAction({type:"changeFilterButton", payload:!state.filterButton});}}/></div>}
    </div>
    <div className={`scrollHideBottom ${state.fthState? "scrollHideBottom1" : "scrollHideBottom2" } ${state.darkMode? "scrollHideBottomDark" : "scrollHideBottomNormal"}`}></div>
    <div className={`addActivityBar ${state.fthState? "addActivityBar1" : "addActivityBar2"}`}>
    {(state.addDailyActState ? <div className={`addActivityBar ${state.fthState? "addActivityBar1" : "addActivityBar2"}`}>
        <Activitysetup></Activitysetup> </div> : <div className={`currentActivities ${state.fthState? "scheduleDisclaimer1" : "scheduleDisclaimer2"}`}>
        <button className="addCurrentActivityButton" onClick={()=>{takeAction({type:"changeAddDailyActState", payload:true})}}>Add Daily Activities</button> </div>
    )}
    </div>
    </>
}