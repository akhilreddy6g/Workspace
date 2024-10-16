import {useContext, useEffect, useRef} from "react";
import featuresTabHook from "../../Noncomponents";
import Activitytab from "./Activitytab";
import Activityframe from "./ActivityFrame";
import Currentdayactivity from "./Currentdayactivity";
import axios from "axios"

export default function CurrentSchedule(){
    const {state, takeAction} = useContext(featuresTabHook);
    const isFirstRender = useRef(true);
    
    async function alterData(){
        const combinedAct = await axios.get("http://localhost:3000/combined-activities");
        takeAction({type:"changeCombinedActivityData", payload: combinedAct.data})
      };
      
    function activityMapping(object, index){
        return <Activitytab
        sno = {index+1}
        id = {object.activity_uuid} 
        key = {object.activity_uuid}
        activity={object.activity_name} 
        startTime={object.activity_start_time.slice(0,5)} 
        endTime={object.activity_end_time.slice(0,5)}  
        priority={object.activity_priority}
        type ={object.activity_type}
        status = {object.activity_status}
        />
    };

    useEffect(() => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
      } else {
        alterData()};
      },[state.updateActivity]);

    if (!state.combinedActivityData || state.combinedActivityData.length === 0) {
        return <><div className={`scheduleDisclaimer ${state.fthState? "scheduleDisclaimer1" : "scheduleDisclaimer2"}`}><p className="scheduleContext">No schedule to show. Add activities, to view schedule</p></div><Currentdayactivity /></>;
    }
    
    return (
      <>
        <div className={`activityListHView ${state.fthState ? "activityListHView1" : "activityListHView2"}`}>
          {state.combinedActivityData.map(activityMapping)}
        </div>
        {state.combinedActivityData && state.combinedActivityData.length > 0 && (
          <Activityframe
            id={state.csActivityIndex==null? state.combinedActivityData[0].activity_uuid: state.combinedActivityData[state.csActivityIndex].activity_uuid}
            key={state.csActivityIndex==null? state.combinedActivityData[0].activity_uuid: state.combinedActivityData[state.csActivityIndex].activity_uuid}
            activity={state.csActivityIndex==null? state.combinedActivityData[0].activity_name: state.combinedActivityData[state.csActivityIndex].activity_name}
            startTime={state.csActivityIndex==null? state.combinedActivityData[0].activity_start_time.slice(0, 5): state.combinedActivityData[state.csActivityIndex].activity_start_time.slice(0, 5)}
            endTime={state.csActivityIndex==null? state.combinedActivityData[0].activity_end_time.slice(0, 5): state.combinedActivityData[state.csActivityIndex].activity_end_time.slice(0, 5)}
            priority={state.csActivityIndex==null? state.combinedActivityData[0].activity_priority: state.combinedActivityData[state.csActivityIndex].activity_priority}
            notes={state.csActivityIndex==null? state.combinedActivityData[0].activity_description : state.combinedActivityData[state.csActivityIndex].activity_description}
            type={state.csActivityIndex==null? state.combinedActivityData[0].activity_type : state.combinedActivityData[state.csActivityIndex].activity_type}
            status = {state.csActivityIndex==null? state.combinedActivityData[0].activity_status : state.combinedActivityData[state.csActivityIndex].activity_status}
          />
        )}
        <Currentdayactivity />
      </>
    );
}    