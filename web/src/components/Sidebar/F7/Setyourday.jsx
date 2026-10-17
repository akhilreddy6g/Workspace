import {useContext, useState, useEffect, useRef} from "react";
import featuresTabHook from "../../Noncomponents";
import Sessionsetup from "./Sessionsetup";
import Session from "./Session";
import { apiUrl } from "../../Noncomponents";
import { convertTimeToAmPm } from "../../Noncomponents";
import { timeToMinutes } from "../../Noncomponents";
import { formatTime } from "../../Noncomponents";

export default function Setyourday(){
    const {state, takeAction} = useContext(featuresTabHook);
    const [todaySessions, changeSessions] = useState([]);
    const [loading, setLoading] = useState(false); 
    const tempActivities = useRef([]);

    function scheduleSessions(startTimeStr, endTimeStr, breakTime, totalSessions) {
        const startTime = new Date(`1970-01-01T${startTimeStr}`);
        const endTime = new Date(`1970-01-01T${endTimeStr}`);
        const totalMinutes = (endTime - startTime) / (1000 * 60);
        const totalBreakTime = breakTime * totalSessions;
        const sessionDuration = Math.floor((totalMinutes - totalBreakTime) / totalSessions);
        let currentTime = startTime;
        let presentTime = new Date();
        const schedule = [];
        for (let i = 0; i < totalSessions; i++) {
            let sessionEndTime = new Date(currentTime.getTime() + sessionDuration * 60 * 1000);
            let breakStartTime = new Date(sessionEndTime);
            let breakEndTime = new Date(breakStartTime.getTime() + breakTime * 60 * 1000);
            let activityInfo = [];
            if(tempActivities.current.length>0){
                tempActivities.current.forEach(element => {
                    let nameAndColor = [];
                    let ast = timeToMinutes(formatTime(new Date(`1970-01-01T${element.activity_start_time}`)));
                    let aet = timeToMinutes(formatTime(new Date(`1970-01-01T${element.activity_end_time}`)));
                    let bet = timeToMinutes(formatTime(breakEndTime));
                    let sst = timeToMinutes(formatTime(currentTime));
                    let set = timeToMinutes(formatTime(breakEndTime));
                    let pt = timeToMinutes(formatTime(presentTime));
                    if(ast>=sst && ast<bet){
                        nameAndColor.push(element.activity_name);
                        if(element.activity_status==1){
                            nameAndColor.push('green');
                        } else if(element.activity_status==0){
                            nameAndColor.push('red');
                        } else if(sst>pt){
                            nameAndColor.push('black');
                        } else if(pt>sst && pt<set) {
                            nameAndColor.push('orange');
                        } else if(element.activity_status!=1 && pt>set) {
                            nameAndColor.push('red');
                        }
                    }
                    if(nameAndColor.length>0){
                        activityInfo.push(nameAndColor);
                    }
                });
            }
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
                activityList: activityInfo,
            });
            currentTime = new Date(breakEndTime);
        }
        return schedule;
    }

    async function alterData(){
        try {
            const sessionMail = sessionStorage.getItem('email');
            const mail = state.emailId? state.emailId : sessionMail
            setLoading(true); 
            const combinedAct = await apiUrl.get(`/session-data/${mail}?sessionType=d`);
            takeAction({type: "changeDsCombinedSubActivityData", payload: combinedAct.data.activities});
            takeAction({type:"changeStdsession", payload: combinedAct.data.session});
            tempActivities.current = combinedAct.data.activities;
        } catch (error) {
            //No data to fetch
        } finally {
            setLoading(false); 
        }
    }

    async function alterData1(){
        try {
            const sessionMail = sessionStorage.getItem('email');
            const mail = state.emailId? state.emailId : sessionMail
            setLoading(true); 
            const response = await apiUrl.get(`/session-details/${mail}?sessionType=d`);

            if(response.data.length>0 && response.data[0].session_version=='n' && response.data[0].session_type=='d'){
                const sessions = scheduleSessions(response.data[0].session_start_time, response.data[0].session_end_time, response.data[0].break_time, response.data[0].total_sessions);
                changeSessions(sessions);
            } else {
               //No session data found for the user
            }
        } catch (error) {
            //Cannot set up the day
        } finally {
            setLoading(false); 
        }
    }

    function mapping(object, index){
        return (
            <Session key={`sessionContainer-${index}`} id={index} session={object.session} startTime={object.sessionStart} endTime={object.sessionEnd} breakStartTime={object.breakStart} breakEndTime={object.breakEnd} startTime24Hr={object.sessionStart24Hr} endTime24Hr={object.sessionEnd24Hr} breakStartTime24Hr={object.breakStart24Hr} breakEndTime24Hr={object.breakEnd24Hr} activityNames={object.activityList}></Session>
        )
    }

    useEffect(()=>{
        (async () => {
            await alterData(); 
            await alterData1();
        })();
    }, [state.updateActivity])

    if (loading) {
        return <div className="loadingSpinner"><p className="loadingText" style={{color: state.darkMode? 'white' : 'black'}}>Loading, please wait...</p></div>;
    }

    return <>  
    {todaySessions.length==0 && <div className="scheduleDisclaimer">
     <p className="scheduleContext">No sessions yet. Setup sessions and plan your day!</p>
    </div>}
    <div className="sessionTabsContainer">
    <div className="sessionTabs">
        {todaySessions && todaySessions.length>0 && todaySessions.map(mapping)}
    </div>
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
        <div className="currentActivities">
        <button className="addCurrentActivityButton" onClick={()=>{takeAction({type: "changeStdState"})}}>Setup Sessions</button> </div>
    }
    </>
    }