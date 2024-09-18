import {useContext, useEffect} from "react";
import featuresTabHook from "../../Noncomponents";
import Activitytab from "./Activitytab";
import Activityframe from "./ActivityFrame";
import Currentdayactivity from "./Currentdayactivity";
import axios from "axios"

export default function CurrentSchedule(){
    const {state, takeAction} = useContext(featuresTabHook);
    var caData = state.combinedActivityData;
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
        priority={object.activity_priority}/>
    };

    useEffect(() => {
        alterData();
      },[state.updateActivity]);

    return (<><div className={`activityListHView ${state.fthState? "scheduleDisclaimer1" : "scheduleDisclaimer2"}`}>
        {caData.map(activityMapping)}
    </div>
    <Activityframe></Activityframe>
    <Currentdayactivity></Currentdayactivity></>
    )
};