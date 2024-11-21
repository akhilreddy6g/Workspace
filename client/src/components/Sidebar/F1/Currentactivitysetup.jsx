import featuresTabHook from "../../Noncomponents";
import { useContext} from "react";
import Headingpopup from "../F2/Headingpopup"
import { apiUrl } from "../../Noncomponents";

export default function Currentactivitysetup(){
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
        };
        try {
            const sessionMail = sessionStorage.getItem('email');
            const mail = state.emailId? state.emailId : sessionMail
            const response = await apiUrl.post(`/add-current-day-activity/${mail}`, {data})
            if (response.data.flag){
                takeAction({type:"changeActivityState", payload:!state.updateActivity});
                alertMessage("Successfully added the activity");
            } else {
                alertMessage("Unable to add the activity: Start time must be ahead of current time");
            }
        } catch (error) {
            alertMessage(`Error while adding the activitiy`);
        };
    event.target.reset();
    };
    
    return (<><Headingpopup></Headingpopup>
            <div className="addActivity" >
                <form className="activityForm" onSubmit={submitAddActivity}>
                    <input required  type="text" id="activityName" name="info" className="actFormElement" placeholder="Upto 40 char"/>
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
                    <input required type="time" id="startTime" name="startTime"  className="actFormElement"/>
                    <input required type="time" id="endTime" name="endTime"  className="actFormElement"/>
                    <button type="submit" className="submitActivity">Add</button>
                </form>
            </div></>);};