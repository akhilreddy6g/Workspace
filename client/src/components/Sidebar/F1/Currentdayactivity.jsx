import { useContext} from "react";
import featuresTabHook from "../../Noncomponents";
import Currentactivitysetup from "./Currentactivitysetup";

export default function Currentdayactivity(){
    const {state, takeAction} = useContext(featuresTabHook);
    return (<div className="addActivityFrame"> {state.addCurrentDayActivity ? <div className="addActivityBar">
        <Currentactivitysetup></Currentactivitysetup> </div> : <div className="currentActivities">
        <button className="addCurrentActivityButton" onClick={()=>{takeAction({type:"changeCurrentDayState", payload:true})}}>Add Today's Activities</button> </div>} </div>
    )
}


