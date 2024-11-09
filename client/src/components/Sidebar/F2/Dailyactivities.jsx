import featuresTabHook from "../../Noncomponents";
import Activity from "./Activity";
import { useContext, useEffect, useRef} from "react";
import { apiUrl } from "../../Noncomponents";

export default function Dailyactivities(){
    const {state, takeAction} = useContext(featuresTabHook);
    var data = state.activityData;
    async function alterData(){
      const sessionMail = sessionStorage.getItem('email');
      const mail = state.emailId? state.emailId : sessionMail
      const res = await apiUrl.get(`/activities/${mail}`);
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
      alterData();
    },[state.updateActivity]);

    if (!state.activityData || state.activityData === 0) {
      return <><div className={`scheduleDisclaimer ${state.fthState? "scheduleDisclaimer1" : "scheduleDisclaimer2"}`}><p className="scheduleContext">No daily activities to show. Add activities, to view</p></div><Currentdayactivity /></>;
    }

    return <>
    <div className={`activityContainer ${state.fthState? "activityContainer1" : "activityContainer2"} ${state.editActivity && "activityContainer3"}`} id="actContainer">{data && data.length > 0 && data.map(activityMapping)}</div>
    </>
}