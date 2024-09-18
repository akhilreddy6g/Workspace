import featuresTabHook from "../../Noncomponents";
import Activity from "./Activity";
import { useContext, useEffect} from "react";
import axios from "axios";

export default function Dailyactivities(){
    const {state, takeAction} = useContext(featuresTabHook);
    var data = state.activityData;
    async function alterData(){
      const res = await axios.get("http://localhost:3000/activities");
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
    <div className={`activityContainer ${state.fthState? "activityContainer1" : "activityContainer2"} ${state.editActivity && "activityContainer3"}`} id="actContainer">{data.map(activityMapping)}</div>
    </>
}