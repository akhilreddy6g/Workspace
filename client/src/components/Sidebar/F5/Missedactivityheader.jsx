import featuresTabHook from "../../Noncomponents";
import { useContext } from "react";

export default function Missedactivityheader(props){
    const {state, takeAction} = useContext(featuresTabHook);
    const options = { year: 'numeric', month: 'long', day: 'numeric' }; 
    const dateStr = props.date;
    const [year, month, day] = dateStr.split('-');
    const dateObj = new Date(year, month - 1, day); 

    return <>
    <div className={`missedActivity ${state.fthState? "dailyActivity1" : "dailyActivity2"}`}>
    <div className="activityBar abid"></div>
    <div className="activityBar aba" style={{display:"flex", flexDirection:"row"}}>Missed Activities on <p className="missedActivityDate" style={{marginLeft:"20px", marginBottom:"0px",  marginTop: "4px", paddingLeft: "10px", paddingRight: "10px", height:"20px", display:"flex", alignItems:"center", fontFamily : "Cambria, Cochin, Georgia, Times, 'Times New Roman', serif", color:"white" , backgroundImage: "linear-gradient(to right ,rgb(42, 42, 243), rgba(144, 10, 144, 0.925))"}}>{dateObj.toLocaleDateString('en-US', options)}</p></div>
    <div className="activityBar ab">Start</div>
    <div className="activityBar ab">End</div>
    <div className="activityBar ab">Priority</div>
    </div>
    </>
}