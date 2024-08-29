import featuresTabHook from "../../Noncomponents";
import { useContext} from "react";
import Headingpopup from "./Headingpopup";

export default function Activitysetup(){
    const {state, takeAction} = useContext(featuresTabHook);
    return (<><Headingpopup></Headingpopup>
            <div className="addActivity">
                <form className="activityForm" action="http://localhost:3000/" method="post">
                    <input type="text" id="activityName" name="info" className="actFormElement" onClick={() => {takeAction({type:"changeActivityHeading"})}} placeholder="Upto 40 char"/>
                    <input type="text" id="activityDesc" name="desc" className="actFormElement" onClick={() => {takeAction({type:"changeActivityHeading"})}} placeholder="Upto 200 Char"/>
                    <select name="priority" id="priorityDropdown" className="actFormElement">
                        <option value="0"></option>
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
                    <input type="time" id="activityTime" name="startTime"  className="actFormElement" onClick={() => {takeAction({type:"changeActivityHeading"})}}/>
                    <input type="time" id="activityTime" name="endTime"  className="actFormElement" onClick={() => {takeAction({type:"changeActivityHeading"})}}/>
                    <button type="submit" className="submitActivity">+</button>
                </form>
            </div></>);};