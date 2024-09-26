import {useContext, useState, useEffect, useRef} from "react";
import featuresTabHook from "../../Noncomponents";
import axios from "axios";

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

    function resetButtonStyle(buttonRef){
        if (buttonRef && buttonRef.current) {
          buttonRef.current.style.boxShadow = "none";
          buttonRef.current.style.backgroundColor = "rgb(255,255,144)";
        } else if (buttonRef) {
          buttonRef.style.boxShadow = "none";
          buttonRef.style.backgroundColor = "rgb(255,255,144)";
        };
      };

    async function updateProgress() {
        const now = new Date();
        const currentTimeMinutes = now.getHours() * 60 + now.getMinutes(); 
        const startTimeMinutes = timeToMinutes(props.startTime); 
        const endTimeMinutes = timeToMinutes(props.endTime); 
        if(currentTimeMinutes==0 && now.getSeconds()>=0 && now.getSeconds()<=15){
            sessionStorage.clear();
            try {
                await axios.delete("http://localhost:3000/delete-current-activities");
                await axios.patch("http://localhost:3000/reset-daily-activities-status");
                const combinedAct = await axios.get("http://localhost:3000/combined-activities");
                takeAction({type:"changeCombinedActivityData", payload: combinedAct.data});
            } catch (error) {
                console.log("Something went wrong", error);
            };
        };
        if (currentTimeMinutes >= endTimeMinutes) {
            if(props.status==null && JSON.parse(sessionStorage.getItem(props.id))==null){
                const data = { actId: props.id, actStatus: 0};
                const url = props.type === "c" ? "http://localhost:3000/update-ca-status" : "http://localhost:3000/update-da-status";
                await axios.post(url, { data });
                sessionStorage.setItem(props.id, JSON.stringify({ action: "skip", value: true }));
            };
            setProgress(100);
        } else if (currentTimeMinutes >= startTimeMinutes && currentTimeMinutes <= endTimeMinutes) {
            const totalTime = endTimeMinutes - startTimeMinutes; 
            const timeElapsed = currentTimeMinutes - startTimeMinutes;
            const percentage = (timeElapsed / totalTime) * 100;
            setProgress(percentage);
        } else {
            setProgress(0);
        };
    };

    function selectActivityTab(sno){
        const prevButtonRef = state.activityTabButtRef;
        if(prevButtonRef && prevButtonRef.current){
            prevButtonRef.current.style.boxShadow = "none";
            prevButtonRef.current.style.backgroundColor = "rgb(255,255,144)";
        } else if(prevButtonRef){
            prevButtonRef.style.boxShadow = "none";
            prevButtonRef.style.backgroundColor = "rgb(255,255,144)";
        } 
        takeAction({type:"changeActTabButtRef", payload:sno-1, button:buttonRef});
        if(sno-1!=state.activeTab && buttonRef && buttonRef.current){
            buttonRef.current.style.boxShadow = "0 0 7px black";
            buttonRef.current.style.backgroundColor = "#b1c7b3";
        };
    };

    const getBarWidth = (progress) => {
        const item = sessionStorage.getItem(props.id);
        return (props.status == null && item == null) ? `${progress}%` : "100%";
    };

    const getBackgroundColor = () => {
        const item = sessionStorage.getItem(props.id);
        if (item) {
            const parsedItem = JSON.parse(item);
            if (parsedItem.action === "complete") {
                return 'green';
            } else if (parsedItem.action === "skip") {
                return 'red';
            }
        }
        if (props.status == "0") {
            return 'red';
        } else if (props.status == "1") {
            return 'green';
        }
        return 'orange';
    };

    function imgOp(){
        const item = sessionStorage.getItem(props.id);
        if (item) {
            const parsedItem = JSON.parse(item);
            if (parsedItem.action === "complete") {
                return '/src/assets/greenok.svg';
            } else if (parsedItem.action === "skip") {
                return '/src/assets/redclose.svg';
            }
        }
        if (props.status == "0") {
            return '/src/assets/redclose.svg';
        } else if (props.status == "1") {
            return '/src/assets/greenok.svg';
        }
    }
    
    useEffect(() => {
        updateProgress();
        const intervalId = setInterval(updateProgress, 15000); 
        return () => clearInterval(intervalId);
    }, [props.startTime, props.endTime]);

    useEffect(() => {
        if(state.activityTabButtRef){
            resetButtonStyle(state.activityTabButtRef);
        };
    }, [state.activeTab])

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
                    <div className="timeBar" onMouseOver={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        {hover && <p className="timeLeftContent"> {Math.floor(100-progress)}% left</p>}
                    <div className="fillBar" style={{width: getBarWidth(progress), backgroundColor: getBackgroundColor()}}>
                        {(progress>15 || sessionStorage.getItem(props.id)!=null || props.status!=null) && <div className="activityCurrentStatus" style={{backgroundColor:"white"}}> 
                        {(props.status!=null || sessionStorage.getItem(props.id)) && <img className="activityStatusImg" src={imgOp()} alt="activityStatus" /> }</div>}
                    </div>
                </div>
                </div>
            <div className="activityEndTime"> {props.endTime} </div>
            </div>
        </div>
        </>
    );
} 
