import axios from "axios";
import featuresTabHook from "../../Noncomponents";
import { useContext, useEffect, useRef, useState } from "react";

export default function Activityframe(props) {
  const { state, takeAction } = useContext(featuresTabHook);
  const [activeTab, setActiveTab] = useState(null);
  const intervalRef = useRef(null);
  const skipRef = useRef(null);
  const completeRef = useRef(null);

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
      };
    };
  };

  function resetButtonStyle(buttonRef){
    if (buttonRef && buttonRef.current) {
      buttonRef.current.style.boxShadow = "none";
      buttonRef.current.style.backgroundColor = "rgb(255,255,144)";
    } else if (buttonRef) {
      buttonRef.style.boxShadow = "none";
      buttonRef.style.backgroundColor = "rgb(255,255,144)";
    };
  };

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
        const prevTab = document.querySelector(`.atab-${activeTab + 1}`);
        if (prevTab) {
          prevTab.style.boxShadow = "none";
          prevTab.style.backgroundImage = "none";
          prevTab.style.color = "black"
        };
    }
    if(state.csActivityIndex!=closestTab && state.activeTab!=closestTab){
        takeAction({type:"changeActiveTab", payload:closestTab});
        takeAction({type:"changeActTabButtRef", payload:closestTab});
    };
    return closestTab;
  }

  const highlightClosestTab = () => {
    const curclosestTab = closestTimeTab(state.combinedActivityData);
    setActiveTab(curclosestTab);
    return curclosestTab;
  };

  async function updateActivityStatus(event, id, type, status, newStatus, actionType) {
    event.preventDefault();
    if ((actionType === "skip" && (status === null)) || 
        (actionType === "complete" && status !== 1)) {
        try {
            const data = { actId: id, actStatus: newStatus };
            const prevState = sessionStorage.getItem(id);
            if (prevState == null || prevState && JSON.parse(prevState).action !=="complete") {
                const url = type === "c" ? "http://localhost:3000/update-ca-status" : "http://localhost:3000/update-da-status";
                await axios.post(url, { data });
                sessionStorage.setItem(id, JSON.stringify({ action: actionType, value: true }));
                if (completeRef.current && actionType === "complete") {
                    completeRef.current.disabled = true;
                }
                if (skipRef.current) {
                    skipRef.current.disabled = true;
                }
                changeIndex(event, 1);
            } else {
                const { action, value } = JSON.parse(prevState);
                if (action === actionType && value === true) {
                    console.log("Cannot update the status of the activity");
                }
            }
        } catch (error) {
            console.log(`Unable to ${actionType} the Activity`);
        }
    } else {
        console.log("Status already Updated");
    }
  }

  async function skipActivity(event, id, type, status) {
      await updateActivityStatus(event, id, type, status, 0, "skip");
  }

  async function completeActivity(event, id, type, status) {
      await updateActivityStatus(event, id, type, status, 1, "complete");
  }

  useEffect(() => {
    const closest = highlightClosestTab();
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
    };
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(highlightClosestTab, 15000);
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [activeTab, state.combinedActivityData]);
      
  return (<> <button className="prevActivity" style={{left: state.fthState? "15vw": "8vw"}} onClick={(e)=>{changeIndex(e, -1)}} disabled={state.csActivityIndex==0} >{"<"}</button>
      <div className={`activityFrame ${state.fthState? "scheduleDisclaimer1" : "scheduleDisclaimer2"} ${state.darkMode? "scheduleDark" :"scheduleNormal"}`} id={props.id}>
          <div className={`activityTitle  ${state.darkMode? "activityFrameDark" : "activityFrameNormal"}`} style={{borderTop:"0"}}>{state.csActivityIndex+1}. {props.activity}</div>
          <div className="csButtonsContainer">
          <button className={`csButtons ${state.darkMode? "soloActivityBarDark" : "soloActivityBarNormal"}`} 
            onClick={(e)=>{skipActivity(e, props.id, props.type, props.status)}} 
            disabled={props.status==0 || props.status ==1 || sessionStorage.getItem(props.id)!==null && (JSON.parse(sessionStorage.getItem(props.id)).action=="skip" ||  JSON.parse(sessionStorage.getItem(props.id)).action=="complete")} 
            ref={skipRef} 
            style={{backgroundColor:"red"}}>
              Skip
          </button>
          <button className={`csButtons ${state.darkMode? "soloActivityBarDark" : "soloActivityBarNormal"}`} 
            onClick={(e)=>{completeActivity(e, props.id, props.type, props.status)}} 
            disabled={props.status==1 || sessionStorage.getItem(props.id) && JSON.parse(sessionStorage.getItem(props.id)).action=="complete"} 
            ref={completeRef} 
            style={{backgroundColor:"green"}}>
            Complete
          </button>
          <button className={`csButtons ${state.darkMode? "soloActivityBarDark" : "soloActivityBarNormal"}`} style={{backgroundColor:"orange"}}>Update</button>
          <button className={`csButtons ${state.darkMode? "soloActivityBarDark" : "soloActivityBarNormal"}`} style={{backgroundColor:"orange"}}>Delete</button>
          <button className={`csButtons ${state.darkMode? "soloActivityBarDark" : "soloActivityBarNormal"}`} style={{backgroundColor:"teal"}}>Notes</button>
          <button className={`csButtons ${state.darkMode? "soloActivityBarDark" : "soloActivityBarNormal"}`} style={{backgroundColor:"teal"}}>Upload</button>
          </div>
          <div className={`activityDescription  ${state.darkMode? "soloActivityBarDark" : "soloActivityBarNormal"}`}>
              <div className={`activityDescrHeading`} style={{borderBottom: state.darkMode? "0.2px solid white": "0.2px solid black"}}>Description</div>
              <p className="notes">{props.notes}</p></div>
      </div> <button className="nextActivity" style={{left: state.fthState? "97.5vw": "90.5vw"}} onClick={(e)=>{changeIndex(e, 1)}} disabled={state.csActivityIndex==state.combinedActivityData.length-1}>{">"}</button>
      </>
  )
};