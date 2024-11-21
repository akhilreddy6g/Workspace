import featuresTabHook from "../../Noncomponents";
import { useContext} from "react";
import Activitytab from "../F1/Activitytab";
import Activityframe from "../F1/Activityframe";
import { convertTimeToAmPm } from "../../Noncomponents";
import { formatTime } from "../../Noncomponents";

export default function Qsession(){
    const {state, takeAction} = useContext(featuresTabHook);
    var data = state.qsCombinedSubActivityData;
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
                startTimeAmPm = {convertTimeToAmPm(formatTime(new Date(`1970-01-01T${object.activity_start_time}`)))}
                endTimeAmPm = {convertTimeToAmPm(formatTime(new Date(`1970-01-01T${object.activity_end_time}`)))}
                flag = {false}
            />
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
                    id={state.qsActivityIndex != null && state.qsCombinedSubActivityData[state.qsActivityIndex] ? state.qsCombinedSubActivityData[state.qsActivityIndex].activity_uuid : state.qsCombinedSubActivityData[0]?.activity_uuid}
                    key={state.qsActivityIndex != null && state.qsCombinedSubActivityData[state.qsActivityIndex] ? state.qsCombinedSubActivityData[state.qsActivityIndex].activity_uuid : state.qsCombinedSubActivityData[0]?.activity_uuid}
                    activity={ state.qsActivityIndex != null && state.qsCombinedSubActivityData[state.qsActivityIndex] ? state.qsCombinedSubActivityData[state.qsActivityIndex].activity_name : state.qsCombinedSubActivityData[0]?.activity_name }
                    startTime={ state.qsActivityIndex != null && state.qsCombinedSubActivityData[state.qsActivityIndex] ? state.qsCombinedSubActivityData[state.qsActivityIndex].activity_start_time.slice(0, 5) : state.qsCombinedSubActivityData[0]?.activity_start_time.slice(0, 5)}
                    endTime={ state.qsActivityIndex != null && state.qsCombinedSubActivityData[state.qsActivityIndex] ? state.qsCombinedSubActivityData[state.qsActivityIndex].activity_end_time.slice(0, 5) : state.qsCombinedSubActivityData[0]?.activity_end_time.slice(0, 5)}
                    priority={ state.qsActivityIndex != null && state.qsCombinedSubActivityData[state.qsActivityIndex] ? state.qsCombinedSubActivityData[state.qsActivityIndex].activity_priority : state.qsCombinedSubActivityData[0]?.activity_priority }
                    notes={ state.qsActivityIndex != null && state.qsCombinedSubActivityData[state.qsActivityIndex] ? state.qsCombinedSubActivityData[state.qsActivityIndex].activity_description : state.qsCombinedSubActivityData[0]?.activity_description }
                    type={ state.qsActivityIndex != null && state.qsCombinedSubActivityData[state.qsActivityIndex] ? state.qsCombinedSubActivityData[state.qsActivityIndex].activity_type : state.qsCombinedSubActivityData[0]?.activity_type }
                    status={ state.qsActivityIndex != null && state.qsCombinedSubActivityData[state.qsActivityIndex] ? state.qsCombinedSubActivityData[state.qsActivityIndex].activity_status : state.qsCombinedSubActivityData[0]?.activity_status }
                    flag = {false}
                />
            )}
            </div>
        </>
    );
}