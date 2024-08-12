import React from "react";

export default function Header(){
    return <nav className="navbar navbar-expand-lg bg-body-tertiary">
    <div className="container-fluid">
        <a href="/review"><img className="logo" id="menulogo" src="src/assets/menu-logo.png" alt="Menu logo" /></a>
        <a href="/daily-activities"> <img className="logo" id="dailyactlogo" src="src/assets/daily-activities-logo.png" alt="DAct logo" /></a>
        <div className="title-container" id="titlecontainer">
        <a className="navbar-brand" id="titlelink" href="/"><p id="titlename">TIMEQUEST</p></a>
        </div>
    </div>
  </nav>;
}