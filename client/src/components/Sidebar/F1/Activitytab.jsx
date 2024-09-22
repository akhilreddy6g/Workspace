import {useContext, useState, useEffect, useRef} from "react";
import featuresTabHook from "../../Noncomponents";

export default function Activitytab(props){
    const {state, takeAction} = useContext(featuresTabHook);
    const [hover, setHover] = useState(false);
    const [progress, setProgress] = useState(0);
    const buttonRef = useRef(null);

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
    function selectActivityTab(sno){
        const prevButtonRef = state.activityTabButtRef
        if(prevButtonRef && prevButtonRef.current){
            prevButtonRef.current.style.boxShadow = "none";
            prevButtonRef.current.style.backgroundColor = "rgb(255,255,144)";
        } else if(prevButtonRef){
            prevButtonRef.style.boxShadow = "none";
            prevButtonRef.style.backgroundColor = "rgb(255,255,144)";
        }
        takeAction({type:"changeActTabButtRef", payload:sno-1, button:buttonRef});
        buttonRef.current.style.boxShadow = "0 0 7px black"
        buttonRef.current.style.backgroundColor = "#b1c7b3"
    }

    useEffect(() => {
        updateProgress();
        const intervalId = setInterval(updateProgress, 15000); 
        return () => clearInterval(intervalId);
    }, [props.startTime, props.endTime]);

    return (<>
        <div className={`activityTab-${props.id} atab-${props.sno} activitiesInCurrentSchedule ${state.fthState? "scheduleDisclaimer1" : "scheduleDisclaimer2"}`} ref={buttonRef} onClick={()=>{selectActivityTab(props.sno)}}>
            <div className="csInfoContainer">
                <p className="csInfo type">{props.type=="d"? "Daily" : "Today"}</p>
                <p className="sno" id={props.sno} style={{fontSize:"15px"}}>{props.sno}</p>
                <p className="csInfo priority">Priority: {props.priority}</p>
            </div>
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
