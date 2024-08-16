import React from "react";

export default function Feature(props){
    return (<div name={props.featureName} id={"feature"+props.id} className="feature"><p className="featureTitle">{props.title} </p></div>);
}