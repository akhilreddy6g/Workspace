import React from "react";

export function Userprofile(props){
    return (<div name={props.elementName} className={props.title}><img src={props.src} id="profilepic" className="userPic" alt="Profile Picture" /></div>);
}