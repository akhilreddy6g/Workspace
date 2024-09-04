import featuresTabHook from "../../Noncomponents";
import { useContext } from "react";
import axios from "axios";

export default function Activity(props){
    const {state, takeAction} = useContext(featuresTabHook);
    async function deleteActivity(event, id){
      event.preventDefault();
      console.log("event", event);
      console.log("state", state.updateActivity);
      console.log("id", id);
      try {
        await axios.delete(`http://localhost:3000/delete-activity/${id}`);
        takeAction({type:"changeActivityState"});
        console.log("event after", event);
        console.log("state after", state.updateActivity);
        console.log("id after", id);
      } catch (error) {
        console.log("Something went wrong", error);
      };
    };

    return <div className="soloActivityBar" id={"activity "+props.id} style={{color: state.darkMode? "white" : "black", border: state.darkMode? "0.2px solid white" : "0.2px solid black"}}>
      <div className="activity" style={{width:"2vw", paddingLeft:"2vw"}}>{props.sno}</div>
      <div className="activity" style={{width:"30vw",  marginLeft:"5vw"}}>{props.activity}</div>
      <div className="activity" style={{width:"10vw",  marginLeft:"5vw"}}>{props.startTime + " - " + props.endTime}</div>
      <div className="activity" style={{width:"10vw",  paddingLeft:"4vw"}}>{props.priority}</div>
      <div className="activity" style={{width:"10vw",  paddingLeft:"5vw"}}>Status</div>
      <button className="modifyIcon" id="editButton" /*onClick={() => {takeAction({type:"changeEditActivityState"})}}*/ style={{all: "unset", cursor: "pointer", backgroundColor:"green",display:"flex",alignItems:"center",height:"24px",width:"25px",borderRadius:"50%", marginTop:"2px", marginLeft:"1vw"}}>
        <img className="asset" src="src/assets/edit.svg" alt="edit" />
      </button>
      <button type="button" className="modifyIcon" id="deleteButton" onClick={(event) => {deleteActivity(event, props.id)}} style={{all: "unset", cursor: "pointer", backgroundColor:"red",display:"flex",alignItems:"center",height:"24px",width:"25px",borderRadius:"50%", marginTop:"2px", marginLeft:"1.5vw"}}>
        <img className="asset" src="src/assets/trash.svg" alt="delete" />
      </button>
      </div>
};