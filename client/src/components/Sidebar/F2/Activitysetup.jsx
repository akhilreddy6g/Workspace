import featuresTabHook from "../../Noncomponents";
import { useContext} from "react";
import Headingpopup from "./Headingpopup";
import axios from "axios";

export default function Activitysetup(){
    const {state, takeAction} = useContext(featuresTabHook);
    const submitAddActivity = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = {
            actnName:formData.get("info"),
            actDescr:formData.get("desc"),
            priority:formData.get("priority"),
            startTime:formData.get("startTime"),
            endTime:formData.get("endTime")
        };
        try {
            await axios({
                method: 'post',
                url: 'http://localhost:3000/add-activity',
                headers: {'Content-Type' : 'application/json'},
                data: {data}
            });
            console.log("yes yesy yes");
            takeAction({type:"changeActivityState"});
        } catch (error) {
            console.log("Something went wrong", error);
        };
    };
    return (<><Headingpopup></Headingpopup>
            <div className="addActivity">
                <form className="activityForm" onSubmit={submitAddActivity}>
                    <input type="text" id="activityName" name="info" className="actFormElement" onClick={() => {takeAction({type:"changeActivityHeading"});}} placeholder="Upto 40 char"/>
                    <input type="text" id="activityDesc" name="desc" className="actFormElement" onClick={() => {takeAction({type:"changeActivityHeading"});}} placeholder="Upto 200 Char"/>
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
                    <input type="time" id="activityTime" name="startTime"  className="actFormElement" onClick={() => {takeAction({type:"changeActivityHeading"});}}/>
                    <input type="time" id="activityTime" name="endTime"  className="actFormElement" onClick={() => {takeAction({type:"changeActivityHeading"});}}/>
                    <button type="submit" className="submitActivity">Add</button>
                </form>
            </div></>);};