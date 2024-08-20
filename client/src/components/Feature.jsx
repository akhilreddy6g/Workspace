import React, {useContext} from "react";
import { featuresTabHook } from "./App";

export default function Feature(props){
    const {state, takeAction} = useContext(featuresTabHook);
    return (<div name={props.featureName} id={"feature"+props.id} className="feature" onClick={() => {
        if(props.show==='sd'){
            takeAction({type:"changeStdState"});
    }
}}><p className="featureTitle">{props.title}</p></div>);
}