import featuresTabHook from "../../Noncomponents";
import { useContext, useEffect, useState} from "react";
import Activitytab from "../F1/Activitytab";
import Activityframe from "../F1/Activityframe";
import { convertTimeToAmPm } from "../../Noncomponents";
import { timeToMinutes } from "../../Noncomponents";
import { formatTime } from "../../Noncomponents";
import { minutesTo24hr } from "../../Noncomponents";
import { convertMinutesToHours } from "../../Noncomponents";

export default function Qsession(){
    const {state, takeAction} = useContext(featuresTabHook);
    const [progress, setProgress] = useState(0);
    const [breakProgress, setBreakProgress] = useState(0);
    const [sessionHover, changeHover] = useState(false);
    const [breakHover, changeBHover] = useState(false);
    const [sremTime, setRemTime] = useState(null);
    const [bremTime, setBRemTime] = useState(null);
    var data = state.qsCombinedSubActivityData;
    function activityMapping(object, index) {
        if (!object || !object.activity_uuid) return null;
        return (
            <Activitytab
                sno={index + 1}
                id={object.activity_uuid}
                key={object.activity_uuid}
                activity={object.activity_name}
                startTime={object.activity_start_time ? object.activity_start_time.slice(0, 5) : 'N/A'}
                endTime={object.activity_end_time ? object.activity_end_time.slice(0, 5) : 'N/A'}
                priority={object.activity_priority}
                type={object.activity_type}
                status={object.activity_status}
                startTimeAmPm = {convertTimeToAmPm(formatTime(new Date(`1970-01-01T${object.activity_start_time}`)))}
                endTimeAmPm = {convertTimeToAmPm(formatTime(new Date(`1970-01-01T${object.activity_end_time}`)))}
                flag = {false}
            />
        );
    }

    async function updateProgress() {
        const now = new Date();
        const currentTimeMinutes = now.getHours() * 60 + now.getMinutes(); 
        const startTimeMinutes = timeToMinutes(state.qsession[0].session_start_time); 
        const endTimeMinutes = timeToMinutes((minutesTo24hr(timeToMinutes(state.qsession[0].session_end_time)-state.qsession[0].break_time))); 
        const breakEndTimeMinutes = timeToMinutes(state.qsession[0].session_end_time);
        const sessionMail = sessionStorage.getItem('email');
        const mail = state.emailId? state.emailId : sessionMail
        if (currentTimeMinutes >= endTimeMinutes) {
            setProgress(100);
            setRemTime('0h 0m');
        } else if (currentTimeMinutes >= startTimeMinutes && currentTimeMinutes <= endTimeMinutes) {
            const totalTime = endTimeMinutes - startTimeMinutes; 
            const timeElapsed = currentTimeMinutes - startTimeMinutes;
            const timeLeft = totalTime - timeElapsed;
            const timeLeftInHours = convertMinutesToHours(timeLeft);
            setRemTime(timeLeftInHours);
            const percentage = (timeElapsed / totalTime) * 100;
            setProgress(percentage);
        } else {
            const totalTime = endTimeMinutes - startTimeMinutes;
            const timeLeftInHours = convertMinutesToHours(totalTime);
            setRemTime(timeLeftInHours);
            setProgress(0);
        };
        if (currentTimeMinutes >= breakEndTimeMinutes) {
            setBreakProgress(100);
            setBRemTime
        } else if (currentTimeMinutes >= endTimeMinutes && currentTimeMinutes <= breakEndTimeMinutes) {
            const totalTime = breakEndTimeMinutes - endTimeMinutes; 
            const timeElapsed = currentTimeMinutes - endTimeMinutes;
            const timeLeft = totalTime - timeElapsed;
            const timeLeftInHours = convertMinutesToHours(timeLeft);
            setBRemTime(timeLeftInHours);
            const percentage = (timeElapsed / totalTime) * 100;
            setBreakProgress(percentage);
        } else {
            const totalTime = breakEndTimeMinutes - endTimeMinutes;
            const timeLeftInHours = convertMinutesToHours(totalTime);
            setBRemTime(timeLeftInHours);
            setBreakProgress(0);
        };
    };

    useEffect(() => {
        updateProgress();
        const intervalId = setInterval(updateProgress, 15000); 
        return () => clearInterval(intervalId);
    }, [state.qsession, state.updateActivity]);

    return (
        <>
            <div className="activityListHViewFrame">
                {data && data.length > 0 && <div className="activityListHView">
                    {data.map(activityMapping)}
                </div>}
                {state.qsession[0] && state.qsession[0] !== null && (
                    <div className="qsessionInfo" style={{backgroundColor: state.darkMode? "rgb(48, 48, 48)" : "white", top:state.qsCombinedSubActivityData && state.qsCombinedSubActivityData.length<1 && "125px"}}>
                        <div className="qsessionBar" style={{border: state.darkMode? "0.1px solid white" : "0.1px solid black"}} onMouseOver={()=>{changeHover(true)}} onMouseLeave={()=>{changeHover(false)}}>
                            <div className="qsessionTimeContainer" style={{justifyContent: sessionHover && "center"}}>
                                {!sessionHover && state.qsession[0] && state.qsession[0] !== null && (<p className="qsessTcElement" id="qsHide">{convertTimeToAmPm(state.qsession[0].session_start_time)}</p>)}
                                {!sessionHover && state.qsession[0] && state.qsession[0] !== null && (<p className="qsessTcElement">Quick Session</p>)}
                                {!sessionHover && state.qsession[0] && state.qsession[0] !== null && (<p className="qsessTcElement" id="qsHide">{convertTimeToAmPm(minutesTo24hr(timeToMinutes(state.qsession[0].session_end_time) - state.qsession[0].break_time))}</p>)}
                                {sessionHover && <p className="qsessTcElement">{sremTime} left</p>}
                            </div>
                            {progress > 2 && <div className="qsessTimeBar" style={{ width: `${progress}%` }}></div>}
                        </div>
                        <div className="qsessionBreakBar" style={{border: state.darkMode? "0.1px solid white" : "0.1px solid black"}} onMouseOver={()=>{changeBHover(true)}} onMouseLeave={()=>{changeBHover(false)}}>
                            <div className="qsessionBreakTimeContainer" style={{justifyContent: breakHover && "center"}}>
                                {!breakHover && state.qsession[0] && state.qsession[0] !== null && (<p className="qsessBTcElement" id="qsHide">{convertTimeToAmPm(minutesTo24hr(timeToMinutes(state.qsession[0].session_end_time) - state.qsession[0].break_time))}</p>)}
                                {!breakHover && state.qsession[0] && state.qsession[0] !== null && (<p className="qsessBTcElement">Break</p>)}
                                {!breakHover && state.qsession[0] && state.qsession[0] !== null && (<p className="qsessBTcElement" id="qsHide">{convertTimeToAmPm(state.qsession[0].session_end_time)}</p>)}
                                {breakHover && <p className="qsessTcElement">{bremTime} left</p>}
                            </div>
                             {breakProgress > 2 && <div className="qsessBreakTimeBar" style={{ width: `${breakProgress}%` }}></div>}
                        </div>
                    </div>
                )}

                {data && data.length > 0 && (
                <Activityframe
                    id={state.qsActivityIndex != null && state.qsCombinedSubActivityData[state.qsActivityIndex] ? state.qsCombinedSubActivityData[state.qsActivityIndex].activity_uuid : state.qsCombinedSubActivityData[0]?.activity_uuid}
                    key={state.qsActivityIndex != null && state.qsCombinedSubActivityData[state.qsActivityIndex] ? state.qsCombinedSubActivityData[state.qsActivityIndex].activity_uuid : state.qsCombinedSubActivityData[0]?.activity_uuid}
                    activity={ state.qsActivityIndex != null && state.qsCombinedSubActivityData[state.qsActivityIndex] ? state.qsCombinedSubActivityData[state.qsActivityIndex].activity_name : state.qsCombinedSubActivityData[0]?.activity_name }
                    startTime={ state.qsActivityIndex != null && state.qsCombinedSubActivityData[state.qsActivityIndex] ? state.qsCombinedSubActivityData[state.qsActivityIndex].activity_start_time.slice(0, 5) : state.qsCombinedSubActivityData[0]?.activity_start_time.slice(0, 5)}
                    endTime={ state.qsActivityIndex != null && state.qsCombinedSubActivityData[state.qsActivityIndex] ? state.qsCombinedSubActivityData[state.qsActivityIndex].activity_end_time.slice(0, 5) : state.qsCombinedSubActivityData[0]?.activity_end_time.slice(0, 5)}
                    priority={ state.qsActivityIndex != null && state.qsCombinedSubActivityData[state.qsActivityIndex] ? state.qsCombinedSubActivityData[state.qsActivityIndex].activity_priority : state.qsCombinedSubActivityData[0]?.activity_priority }
                    notes={ state.qsActivityIndex != null && state.qsCombinedSubActivityData[state.qsActivityIndex] ? state.qsCombinedSubActivityData[state.qsActivityIndex].activity_description : state.qsCombinedSubActivityData[0]?.activity_description }
                    type={ state.qsActivityIndex != null && state.qsCombinedSubActivityData[state.qsActivityIndex] ? state.qsCombinedSubActivityData[state.qsActivityIndex].activity_type : state.qsCombinedSubActivityData[0]?.activity_type }
                    status={ state.qsActivityIndex != null && state.qsCombinedSubActivityData[state.qsActivityIndex] ? state.qsCombinedSubActivityData[state.qsActivityIndex].activity_status : state.qsCombinedSubActivityData[0]?.activity_status }
                    writtenNotes = { state.qsActivityIndex != null && state.qsCombinedSubActivityData[state.qsActivityIndex] ? state.qsCombinedSubActivityData[state.qsActivityIndex].activity_notes : state.qsCombinedSubActivityData[0]?.activity_notes }
                    flag = {false}
                    top = {"222px"}
                />
            )}
            </div>
        </>
    );
}