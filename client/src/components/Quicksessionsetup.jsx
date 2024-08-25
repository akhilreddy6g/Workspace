import {useContext} from "react";
import featuresTabHook from "./Noncomponents";

export default function Quicksessionsetup(){
    const {state, takeAction} = useContext(featuresTabHook);
    return <div className="sessionSetup quickSession sessform" style={{backgroundColor: state.darkMode && "rgb(48,48,48)"}}>
        <form className="setDayForm setQuickSession" action="/quick-session" method="post">
        <label className="sessionFormLabel" id="startTime" htmlFor="startTime">Start Time</label>
        <input className="sessionFormInput" type="time" name="startTime" id="sessStart"/><br/>
        <label className="sessionFormLabel" id="endTime" htmlFor="endTime">End Time</label>
        <input className="sessionFormInput" type="time" name="endTime" id="sessEnd" /><br/>
        <label className="sessionFormLabel" id="breakTime" htmlFor="breakTime">Break Time</label>
        <input className="sessionFormInput" type="number" name="breakTime" id="sessBreakTime" placeholder="min"/><br/>
        <button type="submit" id="submitSessionButton">Submit</button>
        </form>
    </div>
}