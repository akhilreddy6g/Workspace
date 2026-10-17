import featuresTabHook from "../../Noncomponents";
import { useContext } from "react";
import Missedactivities from "./Missedactivities";
import Missedactivityheader from "./Missedactivityheader";

export default function Missedactivitiesdates(props) {
    const { state } = useContext(featuresTabHook);

    function activityMapping(object, index) {
        return (
            <Missedactivities
                sno={index + 1}
                id={object.activity_uuid}
                key={object.activity_uuid}
                activity={object.activity_name}
                startTime={object.activity_start_time.slice(0, 5)}
                endTime={object.activity_end_time.slice(0, 5)}
                priority={object.activity_priority}
            />
        );
    }

    return (
        <>
            <div className="missedActivityContainer">
                <div className="missedActivityHeaderTab">
                    <Missedactivityheader date={props.date.slice(0, 10)} />
                    <div className="missedActivitiesList">
                        {props.activities.length > 0 && props.activities.map(activityMapping)}
                    </div>
                </div>
            </div>
        </>
    );
}
