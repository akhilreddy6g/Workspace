import {useContext} from "react";
import featuresTabHook from "../../Noncomponents";

export default function Sessionsetup(){
    const {state, takeAction} = useContext(featuresTabHook);
    return <div className={`sessionSetup sessform ${state.darkMode && "sessionSetup1"}`}>
        <form className="setDayForm" action="/set-your-day" method="post">
        <label className="sessionFormLabel" id="startTime" htmlFor="startTime">Start Time</label>
        <input className="sessionFormInput" type="time" name="startTime" id="sessStart"/><br/>
        <label className="sessionFormLabel" id="endTime" htmlFor="endTime">End Time</label>
        <input className="sessionFormInput" type="time" name="endTime" id="sessEnd" /><br/>
        <label className="sessionFormLabel" id="sessions" htmlFor="sessions">Sessions</label>
        <input className="sessionFormInput" type="number" name="sessions" id="sessCount"/><br/>
        <label className="sessionFormLabel" id="breakTime" htmlFor="breakTime">Break Time</label>
        <input className="sessionFormInput" type="number" name="breakTime" id="sessBreakTime" placeholder="min"/><br/>
        <button type="submit" id="submitSessionButton">Submit</button>
        </form>
    </div>
}