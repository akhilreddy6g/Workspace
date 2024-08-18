import React, {useContext} from "react";
import { featuresTabHook } from "./App";

export default function Feature(props){
    const {state, takeAction, changeStateInfo} = useContext(featuresTabHook);
    return (<div name={props.featureName} id={"feature"+props.id} className="feature" onClick={() => {
        console.log("inside"); 
        if(props.show==='sd'){
            takeAction({type:"changeStdState"});
    }
}}><p className="featureTitle">{props.title}</p></div>);
}