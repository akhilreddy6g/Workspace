import {useContext} from "react";
import featuresTabHook from "./Noncomponents";
import Sessionsetup from "./Sessionsetup";

export default function Setyourday(){
    const {state, takeAction} = useContext(featuresTabHook);
     return state.stdState &&
     <div className="overLay">
        <div className="setDay" style={{backgroundColor: state.darkMode && "rgb(48,48,48)"}}>
            <div className="toolBar" style={{backgroundColor: state.darkMode && "rgb(48,48,48)"}}>
                <p className="setDayContext" style={{fontFamily:"Cambria, Cochin, Georgia, Times, 'Times New Roman', serif",paddingTop:"5px"}}>Setup Sessions</p>
                <button className="closeSetDayButton" onClick={() => {takeAction({type:"changeStdState"})}}>x</button>
            </div>
            <Sessionsetup></Sessionsetup>
        </div>
    </div>
    }