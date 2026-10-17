import { useContext } from "react";
import featuresTabHook from "../../Noncomponents";

export default function Activityheader(){
    const {state, takeAction} = useContext(featuresTabHook);
    return <>
    <div className={`scrollHide ${state.darkMode? "scrollHideBottomDark" : "scrollHideBottomNormal"}`} style={{height:"160px"}}></div>
    <div className="dailyActivity" style={{top:"180px"}}>
      <div className="activityBar abid"></div>
      <div className="activityBar aba">Activity</div>
      <div className="activityBar ab">Start</div>
      <div className="activityBar ab">End</div>
      <div className="activityBar ab">Priority</div>
    </div>
    <div className={`scrollHideBottom ${state.darkMode? "scrollHideBottomDark" : "scrollHideBottomNormal"}`}></div>
    </>
}