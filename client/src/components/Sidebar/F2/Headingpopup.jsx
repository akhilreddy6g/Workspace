import featuresTabHook from "../../Noncomponents";
import { useContext } from "react";

export default function Headingpopup(props){
    const {state} = useContext(featuresTabHook);
    return <div className="popUpBar" style={{top: state.activityHeading? "0px" : "15px"}}> 
        <div className="headingPopUp">Activity</div>
        <div className="headingPopUp">Description</div>
        <div className="headingPopUp">Priority</div>
        <div className="headingPopUp">Start Time</div>
        <div className="headingPopUp">End Time</div>
    </div>}