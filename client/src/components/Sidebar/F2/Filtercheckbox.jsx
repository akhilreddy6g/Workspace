import { useContext, useState } from "react"
import featuresTabHook from "../../Noncomponents"
import axios from "axios";

export default function Filtercheckbox(){
    const {state, takeAction} = useContext(featuresTabHook);
    const [filter, changeFilter] = useState("activity_start_time");
    const alterFilter = async (event) => {
        console.log("filter", filter);
        changeFilter(event.target.value)
        console.log("event", event.target);
        if(filter!=event.target.value){
            try {
                const res = await axios.get(`http://localhost:3000/activities/${event.target.value}`);
                takeAction({type:"changeActivityData", payload: res.data});
                // takeAction({type:"changeActivityState", payload:!state.updateActivity});
            } catch (error) {
                console.log("Something went wrong", error);
            };
        };
    }
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