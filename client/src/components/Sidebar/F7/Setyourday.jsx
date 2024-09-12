import {useContext} from "react";
import featuresTabHook from "../../Noncomponents";
import Sessionsetup from "./Sessionsetup";

export default function Setyourday(){
    const {state, takeAction} = useContext(featuresTabHook);
     return state.stdState &&
     <div className="overLay">
        <div className={`setDay ${state.darkMode ? "setDay1" : "setDay2"}`}>
            <div className={`toolBar ${state.darkMode && "toolBar1"}`}>
                <p className="setDayContext">Setup Sessions</p>
                <button className="closeSetDayButton" onClick={() => {takeAction({type:"changeStdState"})}}>x</button>
            </div>
            <Sessionsetup></Sessionsetup>
        </div>
    </div>
    }