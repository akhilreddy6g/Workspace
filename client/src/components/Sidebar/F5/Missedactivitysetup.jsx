import featuresTabHook from "../../Noncomponents";
import { useContext, useEffect, useState, useRef} from "react";
import Missedactivitiesdates from "./Missedactivitiesdates";
import { apiUrl } from "../../Noncomponents";

export default function Missedactivitysetup(){
    const { state, takeAction } = useContext(featuresTabHook);
    const isFirstRender = useRef(true);
    const [dates, setDates] = useState([]);
    const [activities, setActivities] = useState([]);

    async function getData() {
        const sessionMail = sessionStorage.getItem('email');
        const mail = state.emailId? state.emailId : sessionMail
        const [datesResponse, activitiesResponse] = await Promise.all([
            apiUrl.get(`/missed-activities-dates/${mail}`),
            apiUrl.get(`/missed-activities/${mail}`)
        ]);
        return {
            dates: datesResponse.data,
            activities: activitiesResponse.data
        };
    }

    function mapping(object, index) {
        const filteredActivities = activities.filter(activity => activity.activity_date.slice(0, 10) === object.activity_date.slice(0, 10));
        return (
            <Missedactivitiesdates
                key={index}
                date={object.activity_date}
                activities={filteredActivities}
            />
        );
    }

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
        } else {
            getData().then(records => {
                setDates(records.dates);
                setActivities(records.activities);
            }).catch(error => {
                console.error(`error is ${error}`);
            });
        }
    }, [state.updateMissedActivity]);

    return (
        <> 
            <div className={`maMainContainer ${state.fthState ? "scheduleDisclaimer1" : "scheduleDisclaimer2"}`} style={{display: "flex", flexDirection: "column", position: "absolute", top: "85px", gap: "20px", transition: "150ms linear"}}>
                {state.editMissedActivity && <div className="overLay1"></div>}
                {dates.length > 0 ? dates.map(mapping) : (
                    <div className={`scheduleDisclaimer ${state.fthState ? "scheduleDisclaimer1" : "scheduleDisclaimer2"}`}>
                        <p className="scheduleContext">Great Work! You have no missed activities</p>
                    </div>
                )}
            </div>
        </>
    );
}
