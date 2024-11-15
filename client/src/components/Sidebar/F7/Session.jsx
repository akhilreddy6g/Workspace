import featuresTabHook from "../../Noncomponents";
import { useContext, useState, useEffect } from "react";
import { timeToMinutes } from "../../Noncomponents";

export default function Session(props){
    const {state, takeAction} = useContext(featuresTabHook);
    const [progress, setProgress] = useState(0);
    const [remTime, setRemTime] = useState(0);
    const [remBreakTime, setRemBreakTime] = useState(0);
    const [breakProgress, setBreakProgress] = useState(0);

    function convertMinutesToHours(minutes) {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours<10? '0'+hours: hours} : ${remainingMinutes <10? '0'+remainingMinutes : remainingMinutes}`;
    }

    function updateProgress() {
        const now = new Date();
        const currentTimeMinutes = now.getHours() * 60 + now.getMinutes(); 
        const startTimeMinutes = timeToMinutes(props.startTime24Hr); 
        const endTimeMinutes = timeToMinutes(props.endTime24Hr); 
        if (currentTimeMinutes >= endTimeMinutes) {
            setProgress(100);
            setRemTime('00 : 00');
        } else if (currentTimeMinutes >= startTimeMinutes && currentTimeMinutes < endTimeMinutes) {
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

    function updateBreakProgress() {
        const now = new Date();
        const currentTimeMinutes = now.getHours() * 60 + now.getMinutes(); 
        const startTimeMinutes = timeToMinutes(props.breakStartTime24Hr); 
        const endTimeMinutes = timeToMinutes(props.breakEndTime24Hr); 
        if (currentTimeMinutes >= endTimeMinutes) {
            setBreakProgress(100);
            setRemBreakTime('00 : 00');
        } else if (currentTimeMinutes >= startTimeMinutes && currentTimeMinutes < endTimeMinutes) {
            const totalTime = endTimeMinutes - startTimeMinutes; 
            const timeElapsed = currentTimeMinutes - startTimeMinutes;
            const timeLeft = totalTime - timeElapsed;
            const timeLeftInHours = convertMinutesToHours(timeLeft);
            setRemBreakTime(timeLeftInHours);
            const percentage = (timeElapsed / totalTime) * 100;
            setBreakProgress(percentage);
        } else {
            const totalTime = endTimeMinutes - startTimeMinutes;
            const timeLeftInHours = convertMinutesToHours(totalTime);
            setRemBreakTime(timeLeftInHours);
            setBreakProgress(0);
        };
    }

    const getSessionBackgroundColor = () => {
        if(progress==100){
            return "black"
        } else if(progress==0){
            return "rgb(255, 255, 144)"
        } else {
            return "orange"
        }
    };

    const getBreakBackgroundColor = () => {
        if(breakProgress==100){
            return "black"
        }else if(breakProgress==0){
            return "rgb(255, 255, 144)"
        } else {
            return "orange"
        }
    };

    function breakQuote(){
        const now = new Date();
        const currentTimeMinutes = now.getHours() * 60 + now.getMinutes(); 
        const startTimeMinutes = timeToMinutes(props.breakStartTime24Hr); 
        const endTimeMinutes = timeToMinutes(props.breakEndTime24Hr); 
        if(remBreakTime=="00 : 00"){
            return "Break completed!"
        } else if(currentTimeMinutes<startTimeMinutes) {
            return "Break yet to begin!"
        } else {
            return "Take a break!"
        }
    }

    function activityTab(element, idx){
        return (
            <div key={`actName-${idx}`} className="sessionActNames" style={{textAlign:"center", border:"0.1px solid black", backgroundColor:element[1], color:"white", fontSize:"12px"}}>{element[0]}</div>
        )
    }

    function stimerBgImage(){
        const now = new Date();
        const ct = now.getHours() * 60 + now.getMinutes();
        const st = timeToMinutes(props.startTime24Hr); 
        const et = timeToMinutes(props.endTime24Hr); 
        if(ct >= st && ct < et){
            return 'linear-gradient(to right ,rgb(42, 42, 243), rgba(144, 10, 144, 0.925))'
        } else if(remBreakTime=="00 : 00"){
            return 'linear-gradient(to right, grey, lightgray, grey)'
        } return '';
    }

    function stimerColor(){
        const now = new Date();
        const ct = now.getHours() * 60 + now.getMinutes();
        const st = timeToMinutes(props.startTime24Hr); 
        const et = timeToMinutes(props.endTime24Hr); 
        if((ct >= st && ct <= et) || ct<st){
            return 'white'
        } else {
            return 'black'
        }
    }

    function btimerBgImage(){
        const now = new Date();
        const ct = now.getHours() * 60 + now.getMinutes();
        const st = timeToMinutes(props.breakStartTime24Hr); 
        const et = timeToMinutes(props.breakEndTime24Hr); 
        if(ct >= st && ct < et){
            return 'linear-gradient(to right ,rgb(42, 42, 243), rgba(144, 10, 144, 0.925))'
        } else if(remBreakTime=="00 : 00"){
            return 'linear-gradient(to right, grey, lightgray, grey)'
        } return '';
    }

    function btimerColor(){
        const now = new Date();
        const ct = now.getHours() * 60 + now.getMinutes();
        const st = timeToMinutes(props.breakStartTime24Hr); 
        const et = timeToMinutes(props.breakEndTime24Hr); 
        if((ct >= st && ct < et) || ct<st){
            return 'white'
        } else {
            return 'black'
        }
    }

    useEffect(() => {
        updateProgress();
        updateBreakProgress();
        const interval1 = setInterval(updateProgress, 15000); 
        const interval2 = setInterval(updateBreakProgress, 15000); 
        return () => {
            clearInterval(interval1);
            clearInterval(interval2);
        };
    }, [props.startTime, props.endTime]);

    return (
    <>
    <div className="sessionAndBreakContainer">
        <div className={`session-${props.id} sessionDefault`}>
            <div className="sessionNo"><p className="sessionNoText">Session-{props.session}</p></div>
            <div className={`session-c-1-${props.id} sessionSubTab1`}>
                {props.activityNames.length==0? 
                <div className="testClass">
                 No activities scheduled at this time
                </div>:
                <div className="sessionActivities">
                    {props.activityNames.map(activityTab)}
                </div> }
                <div className="timeContainer">
                    <div className="timer" style={{color:stimerColor(), backgroundImage:stimerBgImage()}}><span style={{fontSize:"10px", color:stimerColor()}}>Time Left</span>{remTime}</div>
                </div>
            </div>
            <div className={`session-c-2-${props.id} sessionSubTab2`}>
                <div className="sessionStartTimeCont">{props.startTime}</div>
                <div className="sessionProgressStatus">
                    <div className="fillBar" style={{width: progress+'%', backgroundColor: getSessionBackgroundColor(), borderRadius:"5px"}}>
                    {(progress>10 && <div className="activityCurrentStatus1" style={{backgroundColor:"white"}}>{progress==100 && <img className="activityStatusImg1" src='./assets/greenok.svg' alt="activityStatus" />}</div>)}
                    </div>
                </div>
                <div className="sessionEndTimeCont">{props.endTime}</div>
            </div>
        </div>
        <div className="breakContainer">
            <div><p className="breakNo">Break-{props.session}</p></div>
            <div className={`session-c-2-${props.id} sessionSubTab1 breakSubT1`}>
                <div className="breakQuote">
                    <div className="quote">{breakQuote()}</div>
                </div>
                <div className="timeContainer">
                <div className="timer" style={{color:btimerColor(), backgroundImage:btimerBgImage()}}><span style={{fontSize:"10px", color:btimerColor()}}>Time Left</span>{remBreakTime}</div>
                </div>
            </div>
            <div className={`session-c-2-${props.id} sessionSubTab2 breakSubT2`}>
                <div className="sessionStartTimeCont">{props.breakStartTime}</div>
                <div className="sessionProgressStatus">
                    <div className="fillBar" style={{width: breakProgress+'%', backgroundColor: getBreakBackgroundColor(), borderRadius:"5px"}}>
                    {(breakProgress>10 && <div className="activityCurrentStatus1" style={{backgroundColor:"white"}}> {breakProgress==100 && <img className="activityStatusImg1" src='./assets/greenok.svg' alt="activityStatus" />}</div>)}
                    </div>
                </div>
                <div className="sessionEndTimeCont">{props.breakEndTime}</div>
            </div>
        </div>
    </div>
    </>
    )
 }