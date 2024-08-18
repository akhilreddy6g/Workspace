import React,{useContext} from "react";
import { featuresTabHook } from "./App";

export default function Setday(){
    const {state, takeAction, changeStateInfo} = useContext(featuresTabHook);
     return state.stdState && <><div className="overLay"><div className="setDay"><div className="toolBar"><p className="setDayContext" style={{fontFamily:"Cambria, Cochin, Georgia, Times, 'Times New Roman', serif",paddingTop:"5px"}}>Session Setup</p><button className="closeSetDayButton" onClick={() => {takeAction({type:"changeStdState"})}}>x</button></div></div></div>
</>}