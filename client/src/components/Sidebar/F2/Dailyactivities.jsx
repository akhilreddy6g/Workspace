import featuresTabHook from "../../Noncomponents";
import Activity from "./Activity";
import { useContext, useEffect} from "react";
import axios from "axios";

export default function Dailyactivities(){
    const {state, takeAction} = useContext(featuresTabHook);
    const data = state.activityData;
    async function alterData(){
      const res = await axios.get("http://localhost:3000/");
      if(res.data.length!=data.length){
        takeAction({type:"changeActivityData", payload: res.data})
      };
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
      console.log("data", data);
    },[state.updateActivity]);

    return <>
    <div className="scrollHide" style={{left: state.fthState? "16vw" : "9vw", backgroundColor: state.darkMode? "rgb(48,48,48)" : "white"}}></div>
    <div className="dailyActivity" style={{left: state.fthState? "17vw" : "10vw"}}>
      <div className="activityBar" style={{width:"2vw", paddingLeft:"2vw"}}></div>
      <div className="activityBar" style={{width:"30vw",  marginLeft:"5vw"}}>Activity</div>
      <div className="activityBar" style={{width:"10vw",  marginLeft:"5vw"}}>Timeframe</div>
      <div className="activityBar" style={{width:"10vw",  paddingLeft:"4vw"}}>Priority</div>
      <div className="activityBar" style={{width:"10vw",  paddingLeft:"5vw"}}>Status </div>
    </div>
    <div className="activityContainer" style={{left: state.fthState? "17vw" : "10vw"}}>{data.map(activityMapping)}</div>
    </>
}