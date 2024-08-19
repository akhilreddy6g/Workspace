import React from "react";

export default function Sessionsetup(){
    return <div className="sessionSetup">
        <form className="setDayForm" action="/set-your-day" method="post">
        <label className="sessionFormLabel" id="startTime" for="startTime">Start Time</label>
        <input className="sessionFormInput" type="time" name="startTime" id="sessStart"/><br/>
        <label className="sessionFormLabel" id="endTime" for="endTime">End Time</label>
        <input className="sessionFormInput" type="time" name="endTime" id="sessEnd" /><br/>
        <label className="sessionFormLabel" id="sessions" for="sessions">Sessions</label>
        <input className="sessionFormInput" type="number" name="sessions" id="sessCount"/><br/>
        <label className="sessionFormLabel" id="breakTime" for="breakTime">Break Time</label>
        <input className="sessionFormInput" type="number" name="breakTime" id="sessBreakTime" placeholder="min"/><br/>
        <button type="submit" id="submitSessionButton">Submit</button>
        </form>
    </div>
}