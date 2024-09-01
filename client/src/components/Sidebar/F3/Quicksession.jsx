import {useContext} from "react";
import featuresTabHook from "../../Noncomponents";
import Quicksessionsetup from "./Quicksessionsetup";

export default function Quicksession(){
    const {state, takeAction} = useContext(featuresTabHook);
     return state.qastate &&
     <div className="overLay">
        <div className="setQuickSess" style={{backgroundColor: state.darkMode && "rgb(48,48,48)"}}>
            <div className="toolBar" style={{backgroundColor: state.darkMode && "rgb(48,48,48)"}}>
                <p className="setDayContext setQuickSessContext" style={{fontFamily:"Cambria, Cochin, Georgia, Times, 'Times New Roman', serif",paddingTop:"5px"}}>Setup Quick Session</p>
                <button className="closeSetDayButton" onClick={() => {takeAction({type:"changeQuickSessState"});}}>x</button>
            </div>
            <Quicksessionsetup></Quicksessionsetup>
        </div>
    </div>
    }