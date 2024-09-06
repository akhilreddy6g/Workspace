import featuresTabHook from "../../Noncomponents";
import { useContext} from "react";
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
      const editable = activity.querySelectorAll(".editable");
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
          editable.forEach(element => {element.setAttribute("contentEditable", "true");});
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
          scrollHideBottom.forEach(element => {element.style.zIndex = "auto";});
          scrollHide.forEach(element => {element.style.zIndex = "auto";});
          addActivityBar.forEach(element => {element.style.zIndex = "auto";});
          const initdata = {
            initActName:initActName,
            initActStart:initActStart,
            initActEnd:initActEnd,
            initActPriority:initActPriority
          }
          console.log("initdata", initdata);
          const data = {
            actName:actName,
            actStart:actStart,
            actEnd:actEnd,
            actPriority:actPriority,
            id:id
          };
          console.log("actName, start, end, actPriority, id: ",data);
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
          editable.forEach(element => {element.setAttribute("contentEditable", "false");});
          editImage.src = "src/assets/edit.svg";
          editButton.style.backgroundColor = "green";
          takeAction({type:"changeActivityState"})
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
      <div className="activity" id="actName" style={{width:"30vw",  marginLeft:"5vw"}}> <p className="activityContent editable" contentEditable='false' suppressContentEditableWarning={true}>{props.activity}</p></div>
      <div className="activity" id="actStart"  style={{width:"5vw",  marginLeft:"2.5vw"}}><p className="activityContent editable" contentEditable="false" suppressContentEditableWarning={true}>{props.startTime}</p></div>
      <div className="activity" id="actEnd"  style={{width:"5vw",  marginLeft:"2.5vw"}}><p className="activityContent editable" contentEditable="false" suppressContentEditableWarning={true}>{props.endTime}</p></div>
      <div className="activity" id="actPriority" style={{width:"5vw",  marginLeft:"2.5vw"}}><p className="activityContent editable" contentEditable="false" suppressContentEditableWarning={true}>{props.priority}</p></div>
      <div className="activity" style={{width:"5vw",  marginLeft:"2.5vw"}}><p className="activityContent">Status</p></div>
      <button className="modifyIcon" id="editButton" onClick={(event) => {editActivity(event, props.id)}} style={{all: "unset", cursor: "pointer", backgroundColor:"green",display:"flex",alignItems:"center",height:"24px",width:"25px",borderRadius:"50%", marginTop:"2px", marginLeft:"2vw"}}>
        <img id="editButton" className="asset" src="src/assets/edit.svg" alt="edit" />
      </button>
      <button type="button" className="modifyIcon" id="deleteButton" onClick={(event) => {deleteActivity(event, props.id)}} style={{all: "unset", cursor: "pointer", backgroundColor:"red",display:"flex",alignItems:"center",height:"24px",width:"25px",borderRadius:"50%", marginTop:"2px", marginLeft:"2vw"}}>
        <img id="deleteButton" className="asset" src="src/assets/trash.svg" alt="delete" />
      </button>
      </div></>
};