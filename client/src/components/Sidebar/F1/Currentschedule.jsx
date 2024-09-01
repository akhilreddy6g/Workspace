import {useContext} from "react";
import featuresTabHook from "../../Noncomponents";

export default function CurrentSchedule(){
    const {state} = useContext(featuresTabHook);
    return state.zeroActivity? <div className="scheduleDisclaimer" style={{left: state.fthState? "17vw":"10vw"}}><p className="scheduleContext">No schedule to show, to view schedule, set your daily activities</p></div> : <div className="scheduleDisclaimer" style={{left: state.fthState? "17vw":"10vw"}}>Schedule</div>;
};