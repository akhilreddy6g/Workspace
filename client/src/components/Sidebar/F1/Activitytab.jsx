import {useContext, useState, useEffect, useRef} from "react";
import featuresTabHook from "../../Noncomponents";
import { timeToMinutes } from "../../Noncomponents";
import { apiUrl } from "../../Noncomponents";
import { convertMinutesToHours } from "../../Noncomponents";

export default function Activitytab(props){
    const {state, takeAction} = useContext(featuresTabHook);
    const [hover, setHover] = useState(false);
    const [progress, setProgress] = useState(0);
    const [remTime, setRemTime] = useState(0);
    const buttonRef = useRef(null);

    function selectActivityTab(sno){
        takeAction({type:props.flag? "changeActTabButtRef" : "changeqsActTabButtRef", payload:sno-1});
    };

    function selectInitialTab(){
        const index = props.sno-1;
        const curr = props.flag? state.csActivityIndex : state.qsActivityIndex;
        if (curr===null && (props.flag? state.activeTab : state.qsActiveTab)===null) {
            if(props.sno==1){
                return "specialTab";
            }
        } else if (curr === index) {
            if(buttonRef!=null && buttonRef.current!=null){
                buttonRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "start"
                  });
            }
            return "specialTab";
        };
        return "";
    };

    function selectCurrentActivityTab(){
        if((props.flag? state.activeTab : state.qsActiveTab)==props.sno-1){
            if(((props.flag? state.csActivityIndex: state.qsActivityIndex)==(props.flag? state.activeTab : state.qsActiveTab)) && buttonRef!=null && buttonRef.current!=null){
                buttonRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                    inline: "start"
                  });
            }
            return "currentActivityTab";
        }
        return "";
      }

    async function updateProgress() {
        const now = new Date();
        const currentTimeMinutes = now.getHours() * 60 + now.getMinutes(); 
        const startTimeMinutes = timeToMinutes(props.startTime); 
        const endTimeMinutes = timeToMinutes(props.endTime); 
        const sessionMail = sessionStorage.getItem('email');
        const mail = state.emailId? state.emailId : sessionMail
        if (currentTimeMinutes >= endTimeMinutes) {
            if(props.status==null && JSON.parse(sessionStorage.getItem(props.id))==null){
                const url = props.type === "c" ? `/update-ca-status/${mail}?id=${props.id}&status=${0}` : `/update-da-status/${mail}?id=${props.id}&status=${0}`;
                await apiUrl.post(url);
                sessionStorage.setItem(props.id, JSON.stringify({ action: "skip", value: true }));
            };
            setProgress(100);
            setRemTime('0h 0m');
        } else if (currentTimeMinutes >= startTimeMinutes && currentTimeMinutes <= endTimeMinutes) {
            const totalTime = endTimeMinutes - startTimeMinutes; 
            const timeElapsed = currentTimeMinutes - startTimeMinutes;
            const timeLeft = totalTime - timeElapsed;
            const timeLeftInHours = convertMinutesToHours(timeLeft);
            setRemTime(timeLeftInHours);
            const percentage = (timeElapsed / totalTime) * 100;
            setProgress(percentage);
        } else {
            const totalTime = endTimeMinutes - startTimeMinutes;
            const timeLeftInHours = convertMinutesToHours(totalTime);
            setRemTime(timeLeftInHours);
            setProgress(0);
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
                return './assets/greenok.svg';
            } else if (parsedItem.action === "skip") {
                return './assets/redclose.svg';
            }
        }
        if (props.status == "0") {
            return './assets/redclose.svg';
        } else if (props.status == "1") {
            return './assets/greenok.svg';
        }
    }

    function handleMouseEnter() {
        setHover(true); 
    }

    function handleMouseLeave() {
        setHover(false); 
    }
    
    useEffect(() => {
        updateProgress();
        const intervalId = setInterval(updateProgress, 15000); 
        return () => clearInterval(intervalId);
    }, [props.startTime, props.endTime]);

    return (<>
        <div className={`activityTab-${props.id} atab-${props.sno} ${selectInitialTab()} ${selectCurrentActivityTab()} activitiesInCurrentSchedule`} ref={buttonRef} onClick={()=>{selectActivityTab(props.sno)}}>
            <div className="csInfoContainer">
                <p className="csInfo type" style={{backgroundColor: props.type=="d"? "teal" : "black"}}>{props.type=="d"? "Daily" : "Today"}</p>
                <p className="sno" id={props.sno} style={{fontSize:"15px"}}>{props.sno}</p>
                <p className="csInfo priority" style={{backgroundColor: props.type=="d"? "teal" : "black"}}>Priority: {props.priority}</p>
            </div>
            <div className="activityName" >{props.activity}</div>
            <div className="timeAndStatus">
                <div className="activityStartTime">{props.startTimeAmPm}</div>
                <div className="timeBarContainer">
                    <div className="timeBar" onMouseOver={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        {hover && <p className="timeLeftContent"> {remTime} left</p>}
                    <div className="fillBar" style={{width: getBarWidth(progress), backgroundColor: getBackgroundColor()}}>
                        {(progress>15 || sessionStorage.getItem(props.id)!=null || props.status!=null) && (!hover) && <div className="activityCurrentStatus" style={{backgroundColor:"white"}}> 
                        {(props.status!=null || sessionStorage.getItem(props.id)) && <img className="activityStatusImg" src={imgOp()} alt="activityStatus" /> }</div>}
                    </div>
                </div>
                </div>
            <div className="activityEndTime"> {props.endTimeAmPm} </div>
            </div>
        </div>
        </>
    );
};

