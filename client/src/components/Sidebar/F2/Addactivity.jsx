import { useContext } from "react";
import featuresTabHook from "../../Noncomponents";

export default function Addactivity(){
    const {state, takeAction} = useContext(featuresTabHook);
    return state.dailyactstate && 
    <div className="addActivity" style={{left: state.fthState? "17vw":"10vw"}} onClick={takeAction("")}>
        +
    </div>
}