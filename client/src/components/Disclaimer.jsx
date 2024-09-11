import { useContext } from "react"
import featuresTabHook from "./Noncomponents";

export default function Disclaimer(props){
    const {state, takeAction} = useContext(featuresTabHook);
    function deleteActivity(event){
        event.preventDefault();
        takeAction({type:"changeActivityState", payload:true});
        takeAction({type:"changeDisclaimerState", payload:false});
        takeAction({type:"changeDisclaimerButtons"});
        state.resolve(true);
    }
    function preventDeleteActivity(event){
        event.preventDefault();
        takeAction({type:"changeDisclaimerState", payload:false});
        takeAction({type:"changeDisclaimerButtons"});
        state.resolve(false);
    }
    return ( state.disclaimerState &&
        <div className="disclaimerContainer" style={{height: state.disclaimerButtons? "150px": "100px", width: state.disclaimerButtons? "300px":"200px"}}>
            {state.disclaimerButtons && 
            <div className="disclaimerTitle">
                <p id="staticDisclaimer">Disclaimer</p>
            </div>}
            <div className="disclaimerAction">
            <p className="disclaimerContent">
                {props.message}
            </p>
            {state.disclaimerButtons && 
            <div className="criticalOps" style={{width: state.disclaimerButtons? "300px":"200px"}}>
                <button className="criticalButton yesButton" onClick={(event) => {deleteActivity(event)}}>yes</button>
                <button className="criticalButton noButton" onClick={(event) => {preventDeleteActivity(event)}}>no</button>
            </div>}
            </div>
        </div>
    );
};