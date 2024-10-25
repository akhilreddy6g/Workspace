import { useContext, useEffect, useRef } from "react";
import featuresTabHook from "../../Noncomponents";
import Activitytab from "./Activitytab";
import Activityframe from "./Activityframe";
import Currentdayactivity from "./Currentdayactivity";
import { apiUrl } from "../../Noncomponents";

export default function CurrentSchedule() {
    const { state, takeAction } = useContext(featuresTabHook);
    const isFirstRender = useRef(true);
    var data = state.combinedActivityData;
    async function alterData() {
        try {
            const combinedAct = await apiUrl.get(`/combined-activities/${state.emailId}`);
            takeAction({ type: "changeCombinedActivityData", payload: combinedAct.data });
        } catch (error) {
            console.error("Error fetching combined activities:", error);
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
                priority={object.activity_priority}
                type={object.activity_type}
                status={object.activity_status}
            />
        );
    }

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
        } else {
            alterData();
        }
    }, [state.updateActivity]);

    if (!state.combinedActivityData || state.combinedActivityData.length === 0) {
        return (
            <>
                <div className={`scheduleDisclaimer ${state.fthState ? "scheduleDisclaimer1" : "scheduleDisclaimer2"}`}>
                    <p className="scheduleContext">No schedule to show. Add activities, to view schedule</p>
                </div>
                <Currentdayactivity />
            </>
        );
    }

    return (
        <>
            <div className={`activityListHView ${state.fthState ? "activityListHView1" : "activityListHView2"}`}>
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
                />
            )}
            <Currentdayactivity />
        </>
    );
}
