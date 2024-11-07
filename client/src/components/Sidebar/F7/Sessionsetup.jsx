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
        try {
            const sessionMail = sessionStorage.getItem('email');
            const mail = state.emailId? state.emailId : sessionMail
            await apiUrl.post(`/setup-sessions/${mail}`, {data});
            alertMessage("Session setup successful");
        } catch (error) {
            console.log("Something went wrong", error);
            alertMessage(`Unable to setup sessions: ${error}`);
        };
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