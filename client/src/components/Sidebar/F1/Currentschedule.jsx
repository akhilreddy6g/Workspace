import { useContext, useEffect, useState } from "react";
import featuresTabHook from "../../Noncomponents";
import Activitytab from "./Activitytab";
import Activityframe from "./Activityframe";
import Currentdayactivity from "./Currentdayactivity";
import { apiUrl } from "../../Noncomponents";
import { convertTimeToAmPm } from "../../Noncomponents";
import { formatTime } from "../../Noncomponents";

export default function CurrentSchedule() {
    const { state, takeAction } = useContext(featuresTabHook);
    const [loading, setLoading] = useState(true); 
    var data = state.combinedActivityData;

    function alertMessage(message){
        takeAction({type:"changeFailedAction", payload:message});
        setTimeout(() => {
            takeAction({type:"changeFailedAction"});
        }, 3500);
      }

    async function alterData() {
        try {
            setLoading(true); 
            const sessionMail = sessionStorage.getItem('email');
            const mail = state.emailId ? state.emailId : sessionMail;
            const combinedAct = await apiUrl.get(`/combined-activities/${mail}`);
            takeAction({ type: "changeCombinedActivityData", payload: combinedAct.data });
        } catch (error) {
            alertMessage("Error while retrieving the activities");
        } finally {
            setLoading(false); 
        }
    }
    function activityMapping(object, index) {
        if (!object || !object.activity_uuid) return null;

        return (
            <Activitytab
                sno={index + 1}
                id={object.activity_uuid}
                key={object.activity_uuid}
                activity={object.activity_name}
                startTime={object.activity_start_time ? object.activity_start_time.slice(0, 5) : 'N/A'}
                endTime={object.activity_end_time ? object.activity_end_time.slice(0, 5) : 'N/A'}
                startTimeAmPm = {convertTimeToAmPm(formatTime(new Date(`1970-01-01T${object.activity_start_time}`)))}
                endTimeAmPm = {convertTimeToAmPm(formatTime(new Date(`1970-01-01T${object.activity_end_time}`)))}
                priority={object.activity_priority}
                type={object.activity_type}
                status={object.activity_status}
                flag={true}
            />
        );
    }

    useEffect(() => {
        alterData();
    }, [state.updateActivity]);

    if (loading) {
        return <div className="loadingSpinner"><p className="loadingText" style={{color: state.darkMode? 'white' : 'black'}}>Loading, please wait...</p></div>;
    }

    if (!state.combinedActivityData || state.combinedActivityData.length === 0) {
        return (
            <>
                <div className="scheduleDisclaimer">
                    <p className="scheduleContext">No schedule yet. Add activities to get started!</p>
                </div>
                <Currentdayactivity />
            </>
        );
    }

    return (
        <>
            <div className="activityListHViewFrame">
                <div className="activityListHView">
                    {data && data.length > 0 && data.map(activityMapping)}
                </div>
                {data && data.length > 0 && (
                <Activityframe
                    id={state.csActivityIndex != null && state.combinedActivityData[state.csActivityIndex] ? state.combinedActivityData[state.csActivityIndex].activity_uuid : state.combinedActivityData[0]?.activity_uuid}
                    key={state.csActivityIndex != null && state.combinedActivityData[state.csActivityIndex] ? state.combinedActivityData[state.csActivityIndex].activity_uuid : state.combinedActivityData[0]?.activity_uuid}
                    activity={ state.csActivityIndex != null && state.combinedActivityData[state.csActivityIndex] ? state.combinedActivityData[state.csActivityIndex].activity_name : state.combinedActivityData[0]?.activity_name }
                    startTime={ state.csActivityIndex != null && state.combinedActivityData[state.csActivityIndex] ? state.combinedActivityData[state.csActivityIndex].activity_start_time.slice(0, 5) : state.combinedActivityData[0]?.activity_start_time.slice(0, 5)}
                    endTime={ state.csActivityIndex != null && state.combinedActivityData[state.csActivityIndex] ? state.combinedActivityData[state.csActivityIndex].activity_end_time.slice(0, 5) : state.combinedActivityData[0]?.activity_end_time.slice(0, 5)}
                    priority={ state.csActivityIndex != null && state.combinedActivityData[state.csActivityIndex] ? state.combinedActivityData[state.csActivityIndex].activity_priority : state.combinedActivityData[0]?.activity_priority }
                    notes={ state.csActivityIndex != null && state.combinedActivityData[state.csActivityIndex] ? state.combinedActivityData[state.csActivityIndex].activity_description : state.combinedActivityData[0]?.activity_description }
                    type={ state.csActivityIndex != null && state.combinedActivityData[state.csActivityIndex] ? state.combinedActivityData[state.csActivityIndex].activity_type : state.combinedActivityData[0]?.activity_type }
                    status={ state.csActivityIndex != null && state.combinedActivityData[state.csActivityIndex] ? state.combinedActivityData[state.csActivityIndex].activity_status : state.combinedActivityData[0]?.activity_status }
                    flag={true}
                />
            )}
            </div>
            <Currentdayactivity />
        </>
    );
}