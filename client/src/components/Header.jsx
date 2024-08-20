import React, {useContext, useEffect} from "react";
import { featuresTabHook } from "./App";

export default function Header(){
  const {state, takeAction} = useContext(featuresTabHook);

  useEffect (() => {
    document.body.style.backgroundColor = state.darkMode? "rgb(48,48,48)": "white";
    const navbars = document.querySelectorAll(".navbar");
    const background = document.querySelectorAll(".background");
    document.querySelector("#profilepic").setAttribute("src", state.darkMode ? "src/assets/white-user.svg" : "src/assets/user.svg");
    document.querySelector(".userPic").style.border = state.darkMode ? "1px solid grey" : "1px solid black" ;
    for (let i = 0; i < navbars.length; i++) {
      console.log("nv",navbars[i]);
      navbars[i].style.borderBottom = state.darkMode ? "1px solid grey" : "0";
      navbars[i].style.backgroundColor = state.darkMode ? "rgb(48,48,48)" : "grey";
      navbars[i].style.color = state.darkMode ? "white" : "black";
    }
    for (let i = 0; i < background.length; i++) {
      console.log("nv",background[i]);
      background[i].style.borderRight = state.darkMode ? "1px solid grey" : "0";
      background[i].style.backgroundColor = state.darkMode ? "rgb(48,48,48)" : "rgb(207,206,206)";
      background[i].style.color = state.darkMode ? "white" : "black";
    }
  },[state.darkMode]);

    return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
    <div className="container-fluid">
      <img className="logo" id="menulogo" src="src/assets/sidebar.svg" alt="Menu logo" onClick={() => {
        takeAction({type:"changeFthState"})
      }}/>
      <a href="/daily-activities"> <img className="logo" id="dailyactlogo" src="src/assets/target.svg" alt="DAct logo" /></a>
      <div className="title-container" id="titlecontainer">
        <a className="navbar-brand" id="titlelink" href="/"><p id="titlename">Workspace</p></a>
      </div>
      <img className="logo" id="daymodelogo" src={state.darkMode? "src/assets/moon.svg" :"src/assets/sun.svg"} onClick={() => {
        takeAction({type:"changeBgState"})
      }} alt="Day Mode" />
      <a href="/day-off"><img className="logo" id="powerlogo" src="src/assets/power.svg" alt="Power logo"/></a>
    </div>
  </nav>);
}