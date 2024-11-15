import {useContext} from "react";
import featuresTabHook from "../../Noncomponents";
import { apiUrl } from "../../Noncomponents";

export default function Sessionsetup(){
    const {state, takeAction} = useContext(featuresTabHook);

    function alertMessage(message){
        takeAction({type:"changeFailedAction", payload:message});
        setTimeout(() => {
            takeAction({type:"changeFailedAction"});
        }, 3500);
      }

    function isValidSessionStartTime(start, end) {
        const now = new Date();
        const offset = now.getTimezoneOffset() / 60;
        const estOffset = offset - 5;
        const currentEstTime = new Date(now.getTime() + estOffset * 60 * 60 * 1000);
        const [hours, minutes] = start.split(":").map(Number);
        const [hours1, minutes1] = end.split(":").map(Number);
        const sessionStartTime = new Date(currentEstTime);
        sessionStartTime.setHours(hours);
        sessionStartTime.setMinutes(minutes);
        sessionStartTime.setSeconds(0);
        sessionStartTime.setMilliseconds(0);
        const isFutureTime = sessionStartTime > currentEstTime;
        const isEndFutureTime = hours1 < 24 && minutes1 < 60;
        const isBeforeEndOfDay = hours < 24 && minutes < 60;
        return isFutureTime && isBeforeEndOfDay && isEndFutureTime;
    }
      
    const handleSubmit = async(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            startTime:formData.get("startTime"),
            endTime:formData.get("endTime"),
            totalSessions:formData.get("sessions"),
            breakTime:formData.get("breakTime"),
            sessionType:'d',
            sessionVersion:'n'
        };
        if(isValidSessionStartTime(data.startTime, data.endTime)){
            try {
                const sessionMail = sessionStorage.getItem('email');
                const mail = state.emailId? state.emailId : sessionMail
                await apiUrl.post(`/setup-sessions/${mail}`, {data});
                alertMessage("Session setup successful");
            } catch (error) {
                console.log("Something went wrong", error);
                alertMessage(`Unable to setup sessions: ${error}`);
            };
        } else {
            alertMessage(`Invalid session start time. Start time and end time must be in the future and before 11:59 pm.`);
        }
       
        takeAction({type:"changeStdState"})
    };
    return <div className={`sessionSetup sessform ${state.darkMode && "sessionSetup1"}`}>
        <form className="setDayForm" action="/set-your-day" method="post" onSubmit={handleSubmit}>
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