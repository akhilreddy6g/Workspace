import featuresTabHook from "../../Noncomponents";
import { useContext, useEffect, useRef, useState } from "react";

export default function Activityframe(props) {
  const { state, takeAction } = useContext(featuresTabHook);
  const [activeTab, setActiveTab] = useState(null);
  const intervalRef = useRef(null);

  const resetButtonStyle = (buttonRef) => {
    if (buttonRef && buttonRef.current) {
      buttonRef.current.style.boxShadow = "none";
      buttonRef.current.style.backgroundColor = "rgb(255,255,144)";
    } else if (buttonRef) {
      buttonRef.style.boxShadow = "none";
      buttonRef.style.backgroundColor = "rgb(255,255,144)";
    }
  };

  function changeIndex(e, count) {
    e.preventDefault();
    resetButtonStyle(state.activityTabButtRef);
    const newIndex = state.csActivityIndex + count;
    if (newIndex >= 0 && newIndex <= state.combinedActivityData.length - 1) {
      const actTab = document.querySelector(`.atab-${newIndex + 1}`);
      takeAction({ type: "changeCsActivityIndex", payload: count, button: actTab });
      if (actTab) {
        actTab.style.boxShadow = "0 0 7px black";
        actTab.style.backgroundColor = "#b1c7b3";
        actTab.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "start"
          });
      }
    }
  }

  function closestTimeTab(tabs) {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes(); 
    var closestTab = null;
    var closestTimeDiff = Infinity;
    tabs.forEach((tab, index) => {
      const [startHours, startMinutes] = tab.activity_start_time?.split(":").map(Number) || [0, 0];
      const [endHours, endMinutes] = tab.activity_end_time?.split(":").map(Number) || [0, 0];
      const tabStartTime = startHours * 60 + startMinutes;
      const tabEndTime = endHours * 60 + endMinutes;
      const timeDiff = currentTime - tabStartTime;
      if (timeDiff >= 0 && timeDiff < closestTimeDiff && currentTime<tabEndTime) {
        closestTab = index;
        closestTimeDiff = timeDiff;
      };
    });
    if(activeTab!=closestTab){
        const prevTab = document.querySelector(`.atab-${activeTab + 1}`)
        if (prevTab) {
        prevTab.style.boxShadow = "none";
        prevTab.style.backgroundImage = "none";
        prevTab.style.color = "black"}
    }
    if(state.csActivityIndex!=closestTab && state.activeTab!=closestTab){
        takeAction({type:"changeActiveTab", payload:closestTab});
        takeAction({type:"changeActTabButtRef", payload:closestTab});
    };
    console.log("closest tab", closestTab);
    return closestTab;
  }

  const highlightClosestTab = () => {
    const curclosestTab = closestTimeTab(state.combinedActivityData);
    console.log("closesetab", curclosestTab);
    setActiveTab(curclosestTab);
    return curclosestTab;
  };

  useEffect(() => {
    console.log("useEffect running")
    const closest = highlightClosestTab();
    console.log("closeset tba inside ue", closest);
    if(closest==null){
        console.log("no activities scheduled currently");
    } else{
        const actTab = document.querySelector(`.atab-${closest + 1}`);
        if (actTab && activeTab==state.csActivityIndex) {
        actTab.style.boxShadow = "0 0 7px black";
        actTab.style.backgroundImage = "linear-gradient(to right ,rgb(42, 42, 243), rgba(144, 10, 144, 0.925))";
        actTab.style.color = "white"
        actTab.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "start"
            });
        };
    }
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(highlightClosestTab, 15000);
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [activeTab, state.combinedActivityData]);
      
    return (<> <button className="prevActivity" style={{position:"fixed", top:"55vh", left: state.fthState? "15vw": "8vw", height:"50px", width:"23px", transition:"150ms linear"}} onClick={(e)=>{changeIndex(e, -1)}} disabled={state.csActivityIndex==0} >{"<"}</button>
        <div className={`activityFrame ${state.fthState? "scheduleDisclaimer1" : "scheduleDisclaimer2"} ${state.darkMode? "scheduleDark" :"scheduleNormal"}`} id={props.id}>
            <div className={`activityTitle  ${state.darkMode? "activityFrameDark" : "activityFrameNormal"}`} style={{borderTop:"0"}}>{state.csActivityIndex+1}. {props.activity}</div>
            <div className="csButtonsContainer">
            <button className={`csButtons ${state.darkMode? "soloActivityBarDark" : "soloActivityBarNormal"}`} style={{backgroundColor:"red"}}>Skip</button>
            <button className={`csButtons ${state.darkMode? "soloActivityBarDark" : "soloActivityBarNormal"}`} style={{backgroundColor:"green"}}>Complete</button>
            <button className={`csButtons ${state.darkMode? "soloActivityBarDark" : "soloActivityBarNormal"}`} style={{backgroundColor:"orange"}}>Update</button>
            <button className={`csButtons ${state.darkMode? "soloActivityBarDark" : "soloActivityBarNormal"}`} style={{backgroundColor:"orange"}}>Delete</button>
            <button className={`csButtons ${state.darkMode? "soloActivityBarDark" : "soloActivityBarNormal"}`} style={{backgroundColor:"teal"}}>Notes</button>
            <button className={`csButtons ${state.darkMode? "soloActivityBarDark" : "soloActivityBarNormal"}`} style={{backgroundColor:"teal"}}>Upload</button>
            </div>
            <div className={`activityDescription  ${state.darkMode? "soloActivityBarDark" : "soloActivityBarNormal"}`} style={{position:"absolute", top:"38vh", left:"69vw", width:"10vw", height:"23vh", overflow:"scroll", textAlign:"start", borderRadius:"10px"}}>
                <div className={`activityDescrHeading`} style={{borderBottom: state.darkMode? "0.2px solid white": "0.2px solid black", display:"flex", justifyContent:"center", flexGrow:"1"}}>Description</div>
                <p className="notes" style={{padding:"5px"}}>{props.notes}</p></div>
        </div> <button className="nextActivity" style={{position:"fixed", top:"55vh", left: state.fthState? "97.5vw": "90.5vw", height:"50px", width:"23px", transition:"150ms linear"}} onClick={(e)=>{changeIndex(e, +1)}} disabled={state.csActivityIndex==state.combinedActivityData.length-1}>{">"}</button>
        </>
    )
};