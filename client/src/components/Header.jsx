import React, {useContext} from "react";
import { featuresTabHook } from "./App";

export default function Header(){
  const {state, takeAction, changeStateInfo} = useContext(featuresTabHook);
    return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
    <div className="container-fluid">
      <img className="logo" id="menulogo" src="src/assets/menu.png" alt="Menu logo" onClick={() => {
        takeAction({type:"changeFthState"})
      }}/>
      <a href="/daily-activities"> <img className="logo" id="dailyactlogo" src="src/assets/daily-activities.png" alt="DAct logo" /></a>
      <div className="title-container" id="titlecontainer">
        <a className="navbar-brand" id="titlelink" href="/"><p id="titlename">Workspace</p></a>
      </div>
      <a href="/day-off"><img className="logo" id="powerlogo" src="src/assets/white-power.png" alt="Power logo"/></a>
    </div>
  </nav>);
}