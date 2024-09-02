import { useContext } from "react";
import featuresTabHook from "../../Noncomponents";
import Activitysetup from "./Activitysetup";

export default function Addactivity(){
    const {state, takeAction} = useContext(featuresTabHook);
    return <>
    <div className="scrollHideBottom" style={{left: state.fthState? "16vw" : "9vw", backgroundColor: state.darkMode? "rgb(48,48,48)" : "white"}}></div>
    <div className="addActivityBar" style={{left: state.fthState? "17vw":"10vw", marginBottom: "3vh"}}>
    <Activitysetup></Activitysetup>
    </div>
    </>
}