import featuresTabHook from "../../Noncomponents";
import { useContext } from "react";

export default function Headingpopup(props){
    const {state} = useContext(featuresTabHook);
    return <div className="popUpBar"> 
        <div className="headingPopUp">Name *</div>
        <div className="headingPopUp">Notes</div>
        <div className="headingPopUp">Priority *</div>
        <div className="headingPopUp">Start*</div>
        <div className="headingPopUp">End *</div>
        <div className="emptyPopUp"></div>
    </div>};