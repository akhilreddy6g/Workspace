import React, {useContext} from "react";
import { truthHook } from "./App";

export default function Header(){
  const {data,changeData} = useContext(truthHook);
  function toggleData(){
    changeData(!data);
  };
    return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
    <div className="container-fluid">
      <img className="logo" id="menulogo" src="src/assets/menu.png" alt="Menu logo" onClick={toggleData}/>
      <a href="/daily-activities"> <img className="logo" id="dailyactlogo" src="src/assets/daily-activities.png" alt="DAct logo" /></a>
      <div className="title-container" id="titlecontainer">
        <a className="navbar-brand" id="titlelink" href="/"><p id="titlename">TIMEQUEST</p></a>
      </div>
      <a href="/day-off"><img className="logo" id="powerlogo" src="src/assets/white-power.png" alt="Power logo"/></a>
    </div>
  </nav>);
}