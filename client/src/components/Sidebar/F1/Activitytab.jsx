import {useContext, useState, useEffect} from "react";
import featuresTabHook from "../../Noncomponents";

export default function Activitytab(props){
    const {state} = useContext(featuresTabHook);
    const [hover, setHover] = useState(false);
    const [progress, setProgress] = useState(0);

    function handleMouseEnter() {
        setHover(true); 
    }

    function handleMouseLeave() {
        setHover(false); 
    }

    const timeToMinutes = (timeStr) => {
        const [hours, minutes] = timeStr.split(":").map(Number);
        return hours * 60 + minutes;
    };

    useEffect(() => {
        function updateProgress() {
            const now = new Date();
            const currentTimeMinutes = now.getHours() * 60 + now.getMinutes(); 
            const startTimeMinutes = timeToMinutes(props.startTime); 
            const endTimeMinutes = timeToMinutes(props.endTime); 

            if (currentTimeMinutes >= endTimeMinutes) {
                setProgress(100);
            } else if (currentTimeMinutes >= startTimeMinutes && currentTimeMinutes <= endTimeMinutes) {
                const totalTime = endTimeMinutes - startTimeMinutes; 
                const timeElapsed = currentTimeMinutes - startTimeMinutes;
                const percentage = (timeElapsed / totalTime) * 100;
                setProgress(percentage);
            } else {
                setProgress(0);
            }
        }
        updateProgress();
        const intervalId = setInterval(updateProgress, 15000); 
        return () => clearInterval(intervalId);
    }, [props.startTime, props.endTime]);

    return (<>
        <div className={`activityTab-${props.id} activitiesInCurrentSchedule ${state.fthState? "scheduleDisclaimer1" : "scheduleDisclaimer2"}`}>
            <div className="activityName" >{props.activity}</div>
                <div className="timeAndStatus">
                    <div className="activityStartTime">{props.startTime}</div>
                    <div className="timeBarContainer">
                        <div className="timeBar" onMouseOver={handleMouseEnter} onMouseLeave={handleMouseLeave}>{hover && <p className="timeLeftContent">{Math.floor(100-progress)}% left</p>}<div className="fillBar" style={{ width: `${progress}%`}}></div></div>
                    </div>
                    <div className="activityEndTime"> {props.endTime} </div>
                </div>
        </div>
        </>
    );
}
