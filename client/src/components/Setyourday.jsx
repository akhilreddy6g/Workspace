import React,{useContext} from "react";
import { featuresTabHook } from "./App";
import Sessionsetup from "./Sessionsetup";

export default function Setyourday(){
    const {state, takeAction} = useContext(featuresTabHook);
     return state.stdState &&
     <div className="overLay">
        <div className="setDay">
            <div className="toolBar">
                <p className="setDayContext" style={{fontFamily:"Cambria, Cochin, Georgia, Times, 'Times New Roman', serif",paddingTop:"5px"}}>Session Setup</p>
                <button className="closeSetDayButton" onClick={() => {takeAction({type:"changeStdState"})}}>x</button>
            </div>
            <Sessionsetup></Sessionsetup>
        </div>
    </div>
    }