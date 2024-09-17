import {useContext, useEffect} from "react";
import featuresTabHook from "../../Noncomponents";
import Activitytab from "./Activitytab";
import Activityframe from "./ActivityFrame";
import Currentdayactivity from "./Currentdayactivity";
import axios from "axios"

export default function CurrentSchedule(){
    const {state, takeAction} = useContext(featuresTabHook);
    var data = state.activityData;
    async function alterData(){
        const res = await axios.get("http://localhost:3000/");
        takeAction({type:"changeActivityData", payload: res.data})
      };

    function activityMapping(object, index){
        return <Activitytab
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

    return (<><div className={`activityListHView ${state.fthState? "scheduleDisclaimer1" : "scheduleDisclaimer2"}`}>
        {data.map(activityMapping)}
    </div>
    <Activityframe></Activityframe>
    <Currentdayactivity></Currentdayactivity></>
    )
};