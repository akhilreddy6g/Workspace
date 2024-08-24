import {useContext} from "react";
import featuresTabHook from "./Noncomponents";

export default function CurrentSchedule(){
    const {state} = useContext(featuresTabHook);
    // <div className="schedule"><p className="scheduleContext">Showing the schedule</p></div>
    return state.schedulestate ? <div className="scheduleDisclaimer" style={{left: state.fthState? "17vw":"10vw"}}><p className="scheduleContext">No schedule to show, to view schedule, set your daily activities</p></div> : <p>New schedule</p>;
};