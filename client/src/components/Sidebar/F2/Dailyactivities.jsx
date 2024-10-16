import featuresTabHook from "../../Noncomponents";
import Activity from "./Activity";
import { useContext, useEffect, useRef} from "react";
import axios from "axios";

export default function Dailyactivities(){
    const {state, takeAction} = useContext(featuresTabHook);
    var data = state.activityData;
    const isFirstRender = useRef(true);
    async function alterData(){
      const res = await axios.get("http://localhost:3000/activities");
      takeAction({type:"changeActivityData", payload: res.data})
    };

    function activityMapping(object, index){
      return <Activity
      sno = {index+1}
      id = {object.activity_uuid} 
      key = {object.activity_uuid}
      activity={object.activity_name} 
      startTime={object.activity_start_time.slice(0,5)} 
      endTime={object.activity_end_time.slice(0,5)} 
      priority={object.activity_priority}
      status={object.activity_status}/>
    };

    useEffect(() => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
      } else {
      alterData();}
    },[state.updateActivity]);

    return <>
    <div className={`activityContainer ${state.fthState? "activityContainer1" : "activityContainer2"} ${state.editActivity && "activityContainer3"}`} id="actContainer">{data.map(activityMapping)}</div>
    </>
}