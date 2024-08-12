import React from "react";

export default function Header(){
    return <nav className="navbar navbar-expand-lg bg-body-tertiary">
    <div className="container-fluid">
        <img className="logo" id="menulogo" src="src/assets/menu.png" alt="Menu logo" />
        <img className="logo" id="timelogo" src="src/assets/time-logo.png" alt="App logo" />
        <div className="title-container" id="titlecontainer">
        <a className="navbar-brand" id="titlelink" href="/"><p id="titlename">TIMEQUEST</p></a>
        </div>
    </div>
  </nav>;
}