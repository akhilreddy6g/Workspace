import featuresTabHook from "../../Noncomponents";
import { useContext } from "react";

export default function Dailyactivities(props){
    const {state, takeAction} = useContext(featuresTabHook);
    return state.dailyactstate && <div className="dailyActivity" style={{left: state.fthState? "17vw" : "10vw"}}>
      <div className="activityBar">Activity</div>
      <div className="activityBar">Timeframe</div>
      <div className="activityBar">Status</div>
    </div>
}