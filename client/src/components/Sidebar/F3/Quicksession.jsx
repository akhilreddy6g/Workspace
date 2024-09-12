import {useContext} from "react";
import featuresTabHook from "../../Noncomponents";
import Quicksessionsetup from "./Quicksessionsetup";

export default function Quicksession(){
    const {state, takeAction} = useContext(featuresTabHook);
     return state.qastate &&
     <div className="overLay">
        <div className={`setQuickSess ${state.darkMode && "setQuickSess1"}`}>
            <div className={`toolBar ${state.darkMode && "toolBar1"}`}>
                <p className="setDayContext setQuickSessContext">Setup Quick Session</p>
                <button className="closeSetDayButton" onClick={() => {takeAction({type:"changeQuickSessState"});}}>x</button>
            </div>
            <Quicksessionsetup></Quicksessionsetup>
        </div>
    </div>
    }