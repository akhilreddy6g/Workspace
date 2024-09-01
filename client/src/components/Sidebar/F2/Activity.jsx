import featuresTabHook from "../../Noncomponents";
import { useContext } from "react";

export default function Activity(props){
    const {state, takeAction} = useContext(featuresTabHook);
    return <div className="soloActivityBar" style={{left: state.fthState? "17vw" : "10vw", color: state.darkMode? "white" : "black", border: state.darkMode? "0.2px solid white" : "0.2px solid black"}}>
      <div className="activity" style={{width:"2vw", paddingLeft:"2vw"}}>{props.id}</div>
      <div className="activity" style={{width:"30vw",  marginLeft:"5vw"}}>{props.activity}</div>
      <div className="activity" style={{width:"10vw",  marginLeft:"5vw"}}>{props.startTime + " - " + props.endTime}</div>
      <div className="activity" style={{width:"10vw",  paddingLeft:"4vw"}}>{props.priority}</div>
      <div className="activity" style={{width:"10vw",  paddingLeft:"5vw"}}>Status</div>
      <div className="activity modifyIcon" id="deleteButton" style={{marginLeft:"1vw", backgroundColor:"red"}}><img className="asset" src="src/assets/trash.svg" alt="delete" /></div>
      <div className="activity modifyIcon" id="editButton" style={{marginLeft:"2vw", backgroundColor:"green"}}><img className="asset" src="src/assets/edit.svg" alt="edit" /></div>
    </div>
}