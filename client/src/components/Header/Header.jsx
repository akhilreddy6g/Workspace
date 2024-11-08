import {useContext} from "react";
import featuresTabHook from "../Noncomponents";
import DateTimeDisplay from "../Sidebar/F1/DateTimeDisplay";
import { Link } from "react-router-dom";

export default function Header(){
  const {state, takeAction} = useContext(featuresTabHook);
    return (<>
    <div className={`mainBackground ${state.darkMode? "mainBackground1" : "mainBackground2"}`}></div>
    <nav className={`navbar navbar-expand-lg bg-body-tertiary ${state.darkMode && "navdarkMode"}`}>
    <div className="container-fluid">
      <img className="logo" id="menulogo" src="client/public/assets/sidebar.svg" alt="Menu logo" onClick={() => {takeAction({type:"changeFthState"});}}/>
      <Link to="/target"><button className="targetContainer"><img className="logo" id="dailyactlogo" src="client/public/assets/target.svg" alt="DAct logo" /></button></Link>
      <div className="title-container" id="titlecontainer">
        <a className="navbar-brand" id="titlelink" href="/">
          <p id="titlename">Workspace</p>
        </a>
      </div>
      <DateTimeDisplay></DateTimeDisplay>
      <img className="logo" id="daymodelogo" src={state.darkMode? "client/public/assets/moon.svg" :"client/public/assets/sun.svg"} onClick={() => {takeAction({type:"changeBgState"});}} alt="Day Mode" />
      <a href="/day-off">
        <img className="logo" id="powerlogo" src="client/public/assets/power.svg" alt="Power logo"/>
      </a>
    </div>
  </nav></>);
}