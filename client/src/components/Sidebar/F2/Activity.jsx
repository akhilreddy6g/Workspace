import featuresTabHook from "../../Noncomponents";
import {useContext, useState} from "react";
import axios from "axios";

export default function Activity(props){
    const {state, takeAction} = useContext(featuresTabHook);

    async function editActivity(event, id){
      event.preventDefault();
      const navbar = document.querySelectorAll(".navbar");
      const activity = document.getElementById(`activity ${id}`);
      const editButton = activity.querySelector("#editButton");
      const editImage = activity.querySelector("#editButton img");
      const dailyActivity = document.querySelectorAll(".dailyActivity");
      const activityContainer = document.querySelectorAll(".activityContainer");
      const soloActivityBar = document.querySelectorAll(".soloActivityBar");
      const scrollHideBottom = document.querySelectorAll(".scrollHideBottom");
      const scrollHide = document.querySelectorAll(".scrollHide");
      const addActivityBar = document.querySelectorAll(".addActivityBar");
      takeAction({type:"changeEditActivityState"})
      if(!state.editActivity){
          activity.style.backgroundColor = state.darkMode? "rgb(48, 48, 48)": "white";
          document.querySelector(".overLayInitial").classList.add("changeOverLay");
          document.body.style.overflow = "hidden";
          navbar.forEach(element => {element.style.zIndex = 5;});
          activityContainer.forEach(element => {element.style.zIndex = "auto";});
          scrollHide.forEach(element => {element.style.zIndex = 5;});
          dailyActivity.forEach(element => {element.style.zIndex = 6;});
          soloActivityBar.forEach(element => {
              if(element.id!=`activity ${id}`){
                element.style.zIndex = 3;
              } else{
                element.style.zIndex = 6;
                element.style.backgroundImage = "linear-gradient(to right ,rgb(42, 42, 243), rgba(144, 10, 144, 0.925))"
              };
          });         
          scrollHideBottom.forEach(element => {element.style.zIndex = 5;});
          addActivityBar.forEach(element => {element.style.zIndex = 4;});
          
          activity.querySelector("#actName").contentEditable = "true";
          activity.querySelector("#actStart").contentEditable = "true";
          activity.querySelector("#actEnd").contentEditable = "true";
          activity.querySelector("#actPriority").contentEditable = "true";

          editImage.src = "src/assets/ok.svg";
          editButton.style.backgroundColor = "orange";
      } else {
          activity.style.backgroundColor = "rgb(255, 255, 255, 0)";
          document.querySelector(".overLayInitial").classList.remove("changeOverLay");
          document.body.style.overflow = "auto";
          navbar.forEach(element => {element.style.zIndex = "auto";});
          activityContainer.forEach(element => {element.style.zIndex = -1;});
          dailyActivity.forEach(element => {element.style.zIndex = "auto";});
          soloActivityBar.forEach(element => {
            if(element.id==`activity ${id}`){
              element.style.backgroundImage = "none";
            }
            element.style.zIndex = "auto";
          });
          const actualActivity = (await axios.get(`http://localhost:3000/activity/${id}`)).data[0];
          const actName = activity.querySelector("#actName").textContent.trim();
          const actStart = activity.querySelector("#actStart").textContent.trim();
          const actEnd = activity.querySelector("#actEnd").textContent.trim();
          const actPriority = activity.querySelector("#actPriority").textContent.trim();
          scrollHideBottom.forEach(element => {element.style.zIndex = "auto";});
          scrollHide.forEach(element => {element.style.zIndex = "auto";});
          addActivityBar.forEach(element => {element.style.zIndex = "auto";});
          const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
          if( (actName!==actualActivity.activity_name || actStart!==actualActivity.activity_start_time || actEnd!==actualActivity.activity_end_time || actPriority!=actualActivity.activity_priority) && actName.length>0 && timeRegex.test(actStart) && timeRegex.test(actEnd) && !isNaN(actPriority) && actPriority.trim() !== ''){
            var correctedPriority = actPriority;
            var correctedActName = actName.slice(0, 50);
            if(correctedPriority>10){correctedPriority = 10};
            if(correctedPriority<0){correctedPriority = 0};
            const data = {
              actName:correctedActName,
              actStart:actStart,
              actEnd:actEnd,
              actPriority:correctedPriority,
              id:id
            };
            try {
              await axios({
              method: 'patch',
              url: `http://localhost:3000/edit-activity`,
              headers: {'Content-Type' : 'application/json'},
              data: {data}
            });
            } catch (error) {
              console.log("Something went wrong", error);
            }
            activity.querySelector("#actName").textContent = correctedActName;
            activity.querySelector("#actStart").textContent = actStart;
            activity.querySelector("#actEnd").textContent = actEnd;
            activity.querySelector("#actPriority").textContent = correctedPriority;
          } else{
            activity.querySelector("#actName").textContent = actualActivity.activity_name;
            activity.querySelector("#actStart").textContent = actualActivity.activity_start_time;
            activity.querySelector("#actEnd").textContent = actualActivity.activity_end_time;
            activity.querySelector("#actPriority").textContent = actualActivity.activity_priority;
          };
          activity.querySelector("#actName").contentEditable = "false";
          activity.querySelector("#actStart").contentEditable = "false";
          activity.querySelector("#actEnd").contentEditable = "false";
          activity.querySelector("#actPriority").contentEditable = "false";
          editImage.src = "src/assets/edit.svg";
          editButton.style.backgroundColor = "green";
      };
    };

    async function deleteActivity(event, id){
      document.getElementById(`activity ${id}`).style.backgroundColor = "rgb(255, 255, 255, 0)";
      document.querySelector(".overLayInitial").classList.remove("changeOverLay");
      document.body.style.overflow = "auto";
      document.querySelectorAll(".navbar").forEach(element => {element.style.zIndex = "auto";});
      document.querySelectorAll(".activityContainer").forEach(element => {element.style.zIndex = -1;});
      document.querySelectorAll(".dailyActivity").forEach(element => {element.style.zIndex = "auto";});
      document.querySelectorAll(".soloActivityBar").forEach(element => {
        if(element.id==`activity ${id}`){
          element.style.backgroundImage = "none";
          }
          element.style.zIndex = "auto";
        });
      document.querySelectorAll(".scrollHideBottom").forEach(element => {element.style.zIndex = "auto";});
      document.querySelectorAll(".scrollHide").forEach(element => {element.style.zIndex = "auto";});
      document.querySelectorAll(".addActivityBar").forEach(element => {element.style.zIndex = "auto";});
      event.preventDefault();
      try {
        await axios.delete(`http://localhost:3000/delete-activity/${id}`);
        takeAction({type:"changeActivityState"});
      } catch (error) {
        console.log("Something went wrong", error);
      };
    };

    return<><div className="soloActivityBar" id={"activity "+props.id} style={{color: state.darkMode? "white" : "black", border: state.darkMode? "0.2px solid white" : "0.2px solid black"}}>
      <div className="activity" id="actNo" style={{width:"2vw", paddingLeft:"2vw"}}> <p className="activityContent">{props.sno}</p></div>
      <div className="activity" id="actName" style={{width:"30vw",  marginLeft:"5vw"}}> <p className="activityContent editable">{props.activity}</p></div>
      <div className="activity" id="actStart"  style={{width:"5vw",  marginLeft:"2.5vw"}}><p className="activityContent editable">{props.startTime}</p></div>
      <div className="activity" id="actEnd"  style={{width:"5vw",  marginLeft:"2.5vw"}}><p className="activityContent editable">{props.endTime}</p></div>
      <div className="activity" id="actPriority" style={{width:"5vw",  marginLeft:"2.5vw"}}><p className="activityContent editable">{props.priority}</p></div>
      <div className="activity" style={{width:"5vw",  marginLeft:"2.5vw"}}><p className="activityContent">Status</p></div>
      <button className="modifyIcon" id="editButton" onClick={(event) => {editActivity(event, props.id)}} style={{all: "unset", cursor: "pointer", backgroundColor:"green",display:"flex",alignItems:"center",height:"24px",width:"25px",borderRadius:"50%", marginTop:"2px", marginLeft:"2vw"}}>
        <img id="editButton" className="asset" src="src/assets/edit.svg" alt="edit" />
      </button>
      <button type="button" className="modifyIcon" id="deleteButton" onClick={(event) => {deleteActivity(event, props.id)}} style={{all: "unset", cursor: "pointer", backgroundColor:"red",display:"flex",alignItems:"center",height:"24px",width:"25px",borderRadius:"50%", marginTop:"2px", marginLeft:"2vw"}}>
        <img id="deleteButton" className="asset" src="src/assets/trash.svg" alt="delete" />
      </button>
      </div></>
};