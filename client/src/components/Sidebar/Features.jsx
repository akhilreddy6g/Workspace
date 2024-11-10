import {useContext} from "react";
import { useNavigate } from "react-router-dom";
import Feature from "./Feature";
import featuresTabHook from "../Noncomponents";
import Userprofile from "./Userprofile";
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import { apiUrl } from "../Noncomponents";

export default function Features(){
    let {state, takeAction} = useContext(featuresTabHook);
    const signOut = useSignOut();
    const navigate = useNavigate();

    function alertMessage(message){
        takeAction({type:"changeFailedAction", payload:message});
        setTimeout(() => {
            takeAction({type:"changeFailedAction"});
        }, 3500);
      };

    async function handleLogout(e){
        e.preventDefault();
        takeAction({ type: "changeCurrentAction", payload: "logout?"});
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
        } else {
            console.log("Logout Cancelled by the User")
        }
    };
    return (<div className={`featureContainer ${state.fthState? "featureContainer1" : "featureContainer2"}`}>
        <div className={`background ${state.darkMode && "backgdarkMode"}`}>
    <Userprofile id="0" title="userPicture" src="src/assets/user.svg"></Userprofile>
    <Feature id="1" featureName="currentSchedule" title="Current Schedule" show="cs" path="/current-schedule"></Feature>
    <Feature id="2" featureName="dailyActivities" title="Daily Activities" show="da" path="/daily-activities"></Feature>
    <Feature id="3" featureName="quickActivitySession" title="Quick Session" show="qa" path="/quick-session"></Feature>
    <Feature id="4" featureName="trendsNProgress" title="Trends & Progress" show="tnp" path="/trends-and-progress"></Feature>
    <Feature id="5" featureName="missedActivities" title="Missed Activities" show="ma" path="/missed-activities"></Feature>
    <Feature id="6" featureName="planAhead" title="Plan Ahead" show="pa" path="/plan-ahead"></Feature>
    <Feature id="7" featureName="setYourDay" title="Set Your Day" show="syd" path="/set-your-day"></Feature></div>
    <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
    <button className="submitActivity" onClick={(event)=>{handleLogout(event)}} style={{width:"100px", height:"30px", fontSize:"16px", position:"fixed", top:"90vh"}}>Log Out</button>
    </div>
    </div>);
}