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
    <div className="activityBar aba" id="abaElement"> <div className="missedActivityDate" style={{display:"flex", justifyContent:"center", alignItems:"center"}}><p className="missedActivityDateText">{dateObj.toLocaleDateString('en-US', options)}</p></div></div>
    <div className="activityBar ab">Start</div>
    <div className="activityBar ab">End</div>
    <div className="activityBar ab">Priority</div>
    </div>
    </>
}