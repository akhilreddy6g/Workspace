import featuresTabHook from "../../Noncomponents";
import Activity from "./Activity";
import { useContext, useEffect, useState} from "react";
import { apiUrl } from "../../Noncomponents";

export default function Dailyactivities(){
    const {state, takeAction} = useContext(featuresTabHook);
    var data = state.activityData;
    const [loading, setLoading] = useState(true); 
    function alertMessage(message){
      takeAction({type:"changeFailedAction", payload:message});
      setTimeout(() => {
          takeAction({type:"changeFailedAction"});
      }, 3500);
    }
    async function alterData(){
        try {
          setLoading(true); 
          const sessionMail = sessionStorage.getItem('email');
          const mail = state.emailId? state.emailId : sessionMail
          const res = await apiUrl.get(`/activities/${mail}`);
          takeAction({type:"changeActivityData", payload: res.data})
        } catch (error) {
          // Cannot fetch Activities
        } finally {
            setLoading(false); 
        }
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

    if (loading) {
      return <div className="loadingSpinner" ><p className="loadingText" style={{color: state.darkMode? 'white' : 'black'}}>Loading, please wait...</p></div>;
    }

    return <>
    <div className={`dailyActivityContainer ${state.editActivity && "activityContainer3"}`} id="actContainer">{data && data.length > 0 && data.map(activityMapping)}</div>
    </>
}