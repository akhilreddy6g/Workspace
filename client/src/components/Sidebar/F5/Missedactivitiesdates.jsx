import featuresTabHook from "../../Noncomponents";
import { useContext, useEffect} from "react";
import Missedactivities from "./Missedactivities";
import Missedactivityheader from "./Missedactivityheader";
import axios from "axios";

export default function Missedactivitiesdates(props){
    const {state, takeAction} = useContext(featuresTabHook);
    async function getData(){
        const response = await axios.get("http://localhost:3000/missed-activities");
        return response.data;
    };

    async function alterData(){
        const records = await getData()
        takeAction({type:"changeMissedActivityData", payload:records});
      };
  
    function activityMapping(object, index){
        return <Missedactivities
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
      },[state.updateMissedActivity]);
  
    return<>
    <div className={`missedActivityContainer ${state.fthState? "dailyActivity1" : "dailyActivity2"}`}>
        <div className="missedActivityHeaderTab">
            {<Missedactivityheader date={props.date.slice(0,10)}/>}
            <div className="missedActivitiesList">
            {state.missedActivities.length>0 && (state.missedActivities.filter((record)=> record.activity_date.slice(0,10) == props.date.slice(0,10))).map(activityMapping)}
            </div>
        </div>
    </div>
    </>
};

