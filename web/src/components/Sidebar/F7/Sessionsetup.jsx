import {useContext} from "react";
import featuresTabHook from "../../Noncomponents";
import { apiUrl } from "../../Noncomponents";
import { isValidSessionStartTime } from "../../Noncomponents";

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
        if(isValidSessionStartTime(data.startTime, data.endTime, data.breakTime, data.totalSessions)){
            try {
                const sessionMail = sessionStorage.getItem('email');
                const mail = state.emailId? state.emailId : sessionMail;
                const currActivities = await apiUrl.post(`/setup-sessions/${mail}`, {data});
                alertMessage("Session setup successful");
            } catch (error) {
                alertMessage(`Error while setting up sessions`);
            };
            takeAction({ type: "changeActivityState"});
        } else {
            alertMessage(`Invalid session start time. Each Session must be atleast 2 minutes and Start time and end time must be in the future and before 11:59 pm EST.`);
        };
        takeAction({type: "changeStdState", payload:false});
    };

    async function restoreLastVersion(e){
        e.preventDefault();
        takeAction({type: "changeStdState", payload: false})
        takeAction({ type: "changeCurrentAction", payload: "recover the last session?"});
        const userResponse = await new Promise((resolve) => {
          takeAction({ type: "changeDisclaimerState", payload: true });
          takeAction({ type: "changeDisclaimerButtons" });
          takeAction({ type: "setResolve", payload: resolve });
        });
        if(userResponse){
            try {
                const sessionMail = sessionStorage.getItem('email');
                const mail = state.emailId? state.emailId : sessionMail
                const response = await apiUrl.patch(`/recover-last-session/${mail}?sessionType=d`);
                takeAction({ type: "changeActivityState"});
                alertMessage(response.data.message)
            } catch (error) {
                alertMessage("Error while recovering the last session");
                takeAction({type: "changeStdState", payload: true});
            }
        } else{
            takeAction({type: "changeStdState", payload: true});
        }
    }

    return <div className={`sessionSetup sessform ${state.darkMode && "sessionSetup1"}`}>
        <form className="setDayForm" action="/set-your-day" method="post" onSubmit={handleSubmit}>
        <label className="sessionFormLabel" id="startTime" htmlFor="startTime">Start Time</label>
        <input className="sessionFormInput" required type="time" name="startTime" id="sessStart"/><br/>
        <label className="sessionFormLabel" id="endTime" htmlFor="endTime">End Time</label>
        <input className="sessionFormInput" required type="time" name="endTime" id="sessEnd" /><br/>
        <label className="sessionFormLabel" id="sessions" htmlFor="sessions">Sessions</label>
        <input className="sessionFormInput" required type="number" name="sessions" id="sessCount"/><br/>
        <label className="sessionFormLabel" id="breakTime" htmlFor="breakTime">Break Time</label>
        <input className="sessionFormInput" required type="number" min={2} name="breakTime" id="sessBreakTime" placeholder="min"/><br/>
        <button type="submit" id="submitSessionButton" style={{marginLeft: state.dsCombinedSubActivityData.length>0 && "90px"}}>Submit</button>
        {state.dsCombinedSubActivityData.length==0 && <button type="button" id="submitSessionButton" onClick={(e)=>{restoreLastVersion(e)}}>Recover</button>}
        </form>
    </div>
}