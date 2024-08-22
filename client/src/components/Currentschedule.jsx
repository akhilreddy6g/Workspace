import {useContext} from "react";
import featuresTabHook from "./Noncomponents";

export default function CurrentSchedule(){
    const {state} = useContext(featuresTabHook);
    // <div className="schedule"><p className="scheduleContext">Showing the schedule</p></div>
    return state.schedulestate ? <div className="scheduleDisclaimer"><p className="scheduleContext">No schedule to show, to view schedule, set daily activities</p></div> : <p>New schedule</p>;
};