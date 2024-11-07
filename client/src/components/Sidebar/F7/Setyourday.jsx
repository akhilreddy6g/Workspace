import {useContext, useState, useEffect} from "react";
import featuresTabHook from "../../Noncomponents";
import Sessionsetup from "./Sessionsetup";
import Session from "./Session";
import { apiUrl } from "../../Noncomponents";
import { convertTimeToAmPm } from "../../Noncomponents";

export default function Setyourday(){
    const {state, takeAction} = useContext(featuresTabHook);
    const [todaySessions, changeSessions] = useState([]);

    function scheduleSessions(startTimeStr, endTimeStr, breakTime, totalSessions) {
        const startTime = new Date(`1970-01-01T${startTimeStr}`);
        const endTime = new Date(`1970-01-01T${endTimeStr}`);
        const totalMinutes = (endTime - startTime) / (1000 * 60);
        const totalBreakTime = breakTime * totalSessions;
        const sessionDuration = Math.floor((totalMinutes - totalBreakTime) / totalSessions);
        let currentTime = new Date(startTime);
        const schedule = [];
        for (let i = 0; i < totalSessions; i++) {
            let sessionEndTime = new Date(currentTime.getTime() + sessionDuration * 60 * 1000);
            let breakStartTime = new Date(sessionEndTime);
            let breakEndTime = new Date(breakStartTime.getTime() + breakTime * 60 * 1000);
            schedule.push({
                session: i + 1,
                sessionStart: convertTimeToAmPm(formatTime(currentTime)),
                sessionEnd: convertTimeToAmPm(formatTime(sessionEndTime)),
                breakStart: convertTimeToAmPm(formatTime(breakStartTime)),
                breakEnd: convertTimeToAmPm(formatTime(breakEndTime)),
                sessionStart24Hr: formatTime(currentTime),
                sessionEnd24Hr: formatTime(sessionEndTime),
                breakStart24Hr: formatTime(breakStartTime),
                breakEnd24Hr: formatTime(breakEndTime),
            });
            currentTime = new Date(breakEndTime);
        }
        return schedule;
    }
    function formatTime(date) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    async function alterData(){
        const sessionMail = sessionStorage.getItem('email');
        const mail = state.emailId? state.emailId : sessionMail
        const response = await apiUrl.get(`/session-details/${mail}?sessionType=d`);
        console.log("response is: ", response.data[0]);
        if(response.data.length>0 && response.data[0].session_version=='n' && response.data[0].session_type=='d'){
            const sessions = scheduleSessions(response.data[0].session_start_time, response.data[0].session_end_time, response.data[0].break_time, response.data[0].total_sessions);
            changeSessions(sessions);
        } else {
            console.log("Unable to set time period");
        }
    }

    function mapping(object, index){
        return (
            <Session key={`sessionContainer-${index}`} id={index} session={object.session} startTime={object.sessionStart} endTime={object.sessionEnd} breakStartTime={object.breakStart} breakEndTime={object.breakEnd} startTime24Hr={object.sessionStart24Hr} endTime24Hr={object.sessionEnd24Hr} breakStartTime24Hr={object.breakStart24Hr} breakEndTime24Hr={object.breakEnd24Hr}></Session>
        )
    }

    useEffect(()=>{
        alterData()
    }, [state.stdState])

     return <>  
     {todaySessions.length==0 && <div className={`scheduleDisclaimer ${state.fthState ? "scheduleDisclaimer1" : "scheduleDisclaimer2"}`}>
     <p className="scheduleContext">No sessions to show. Setup sessions and plan your day</p>
    </div> }

    <div className="sessionTabs" style={{left: state.fthState? "11.5vw" : "4.5vw"}}>
        {todaySessions && todaySessions.length>0 && todaySessions.map(mapping)}
    </div>
     {state.stdState? 
        <div className="overLay">
        <div className={`setDay ${state.darkMode ? "setDay1" : "setDay2"}`}>
            <div className={`toolBar ${state.darkMode && "toolBar1"}`}>
                <p className="setDayContext">Setup Sessions</p>
                <button className="closeSetDayButton" onClick={() => {takeAction({type:"changeStdState"})}}>x</button>
            </div>
            <Sessionsetup></Sessionsetup>
        </div>
        </div> : 
        <div className={`currentActivities ${state.fthState? "scheduleDisclaimer1" : "scheduleDisclaimer2"}`}>
        <button className="addCurrentActivityButton" onClick={()=>{takeAction({type: "changeStdState"})}}>Setup Sessions</button> </div>
    }
    </>
    }