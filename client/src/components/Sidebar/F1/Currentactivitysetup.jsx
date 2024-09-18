import featuresTabHook from "../../Noncomponents";
import { useContext} from "react";
import Headingpopup from "../F2/Headingpopup"
import axios from "axios";

export default function Currentactivitysetup(){
    const {state, takeAction} = useContext(featuresTabHook);

    const submitAddActivity = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = {
            actName:formData.get("info"),
            actDescr:formData.get("desc"),
            priority:formData.get("priority"),
            startTime:formData.get("startTime"),
            endTime:formData.get("endTime")
        };
        try {
            await axios({
                method: 'post',
                url: 'http://localhost:3000/add-current-day-activity',
                headers: {'Content-Type' : 'application/json'},
                data: {data}
            });
            takeAction({type:"changeActivityState", payload:!state.updateActivity});
            event.target.reset();
        } catch (error) {
            console.log("Something went wrong", error);
        };
        takeAction({type:"changeCurrentDayState", payload:false});
    };
    
    return (<><Headingpopup></Headingpopup>
            <div className={`addActivity ${state.fthState? "scheduleDisclaimer1" : "scheduleDisclaimer2"}`} >
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