import featuresTabHook from "../../Noncomponents";
import { useContext, useEffect, useState} from "react";
import axios from "axios";
import Missedactivitiesdates from "./Missedactivitiesdates";

export default function Missedactivitysetup(){
    const {state, takeAction} = useContext(featuresTabHook);
    const [data, setData] = useState([]);

    async function getData(){
        const response = await axios.get("http://localhost:3000/missed-activities-dates");
        return response.data;
    };

    function mapping(object, index){
        return <Missedactivitiesdates
            key = {index}
            date = {object.activity_date}
        />
    }

    useEffect(() => {
        getData().then(records => {setData(records)}).catch(error => {`error is ${error}`});
      },[state.updateMissedActivity]);
    
    return <> <div className="maMainContainer" style={{display:"flex", flexDirection:"column", position:"absolute", top:"85px", left:"17vw", gap:"20px"}}>  {state.editMissedActivity && <div className="overLay1"></div>}
         {data.length > 0 ? data.map(mapping) : <div className={`scheduleDisclaimer ${state.fthState? "scheduleDisclaimer1" : "scheduleDisclaimer2"}`}><p className="scheduleContext">Great Work! You have no missed activities</p></div>}
    </div>
    </>
}