import {useContext} from "react";
import featuresTabHook from "../../Noncomponents";
import { isValidSessionStartTime } from "../../Noncomponents";
import { apiUrl } from "../../Noncomponents";

export default function Quicksessionsetup(){
    const {state, takeAction} = useContext(featuresTabHook);

    function alertMessage(message){
        takeAction({type:"changeFailedAction", payload:message});
        setTimeout(() => {
            takeAction({type:"changeFailedAction"});
        }, 5000);
      }

    const handleSubmit = async(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {
            startTime:formData.get("startTime"),
            endTime:formData.get("endTime"),
            totalSessions: 1,
            breakTime:formData.get("breakTime"),
            sessionType:'q',
            sessionVersion:'n'
        };
        if(data.breakTime>1 )
        if(isValidSessionStartTime(data.startTime, data.endTime, data.breakTime, data.totalSessions)){
            takeAction({type:"changeQsession", payload: data})
            takeAction({ type: "changeActivityState"});
            try {
                const sessionMail = sessionStorage.getItem('email');
                const mail = state.emailId? state.emailId : sessionMail
                const currActivities = await apiUrl.post(`/setup-sessions/${mail}`, {data});
                if (currActivities && currActivities.data.length>0 && !currActivities.data[0].message){
                    takeAction({type:"changeQsCombinedSubActivityData", payload:currActivities.data});
                }
                alertMessage("Session setup successful");
            } catch (error) {
                alertMessage(`Error while setting up the session`);
            };
        } else {
            alertMessage(`Invalid session start time / Session must be atleast 2 minutes and Start time and end time must be in the future and before 11:59 pm EST.`);
        }
      
        takeAction({type: "changeQuickSessState", payload:false})
    };

    async function restoreLastVersion(e){
        e.preventDefault();
        takeAction({type: "changeQuickSessState", payload: false})
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
                const response = await apiUrl.patch(`/recover-last-session/${mail}?sessionType=q`)
                takeAction({type:"changeQsession", payload: response.data});
                takeAction({ type: "changeActivityState", payload: false });
                alertMessage(response.data.message)
            } catch (error) {
                alertMessage("Error while recovering the last session");
            }
        } else{
            takeAction({type: "changeQuickSessState", payload: true});
        }
    }

    return <div className={`sessionSetup quickSession sessform ${state.darkMode && "sessionSetup1"}`}>
        <form className="setDayForm setQuickSession" action="/quick-session" method="post" onSubmit={handleSubmit}>
        <label className="sessionFormLabel" id="startTime" htmlFor="startTime">Start Time</label>
        <input className="sessionFormInput" required type="time" name="startTime" id="sessStart"/><br/>
        <label className="sessionFormLabel" id="endTime" htmlFor="endTime">End Time</label>
        <input className="sessionFormInput" required type="time" name="endTime" id="sessEnd" /><br/>
        <label className="sessionFormLabel" id="breakTime" htmlFor="breakTime">Break Time</label>
        <input className="sessionFormInput" required type="number" min={2} name="breakTime" id="sessBreakTime" placeholder="min"/><br/>
        <button type="submit" id="submitSessionButton" style={{marginLeft: state.qsCombinedSubActivityData.length>0 || state.qsession && "90px"}}>Submit</button>
        {state.qsCombinedSubActivityData.length==0 && !state.qsession && <button type="button" id="submitSessionButton" onClick={(e)=>{restoreLastVersion(e)}}>Recover</button>}
        </form>
    </div>
}