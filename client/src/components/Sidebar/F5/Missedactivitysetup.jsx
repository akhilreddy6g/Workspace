import featuresTabHook from "../../Noncomponents";
import { useContext, useEffect, useState} from "react";
import Missedactivitiesdates from "./Missedactivitiesdates";
import { apiUrl } from "../../Noncomponents";

export default function Missedactivitysetup(){
    const { state, takeAction } = useContext(featuresTabHook);
    const [dates, setDates] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true); 
    
    function alertMessage(message){
        takeAction({type:"changeFailedAction", payload:message});
        setTimeout(() => {
            takeAction({type:"changeFailedAction"});
        }, 3500);
      }

    async function getData() {
        try {
            setLoading(true); 
            const sessionMail = sessionStorage.getItem('email');
            const mail = state.emailId ? state.emailId : sessionMail;
            const [datesResponse, activitiesResponse] = await Promise.all([
                apiUrl.get(`/missed-activities-dates/${mail}`),
                apiUrl.get(`/missed-activities/${mail}`)
            ]);
            return {
                dates: datesResponse.data,
                activities: activitiesResponse.data
            };
        } catch (error) {
            alertMessage("Error while fetching the missed activities")
            return { dates: [], activities: [] };
        } finally {
            setLoading(false); 
        }
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
        getData().then(records => {
            setDates(records.dates);
            setActivities(records.activities);
        }).catch(error => {
            alertMessage("Error while retrieving the data")
        });
    }, [state.updateMissedActivity]);

    if (loading) {
        return <div className="loadingSpinner" ><p className="loadingText" style={{color: state.darkMode? 'white' : 'black'}}>Loading, please wait...</p></div>;
    }

    return (
        <> 
            <div className="maMainFrame">
                <div className="maMainContainer">
                    {state.editMissedActivity && <div className="overLay1"></div>}
            </div>
                    {dates.length > 0 ? dates.map(mapping) : (
                        <div className="scheduleDisclaimer">
                            <p className="scheduleContext">Great Work! You're all caught up!</p>
                        </div>
                    )}
                </div>
        </>
    );
}
