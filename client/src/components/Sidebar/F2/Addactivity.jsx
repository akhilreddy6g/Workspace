import { useContext } from "react";
import featuresTabHook from "../../Noncomponents";
import Activitysetup from "./Activitysetup";

export default function Addactivity(){
    const {state, takeAction} = useContext(featuresTabHook);
    return <>
    <div className="addActivityBar" style={{left: state.fthState? "17vw":"10vw", marginBottom: "3vh"}}>
    <Activitysetup></Activitysetup>
    </div>
    </>
}