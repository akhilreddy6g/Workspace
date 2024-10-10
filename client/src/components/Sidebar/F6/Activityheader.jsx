import { useContext } from "react";
import featuresTabHook from "../../Noncomponents";

export default function Activityheader(){
    const {state, takeAction} = useContext(featuresTabHook);
    return <>
    <div className={`scrollHide ${state.fthState? "scrollHideBottom1" : "scrollHideBottom2" } ${state.darkMode? "scrollHideBottomDark" : "scrollHideBottomNormal"}`} style={{height:"160px"}}></div>
    <div className={`dailyActivity ${state.fthState? "dailyActivity1" : "dailyActivity2"}`} style={{top:"180px"}}>
      <div className="activityBar abid"></div>
      <div className="activityBar aba">Activity</div>
      <div className="activityBar ab">Start</div>
      <div className="activityBar ab">End</div>
      <div className="activityBar ab">Priority</div>
    </div>
    <div className={`scrollHideBottom ${state.fthState? "scrollHideBottom1" : "scrollHideBottom2" } ${state.darkMode? "scrollHideBottomDark" : "scrollHideBottomNormal"}`}></div>
    </>
}