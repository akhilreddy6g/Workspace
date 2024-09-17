import featuresTabHook from "../../Noncomponents";
import { useContext } from "react";

export default function Activityframe(){
    const {state} = useContext(featuresTabHook);
    return (
        <div className={`activityFrame ${state.fthState? "scheduleDisclaimer1" : "scheduleDisclaimer2"}  ${state.darkMode? "soloActivityBarDark" :"soloActivityBarNormal"}`}>
        </div>
    )
}