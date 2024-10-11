import axios from "axios";
import featuresTabHook from "../../Noncomponents";
import { useContext, useEffect, useRef, useState } from "react";

export default function Activityframe(props) {
  const { state, takeAction } = useContext(featuresTabHook);
  const intervalRef = useRef(null);
  const skipRef = useRef(null);
  const completeRef = useRef(null);
  var minDiff = Infinity;
  var minIndex = null;

  function alertMessage(message){
    takeAction({type:"changeFailedAction", payload:message});
    setTimeout(() => {
        takeAction({type:"changeFailedAction"});
    }, 3500);
  }

  function changeIndex(e, count) {
    e.preventDefault();
    const newIndex = state.csActivityIndex + count;
    if (newIndex >= 0 && newIndex <= state.combinedActivityData.length - 1) {
      takeAction({ type: "changeCsActivityIndex", payload: count});
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
      const absDiff = Math.abs(timeDiff);
      if(absDiff<minDiff && state.activeTab===null && minIndex!=index){
        minIndex = index;
        var nextIndex = index+1
        minDiff = absDiff;
      };
      if (timeDiff >= 0 && timeDiff < closestTimeDiff && currentTime<tabEndTime) {
        closestTab = index;
        closestTimeDiff = timeDiff;
      };
    });
    if(state.activeTab!=closestTab){
      takeAction({type:"changeActiveTab", payload:closestTab});
      if(closestTab!=null){
        takeAction({type:"changeActTabButtRef", payload:closestTab});
      } else {
        takeAction({type:"changeActTabButtRef", payload:state.csActivityIndex+1});
      }
    };
    return closestTab;
  }

  const highlightClosestTab = () => {
    const curclosestTab = closestTimeTab(state.combinedActivityData);
    return curclosestTab;
  };

  async function updateActivityStatus(event, id, type, status, newStatus, actionType) {
    event.preventDefault();
    takeAction({ type: "changeCurrentAction", payload: actionType + ` the activity`});
    if ((actionType === "skip" && (status === null)) || 
        (actionType === "complete" && status !== 1)) {
        try {
            const data = { actId: id, actStatus: newStatus };
            const prevState = sessionStorage.getItem(id);
            if (prevState === null || prevState && JSON.parse(prevState).action !=="complete") {
                const userResponse = await new Promise((resolve) => {
                  takeAction({ type: "changeDisclaimerState", payload: true });
                  takeAction({ type: "changeDisclaimerButtons"});
                  takeAction({ type: "setResolve", payload: resolve });
                });
                if (userResponse){
                    const url = type === "c" ? "http://localhost:3000/update-ca-status" : "http://localhost:3000/update-da-status";
                    await axios.post(url, { data });
                    alertMessage(`Successfully ${actionType=="skip"? "skipped" : "completed"} the activity`);
                    sessionStorage.setItem(id, JSON.stringify({ action: actionType, value: true }));
                    if (completeRef.current && actionType === "complete") {
                        completeRef.current.disabled = true;
                    };
                    if (skipRef.current) {
                        skipRef.current.disabled = true;
                    };
                    if(state.csActivityIndex+1<state.combinedActivityData.length){
                      changeIndex(event, 1);
                    } else {
                      takeAction({type:"changeActTabButtRef", payload:0});
                    };
                } else {
                  console.log("Action cancelled by the user");
                };
            } else {
                const { action, value } = JSON.parse(prevState);
                if (action === actionType && value === true) {
                    console.log("Cannot update the status of the activity");
                    alertMessage("Status Updated Already");
                };
            };
        } catch (error) {
            console.log(`Unable to ${actionType} the Activity: ${error}`);
        };
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

  async function deleteActivity(event, id, type) {
    event.preventDefault();
    document.body.style.overflow = "hidden";
    takeAction({ type: "changeCurrentAction", payload: "delete the activity"});
    const userResponse = await new Promise((resolve) => {
      takeAction({ type: "changeDisclaimerState", payload: true });
      takeAction({ type: "changeDisclaimerButtons" });
      takeAction({ type: "setResolve", payload: resolve });
    });
    document.body.style.overflow = "auto";
    if (userResponse) {
      try {
        const url = type === "c" ? `http://localhost:3000/delete-current-activity/${id}` : `http://localhost:3000/delete-activity/${id}`
        await axios.delete(url);
        alertMessage("Successfully deleted the activity");
        takeAction({ type: "changeActivityState", payload: false});
      } catch (error) {
        console.error("Something went wrong", error);
        alertMessage("Unable to delete the activity");
      };
    } else {
      console.log("Action canceled by the user.");
    };
  };

  useEffect(() => {
    const closest = highlightClosestTab();
    if(closest==null){
      console.log("No activities scheduled currently");
    } else{
      console.log("Index of current activity: ", state.activeTab);
    };
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(highlightClosestTab, 15000);
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [state.activeTab, state.combinedActivityData]);
      


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
          <button className={`csButtons ${state.darkMode? "soloActivityBarDark" : "soloActivityBarNormal"}`} style={{backgroundColor:"orange"}} onClick={(event)=>{deleteActivity(event, props.id, props.type)}}>Delete</button>
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