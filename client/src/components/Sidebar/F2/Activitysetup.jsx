import featuresTabHook from "../../Noncomponents";
import { useContext} from "react";
import Headingpopup from "./Headingpopup";

export default function Activitysetup(){
    const {state, takeAction} = useContext(featuresTabHook);
    return (<><Headingpopup></Headingpopup>
            <div className="addActivity">
                <form className="activityForm">
                    <input type="text" id="activityName" name="info" className="actFormElement" onClick={() => {takeAction({type:"changeActivityHeading"})}} placeholder="Activity Name"/>
                    <input type="text" id="activityDesc" name="desc" className="actFormElement" onClick={() => {takeAction({type:"changeActivityHeading"})}} placeholder="Description"/>
                    <select name="priority" id="priorityDropdown" className="actFormElement">
                        <option value="priority">Priority</option>
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
                    <input type="time" id="activityTime" name="startTime"  className="actFormElement" onClick={() => {takeAction({type:"changeActivityHeading"})}} placeholder="Timeframe"/>
                    <input type="time" id="activityTime" name="endTime"  className="actFormElement" onClick={() => {takeAction({type:"changeActivityHeading"})}} placeholder="Timeframe"/>
                    <button type="button" className="submitActivity" style={{backgroundColor: state.darkMode? "rgb(48,48,48)": "grey" }}>+</button>
                </form>
            </div></>);};