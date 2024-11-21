import {useContext} from "react";
import featuresTabHook from "../Noncomponents";
import DateTimeDisplay from "../Sidebar/F1/DateTimeDisplay";
import { Link } from "react-router-dom";
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../Noncomponents";

export default function Header(){
  const {state, takeAction} = useContext(featuresTabHook);
  const signOut = useSignOut();
  const navigate = useNavigate();

  async function handleLogout(e){
    e.preventDefault();
    takeAction({ type: "changeCurrentAction", payload: "Logout?"});
    const userResponse = await new Promise((resolve) => {
        takeAction({ type: "changeDisclaimerState", payload: true });
        takeAction({ type: "changeDisclaimerButtons"});
        takeAction({ type: "setResolve", payload: resolve });
      });
    if(userResponse){
        takeAction({type:"changeInitialComponentsState", payload:false});
        await apiUrl.post('/logout');
        sessionStorage.clear();
        signOut(); 
        navigate("/login"); 
    } 
  };

    return (<>
    <div className={`mainBackground ${state.darkMode? "mainBackground1" : "mainBackground2"}`}></div>
    <nav className={`navbar navbar-expand-lg bg-body-tertiary ${state.darkMode && "navdarkMode"}`}>
    <div className="container-fluid">
      <img className="logo" id="menulogo" src="./assets/sidebar.svg" alt="Menu logo" onClick={() => {takeAction({type:"changeFthState"});}}/>
      <Link to="/target"><button className="targetContainer"><img className="logo" id="dailyactlogo" src="./assets/target.svg" alt="DAct logo"/></button></Link>
      <div className="title-container" id="titlecontainer">
        <div className="navbar-brand" id="titlelink">
          <p id="titlename"><a href="/current-schedule" style={{all:"unset", cursor:"pointer"}}>Workspace</a></p>
        </div>
        <DateTimeDisplay></DateTimeDisplay>
      </div>
      <img className="logo" id="daymodelogo" src={state.darkMode? "./assets/moon.svg" :"./assets/sun.svg"} onClick={() => {takeAction({type:"changeBgState"});}} alt="Day Mode" />
      <button type="button" className="logoutButton" style={{all:"unset", width:"fit-content", height:"fit-content"}} onClick={(event)=>{handleLogout(event)}}><img className="logo" id="powerlogo" src="./assets/power.svg" alt="Power logo"/></button>
    </div>
  </nav></>);
}