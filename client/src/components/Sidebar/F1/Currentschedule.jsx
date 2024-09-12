import {useContext} from "react";
import featuresTabHook from "../../Noncomponents";

export default function CurrentSchedule(){
    const {state} = useContext(featuresTabHook);
    return state.activityData.length<1? <div className={`scheduleDisclaimer ${state.fthState? "scheduleDisclaimer1" : "scheduleDisclaimer2"}`}><p className="scheduleContext">No schedule to show, to view schedule, set your daily activities</p></div> : <div className={`scheduleDisclaimer ${state.fthState? "scheduleDisclaimer1" : "scheduleDisclaimer2"}`}><p className="scheduleContext">Schedule</p></div>;
};