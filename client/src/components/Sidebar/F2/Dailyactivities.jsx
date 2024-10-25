import featuresTabHook from "../../Noncomponents";
import Activity from "./Activity";
import { useContext, useEffect, useRef} from "react";
import axios from "axios";
import { apiUrl } from "../../Noncomponents";

export default function Dailyactivities(){
    const {state, takeAction} = useContext(featuresTabHook);
    var data = state.activityData;
    const isFirstRender = useRef(true);
    async function alterData(){
      const res = await apiUrl.get(`/activities/${state.emailId}`);
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

    if (!state.activityData || state.activityData === 0) {
      return <><div className={`scheduleDisclaimer ${state.fthState? "scheduleDisclaimer1" : "scheduleDisclaimer2"}`}><p className="scheduleContext">No daily activities to show. Add activities, to view</p></div><Currentdayactivity /></>;
    }

    return <>
    <div className={`activityContainer ${state.fthState? "activityContainer1" : "activityContainer2"} ${state.editActivity && "activityContainer3"}`} id="actContainer">{data && data.length > 0 && data.map(activityMapping)}</div>
    </>
}