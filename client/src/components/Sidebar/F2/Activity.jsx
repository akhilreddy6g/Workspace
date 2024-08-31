import featuresTabHook from "../../Noncomponents";
import { useContext } from "react";

export default function Activity(props){
    const {state, takeAction} = useContext(featuresTabHook);
    return state.dailyactstate && <div className="dailyActivity soloActivityBar" style={{left: state.fthState? "17vw" : "10vw"}}>
      <div className="activityBar activity" style={{paddingLeft:"1vw", width:"25vw"}}>{props.activity}</div>
      <div className="activityBar activity" style={{width:"10vw"}}>{props.startTime + "-" + props.endTime}</div>
      <div className="activityBar activity" style={{width:"10vw"}}>{props.priority}</div>
      <div className="activityBar activity" style={{width:"10vw"}}>Status</div>
    </div>
}