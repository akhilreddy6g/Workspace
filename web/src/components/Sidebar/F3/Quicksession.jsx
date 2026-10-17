import {useContext, useEffect, useState} from "react";
import featuresTabHook from "../../Noncomponents";
import Quicksessionsetup from "./Quicksessionsetup";
import { apiUrl } from "../../Noncomponents";
import Qsession from "./Qsession";

export default function Quicksession(){
    const {state, takeAction} = useContext(featuresTabHook);
    const [loading, setLoading] = useState(false); 
    async function alterData(){
        try {
            const sessionMail = sessionStorage.getItem('email');
            const mail = state.emailId? state.emailId : sessionMail
            setLoading(true); 
            const response = await apiUrl.get(`/session-data/${mail}?sessionType=q`);
            if(response.data){
               takeAction({type:"changeQsCombinedSubActivityData", payload:response.data.activities});
               takeAction({type:"changeQsession", payload:response.data.session});
            } 
        } catch (error) {
            //Request not processed
        } finally {
            setLoading(false); 
        }
    }

    useEffect(()=>{
        alterData();
    }, [state.updateActivity])

    if (loading) {
        return <div className="loadingSpinner"><p className="loadingText" style={{color: state.darkMode? 'white' : 'black'}}>Loading, please wait...</p></div>;
    }

    return <>

    {state.qsCombinedSubActivityData && state.qsCombinedSubActivityData.length<1 && <div className="scheduleDisclaimer">
     <p className="scheduleContext">No session yet. Setup a session and plan the next hour!</p>
    </div>}

    {state.qsCombinedSubActivityData && state.qsCombinedSubActivityData.length<1 && state.qsession && state.qsession[0] && state.qsession[0] !== null && <div className="scheduleDisclaimer">
        <p className="scheduleContext">No activities scheduled in the session!</p>
    </div>}

    {((state.qsCombinedSubActivityData && state.qsCombinedSubActivityData.length>0) || (state.qsession && state.qsession[0] && state.qsession[0] !== null)) && <Qsession></Qsession>}
        
    {state.qastate?
    <div className="overLay">
    <div className={`setQuickSess ${state.darkMode && "setQuickSess1"}`}>
        <div className={`toolBar ${state.darkMode && "toolBar1"}`}>
            <p className="setDayContext setQuickSessContext">Setup Quick Session</p>
            <button className="closeSetDayButton" onClick={() => {takeAction({type:"changeQuickSessState"});}}>x</button>
        </div>
        <Quicksessionsetup></Quicksessionsetup>
    </div>
    </div>: 
    <div className="currentActivities" style={{top:"93.3vh"}}>
    <button className="addCurrentActivityButton" onClick={()=>{takeAction({type: "changeQuickSessState"})}}>Setup Session</button> </div>}
    </>
}