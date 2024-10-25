import featuresTabHook from "../../Noncomponents";
import { useContext} from "react";
import Headingpopup from "../F2/Headingpopup";
import axios from "axios";
import { apiUrl } from "../../Noncomponents";

export default function Addactivitybar(){
    const {state, takeAction} = useContext(featuresTabHook);
    function alertMessage(message){
        takeAction({type:"changeFailedAction", payload:message});
        setTimeout(() => {
            takeAction({type:"changeFailedAction"});
        }, 3500);
      }
    const submitAddActivity = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = {
            actName:formData.get("info"),
            actDescr:formData.get("desc"),
            priority:formData.get("priority"),
            startTime:formData.get("startTime"),
            endTime:formData.get("endTime"),
            actDate:state.actDate
        };
        if(data.actName.length>0 && data.actDescr.length>0 && data.startTime.length>0 && data.endTime.length>0){
            try {
                const response = await apiUrl.post(`/add-upcoming-activities/${state.emailId}`, data);
                if (response.data.flag){
                takeAction({type:"changeUpcActivityState", payload:!state.updateUpcomActivity});
                alertMessage("Successfully added the activity");}
                else {
                    alertMessage("Unable to add the activity: Please enter valid information (start time must be less than current time)");
                }
            } catch (error) {
                console.log("Something went wrong", error);
                alertMessage("Please enter valid information. Start time must be less than end time")
            };
        } else {
            alertMessage("Please enter all the necessary information");
            console.log("Please enter all the necessary information");
        };
        event.target.reset();
    };
    
    return (<><Headingpopup></Headingpopup>
            <div className="addActivity">
                <form className="activityForm" onSubmit={submitAddActivity}>
                    <input type="text" id="activityName" name="info" className="actFormElement"  placeholder="Upto 40 char"/>
                    <input type="text" id="activityDesc" name="desc" className="actFormElement" placeholder="Upto 200 Char"/>
                    <select name="priority" id="priorityDropdown" className="actFormElement">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select>
                    <input type="time" id="startTime" name="startTime"  className="actFormElement"/>
                    <input type="time" id="endTime" name="endTime"  className="actFormElement"/>
                    <button type="submit" className="submitActivity">Add</button>
                </form>
            </div></>);};