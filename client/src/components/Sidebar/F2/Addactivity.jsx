import { useContext } from "react";
import featuresTabHook from "../../Noncomponents";
import Activitysetup from "./Activitysetup";

export default function Addactivity(){
    const {state, takeAction} = useContext(featuresTabHook);
    return <>
    <div className={`scrollHideBottom ${state.fthState? "scrollHideBottom1" : "scrollHideBottom2" } ${state.darkMode? "scrollHideBottomDark" : "scrollHideBottomNormal"}`}></div>
    <div className={`addActivityBar ${state.fthState? "addActivityBar1" : "addActivityBar2"}`}>
    <Activitysetup></Activitysetup>
    </div>
    </>
}