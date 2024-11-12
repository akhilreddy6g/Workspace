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
            <div><p style={{textAlign:"center", margin:"0", backgroundColor:"rgb(255,255,144)", color: "black", borderTopRightRadius:"10px", borderTopLeftRadius:"10px", width:"299px", height:"20px"}}>Session-{props.session}</p></div>
            <div className={`session-c-1-${props.id} sessionSubTab1`}>
                {props.activityNames.length==0? 
                <div className="testClass" style={{color:"white", textAlign:"center", display:"flex", alignSelf:"center"}}>
                 No activities scheduled at this time
                </div>:
                <div style={{display:"flex", flexDirection:"column", height:"60px", width:"225px", overflow:"scroll", gap:"2px"}}>
                    {props.activityNames.map(activityTab)}
                </div> }
                <div style={{display:"flex", justifyContent:"center", alignContent:"center", width:"74px", height:"60px", color:"black"}}>
                    <div style={{textAlign:"center", backgroundColor:"teal", display:"flex", flexDirection:"column", width:"75px", height:"59px", alignItems:"center", justifyContent:"center", borderLeft:"0.1px solid black", color:stimerColor(), backgroundImage:stimerBgImage()}}><span style={{fontSize:"10px", color:stimerColor()}}>Time Left</span>{remTime}</div>
                </div>
            </div>
            <div className={`session-c-2-${props.id} sessionSubTab2`}>
                <div style={{textAlign:"center", backgroundColor:"rgb(255,255,144)", color:"black", width:"85px", borderBottomLeftRadius:"10px", fontSize:"12px"}}>{props.startTime}</div>
                <div style={{width:"120px", height:"12px", borderRadius:"5px", backgroundColor:"rgb(255,255,144)", boxShadow: "0 0 0.1px black", border:"0.1px solid black", display:"flex", alignSelf:"center"}}>
                    <div className="fillBar" style={{width: progress+'%', backgroundColor: getSessionBackgroundColor(), borderRadius:"5px"}}>
                    {(progress>10 && <div className="activityCurrentStatus1" style={{backgroundColor:"white"}}></div>)}
                    {progress==100 && <img className="activityStatusImg1" src='./assets/greenok.svg' alt="activityStatus" />}
                    </div>
                </div>
                <div style={{textAlign:"center", backgroundColor:"rgb(255,255,144)", color:"black", width:"85px", borderBottomRightRadius:"10px", fontSize:"12px"}}>{props.endTime}</div>
            </div>
        </div>
        <div className="breakContainer">
            <div><p style={{textAlign:"center", margin:"0", backgroundColor:"rgb(255,255,144)", color: "black", borderTopRightRadius:"10px", borderTopLeftRadius:"10px", width:"299px", height:"20px"}}>Break-{props.session}</p></div>
            <div className={`session-c-2-${props.id} sessionSubTab1 breakSubT1`}>
                <div style={{display:"flex", flexDirection:"column", width:"225px", height:"60px", justifyContent:"center", overflow:"scroll", gap:"2px"}}>
                    <div style={{textAlign:"center", display:"flex", alignSelf:"center"}}>{breakQuote()}</div>
                </div>
                <div style={{display:"flex", justifyContent:"center", alignContent:"center", width:"74px", height:"60px", color:"black"}}>
                <div style={{textAlign:"center", backgroundColor:"teal", display:"flex", flexDirection:"column", width:"75px", height:"59px", alignItems:"center", justifyContent:"center", borderLeft:"0.1px solid black",color:btimerColor(), backgroundImage:btimerBgImage()}}><span style={{fontSize:"10px", color:btimerColor()}}>Time Left</span>{remBreakTime}</div>
                </div>
            </div>
            <div className={`session-c-2-${props.id} sessionSubTab2 breakSubT2`}>
                <div style={{textAlign:"center", backgroundColor:"rgb(255,255,144)", color:"black", width:"85px", borderBottomLeftRadius:"10px", fontSize:"12px"}}>{props.breakStartTime}</div>
                <div style={{width:"120px", height:"12px", borderRadius:"5px", backgroundColor:"rgb(255,255,144)", boxShadow: "0 0 0.1px black", border:"0.1px solid black", display:"flex", alignSelf:"center"}}>
                    <div className="fillBar" style={{width: breakProgress+'%', backgroundColor: getBreakBackgroundColor(), borderRadius:"5px"}}>
                    {(breakProgress>10 && <div className="activityCurrentStatus1" style={{backgroundColor:"white"}}></div>)}
                    {breakProgress==100 && <img className="activityStatusImg1" src='./assets/greenok.svg' alt="activityStatus" />}
                    </div>
                </div>
                <div style={{textAlign:"center", backgroundColor:"rgb(255,255,144)", color:"black", width:"85px", borderBottomRightRadius:"10px", fontSize:"12px"}}>{props.breakEndTime}</div>
            </div>
        </div>
    </div>
    </>
    )
 }