import Disclaimer from "./Disclaimer";
import featuresTabHook from "./Noncomponents";
import { useContext } from "react";

export default function Failedaction(){
    const {state, takeAction} = useContext(featuresTabHook);
    return (<div className={`actionContainer ${state.failedAction && "actionContainer1"}`}>
        {state.failedAction && <div className={`failedAction`}>{state.failedActionMessage}</div>}
        </div>
    )
}