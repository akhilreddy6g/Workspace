import featuresTabHook from "../../Noncomponents";
import Activity from "./Activity";
import { useContext, useEffect, useState} from "react";
import axios from "axios";

export default function Dailyactivities(){
    const {state, takeAction} = useContext(featuresTabHook);
    const [data, changeData] = useState([]);

    async function alterData(){
      const res = await axios.get("http://localhost:3000/");
      changeData(res.data);
      if(res.data.length>0){
        takeAction({type:"changeZeroActivity", payload:false});
      } else if(data.length==0){
        takeAction({type:"changeZeroActivity", payload:true});
      };
    };
    
    function activityMapping(object){
      return <Activity
      id = {object.activity_id} 
      key = {object.activity_id}
      activity={object.activity_name} 
      startTime={object.activity_start_time} 
      endTime={object.activity_end_time} 
      priority={object.activity_priority}/>
    };

    useEffect(() => {
      alterData();
    },[state.dailyactstate]);

    return <>
    <div className="dailyActivity" style={{left: state.fthState? "17vw" : "10vw", marginBottom: "3vh"}}>
      <div className="activityBar" style={{paddingLeft:"1vw", width:"25vw"}}>Activity</div>
      <div className="activityBar" style={{width:"10vw"}}>Timeframe</div>
      <div className="activityBar" style={{width:"10vw"}}>Priority</div>
      <div className="activityBar" style={{width:"10vw"}}>Status </div>
    </div>
    {data.map(activityMapping)}
    </>
}