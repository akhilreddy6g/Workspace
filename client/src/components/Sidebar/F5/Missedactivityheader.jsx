import featuresTabHook from "../../Noncomponents";
import { useContext } from "react";

export default function Missedactivityheader(props){
    const {state, takeAction} = useContext(featuresTabHook);
    const options = { year: 'numeric', month: 'long', day: 'numeric' }; 
    const dateStr = props.date;
    const [year, month, day] = dateStr.split('-');
    const dateObj = new Date(year, month - 1, day); 

    return <>
    <div className="missedActivity">
    <div className="activityBar abid"></div>
    <div className="activityBar aba" id="abaElement" style={{display:"flex", flexDirection:"row"}}>Missed Activities on <p className="missedActivityDate">{dateObj.toLocaleDateString('en-US', options)}</p></div>
    <div className="activityBar ab">Start</div>
    <div className="activityBar ab">End</div>
    <div className="activityBar ab">Priority</div>
    </div>
    </>
}