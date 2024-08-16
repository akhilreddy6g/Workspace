import React from "react";

export function Navigate(props){
    return (<div name={props.elementName} id={"navigate"} className="navigate"><img src={props.src} className="navlogo" alt="special" /><p className="navigateTitle">{props.title}</p></div>);
}