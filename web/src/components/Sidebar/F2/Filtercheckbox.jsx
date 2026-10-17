import { useContext, useState } from "react"
import featuresTabHook from "../../Noncomponents"
import { apiUrl } from "../../Noncomponents";

export default function Filtercheckbox(){
    const {state, takeAction} = useContext(featuresTabHook);
    const [filter, changeFilter] = useState("activity_start_time");

    function alertMessage(message){
        takeAction({type:"changeFailedAction", payload:message});
        setTimeout(() => {
            takeAction({type:"changeFailedAction"});
        }, 3500);
      }

    const alterFilter = async (event) => {
        changeFilter(event.target.value)
        if(filter!=event.target.value){
            try {
                const sessionMail = sessionStorage.getItem('email');
                const mail = state.emailId? state.emailId : sessionMail
                const res = await apiUrl.get(`/activities/${mail}?filter=${event.target.value}`);
                takeAction({type:"changeActivityData", payload: res.data});
            } catch (error) {
                alertMessage("Error while fetching the activities using filter")
            };
        };
    };
    return ( state.filterButton &&
        <div className={`filterContainer ${state.darkMode? "navdarkMode" : "featureNormal"}`}>
        <div>
            <input className="filterInput" type="radio" id="start" name="sortby" value="activity_start_time" onClick={alterFilter}/>
            <label className="filterLabel" htmlFor="startTime">Start</label>
        </div>
        <div>
            <input className="filterInput" type="radio" id="end" name="sortby" value="activity_end_time" onClick={alterFilter}/>
            <label className="filterLabel" htmlFor="endTime">End</label>
        </div>
        <div>
            <input className="filterInput" type="radio" id="priority" name="sortby" value="activity_priority" onClick={alterFilter}/>
            <label className="filterLabel" htmlFor="priority">Priority</label>
        </div>
        </div>
    )
}