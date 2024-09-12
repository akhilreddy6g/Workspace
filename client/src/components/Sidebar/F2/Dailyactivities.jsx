import featuresTabHook from "../../Noncomponents";
import Activity from "./Activity";
import { useContext, useEffect} from "react";
import axios from "axios";

export default function Dailyactivities(){
    const {state, takeAction} = useContext(featuresTabHook);
    var data = state.activityData;
    async function alterData(){
      const res = await axios.get("http://localhost:3000/");
      takeAction({type:"changeActivityData", payload: res.data})
    };
    
    function activityMapping(object, index){
      return <Activity
      sno = {index+1}
      id = {object.activity_id} 
      key = {object.activity_id}
      activity={object.activity_name} 
      startTime={object.activity_start_time} 
      endTime={object.activity_end_time} 
      priority={object.activity_priority}/>
    };

    useEffect(() => {
      alterData();
    },[state.updateActivity]);

    return <>
    <div className={`scrollHide ${state.fthState? "scrollHideBottom1" : "scrollHideBottom2" } ${state.darkMode? "scrollHideBottomDark" : "scrollHideBottomNormal"}`}></div>
    <div className={`dailyActivity ${state.fthState? "dailyActivity1" : "dailyActivity2"}`}>
      <div className="activityBar abid"></div>
      <div className="activityBar aba">Activity</div>
      <div className="activityBar ab">Start</div>
      <div className="activityBar ab">End</div>
      <div className="activityBar ab">Priority</div>
      <div className="activityBar ab">Status </div>
      <div className="activityBar abf">Filter</div>
    </div>
    <div className={`activityContainer ${state.fthState? "activityContainer1" : "activityContainer2"}`} id="actContainer">{data.map(activityMapping)}</div>
    </>
}