import Weektabs from "./Weektabs"
import { useContext, useEffect, useState} from "react";
import featuresTabHook from "../../Noncomponents";
import Addactivitybar from "./Addactivitybar";
import Activityheader from "./Activityheader";
import Futureactivity from "./Futureactivity";
import { futureDate } from "../../Noncomponents";
import { apiUrl } from "../../Noncomponents";

export default function Planahead(){ 
    const {state, takeAction} = useContext(featuresTabHook);
    const [loading, setLoading] = useState(true); 
    const now = futureDate();
    const options = { year: 'numeric', month: 'long', day: 'numeric'}; 
    const data = state.upcomActivityData;
    var dates = [];

    for (var i = 0; i < 7; i++) {
        dates.push({
            date: now.toLocaleDateString('en-US', options),
            day: now.toLocaleDateString('en-US', { weekday: 'long' }),
        });
        now.setDate(now.getDate()+1);
    };

    async function alterData(){
        try {
            setLoading(true); 
            const sessionMail = sessionStorage.getItem('email');
            const mail = state.emailId? state.emailId : sessionMail
            const res = await apiUrl.get(`/upcoming-activities/${mail}?date=${state.actDate}`);
            takeAction({type:"changeUpcomActivityData", payload: res.data});
        } catch (error) {
            console.error("Error fetching upcoming activities", error);
        } finally {
            setLoading(false); 
        }
      };
  
    function activityMapping(object, index){
        return (
            <Futureactivity  
            sno = {index+1}
            id = {object.activity_uuid} 
            key = {object.activity_uuid}
            activity={object.activity_name} 
            startTime={object.activity_start_time.slice(0,5)} 
            endTime={object.activity_end_time.slice(0,5)} 
            priority={object.activity_priority}
            />
        );
    };

    function mapping(object, index){
        return (
        <Weektabs id={"day"+index} key={"day"+index} date={object.date} day={object.day} dateSimple={object.dateSimple}></Weektabs>
        )
    };

    useEffect(() => {
        alterData();
    },[state.updateUpcomActivity, state.actDate]);

    if (loading) {
        return <div className={`loadingSpinner ${state.fthState ? "scheduleDisclaimer1" : "scheduleDisclaimer2"}`} ><p className="loadingText">Loading, please wait...</p></div>;
    }
    
    return (<>{state.editUpcActivity && <div className="overLay1"></div>}
    <div className={`planAhead ${state.fthState? "planAhead1" : "planAhead2"}`}>
        {dates.map(mapping)}
        <Activityheader></Activityheader>
        {(state.addUpcActState ? <div className={`addActivityBar ${state.fthState? "addActivityBar1" : "addActivityBar2"}`}>
        <Addactivitybar></Addactivitybar> </div> : <div className={`currentActivities ${state.fthState? "scheduleDisclaimer1" : "scheduleDisclaimer2"}`}>
        <button className="addCurrentActivityButton" onClick={()=>{takeAction({type:"changeAddUpcActState", payload:true})}}><p  className="upcDate"> Add Activities on <span /*className="dateSpan"*/>{state.actDate.toLocaleDateString('en-US', options)}</span></p></button> </div>
    )}</div> {data && data.length>0 && <div className={`activityContainer ${state.fthState? "activityContainer1" : "activityContainer2"} ${state.editUpcActivity && "activityContainer3"}`} style={{top: "225px"}} id="actContainer">{data.map(activityMapping)}</div>}</>)
};