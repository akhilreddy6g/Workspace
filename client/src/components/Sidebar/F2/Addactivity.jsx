import { useContext } from "react";
import featuresTabHook from "../../Noncomponents";
import Activitysetup from "./Activitysetup";

export default function Addactivity(){
    const {state, takeAction} = useContext(featuresTabHook);
    return <>
    <div className={`scrollHide ${state.darkMode? "scrollHideBottomDark" : "scrollHideBottomNormal"}`}></div>
    <div className="dailyActivityHolder">
      <div className="dailyActivity">
        <div className="activityBar abid"></div>
        <div className="activityBar aba">Activity</div>
        <div className="activityBar ab">Start</div>
        <div className="activityBar ab">End</div>
        <div className="activityBar ab">Priority</div>
        <div className="activityBar ab abs">Status </div>
        {state.activityData.length>0 && <div className="activityBar abf"><img className="asset1" src="./assets/controls.svg" alt="controls" onClick={() => {takeAction({type:"changeFilterButton", payload:!state.filterButton});}}/></div>}
      </div>
    </div>
    <div className={`scrollHideBottom ${state.darkMode? "scrollHideBottomDark" : "scrollHideBottomNormal"}`}></div>
    <div className="dailyActAddBar">
    {(state.addDailyActState ? <div className="addActivityBar">
        <Activitysetup></Activitysetup> </div> : <div className="currentActivities">
        <button className="addCurrentActivityButton" onClick={()=>{takeAction({type:"changeAddDailyActState", payload:true})}}>Add Daily Activities</button> </div>
    )}
    </div>
    </>
}