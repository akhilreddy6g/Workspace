import featuresTabHook from "../../Noncomponents";
import { useContext, useState, useEffect } from "react";
import { timeToMinutes } from "../../Noncomponents";

export default function Session(props){
    const {state, takeAction} = useContext(featuresTabHook);
    const [hover, setHover] = useState(false);
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

    function updateBreakProgress() {
        const now = new Date();
        const currentTimeMinutes = now.getHours() * 60 + now.getMinutes(); 
        const startTimeMinutes = timeToMinutes(props.breakStartTime24Hr); 
        const endTimeMinutes = timeToMinutes(props.breakEndTime24Hr); 
        if (currentTimeMinutes >= endTimeMinutes) {
            setBreakProgress(100);
            setRemBreakTime('00 : 00');
        } else if (currentTimeMinutes >= startTimeMinutes && currentTimeMinutes <= endTimeMinutes) {
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
                return '/greenok.svg';
            } else if (parsedItem.action === "skip") {
                return '/redclose.svg';
            }
        }
        if (props.status == "0") {
            return '/redclose.svg';
        } else if (props.status == "1") {
            return '/greenok.svg';
        }
    }

    // function handleMouseEnter() {
    //     setHover(true); 
    // }

    // function handleMouseLeave() {
    //     setHover(false); 
    // }

    function breakQuote(){
        const now = new Date();
        const currentTimeMinutes = now.getHours() * 60 + now.getMinutes(); 
        const startTimeMinutes = timeToMinutes(props.breakStartTime24Hr); 
        const endTimeMinutes = timeToMinutes(props.breakEndTime24Hr); 
        if(remBreakTime=="00 : 00"){
            return "Break Completed!"
        } else if(currentTimeMinutes<startTimeMinutes) {
            return "Break Yet to Begin!"
        } else {
            return "Take, a Break and Rest Well Champ!"
        }
    }
    
    useEffect(() => {
        updateProgress();
        updateBreakProgress();
        const intervalId = setInterval(updateProgress, 15000); 
        return () => clearInterval(intervalId);
    }, [props.startTime, props.endTime]);

    return (
    <>
    <div className="sessionAndBreakContainer">
        <div className={`session-${props.id} sessionDefault`}>
            <div><p style={{textAlign:"center", margin:"0", backgroundColor:"rgb(255,255,144)", color: "black", borderTopRightRadius:"10px", borderTopLeftRadius:"10px", width:"299px", height:"20px"}}>Session-{props.session}</p></div>
            <div className={`session-c-1-${props.id} sessionSubTab1`}>
                <div style={{display:"flex", flexDirection:"column", height:"60px", width:"225px", overflow:"scroll"}}>
                    <div style={{textAlign:"center"}}>Act1</div>
                    <div style={{textAlign:"center"}}>Act2</div>
                </div>
                <div style={{display:"flex", justifyContent:"center", alignContent:"center", width:"74px", height:"60px", color:"black"}}>
                    <div style={{textAlign:"center", backgroundColor:"orangered", display:"flex", flexDirection:"column", width:"75px", height:"60px", alignItems:"center", justifyContent:"center"}}><span style={{fontSize:"10px"}}>Time Left</span>{remTime}</div>
                </div>
            </div>
            <div className={`session-c-2-${props.id} sessionSubTab2`}>
                <div style={{textAlign:"center", backgroundColor:"rgb(255,255,144)", color:"black", width:"85px", borderBottomLeftRadius:"10px", fontSize:"12px"}}>{props.startTime}</div>
                <div style={{width:"120px", height:"8px", borderRadius:"5px", backgroundColor:"rgb(255,255,144)", boxShadow: "0 0 3px black" , display:"flex", alignSelf:"center"}}></div>
                <div style={{textAlign:"center", backgroundColor:"rgb(255,255,144)", color:"black", width:"85px", borderBottomRightRadius:"10px", fontSize:"12px"}}>{props.endTime}</div>
            </div>
        </div>
        <div className="breakContainer">
            <div><p style={{textAlign:"center", margin:"0", backgroundColor:"rgb(255,255,144)", color: "black", borderTopRightRadius:"10px", borderTopLeftRadius:"10px", width:"299px", height:"20px"}}>Break-{props.session}</p></div>
            <div className={`session-c-2-${props.id} sessionSubTab1 breakSubT1`}>
                <div style={{display:"flex", flexDirection:"column", width:"225px", height:"60px", justifyContent:"center", overflow:"scroll"}}>
                    <div style={{textAlign:"center", display:"flex", alignSelf:"center"}}>{breakQuote()}</div>
                </div>
                <div style={{display:"flex", justifyContent:"center", alignContent:"center", width:"74px", height:"60px", color:"black"}}>
                <div style={{textAlign:"center", backgroundColor:"orangered", display:"flex", flexDirection:"column", width:"75px", height:"60px", alignItems:"center", justifyContent:"center"}}><span style={{fontSize:"10px"}}>Time Left</span>{remBreakTime}</div>
                </div>
            </div>
            <div className={`session-c-2-${props.id} sessionSubTab2 breakSubT2`}>
                <div style={{textAlign:"center", backgroundColor:"rgb(255,255,144)", color:"black", width:"6vw", borderBottomLeftRadius:"10px", fontSize:"12px"}}>{props.breakStartTime}</div>
                <div style={{width:"8vw", height:"10px", borderRadius:"5px", backgroundColor:"rgb(255,255,144)", boxShadow: "0 0 3px black", display:"flex", alignSelf:"center"}}></div>
                <div style={{textAlign:"center", backgroundColor:"rgb(255,255,144)", color:"black", width:"6vw", borderBottomRightRadius:"10px", fontSize:"12px"}}>{props.breakEndTime}</div>
            </div>
        </div>
    </div>
    </>
    )
 }