import { useContext, useRef} from "react";
import featuresTabHook from "../../Noncomponents";

export default function Trendtab(props) {
    const { state, takeAction } = useContext(featuresTabHook);
    const trendTabRef = useRef(null);
    function handleClick() {
        takeAction({type:"changeTrend", payload:trendTabRef.current.id})
    };
    function selectInitial(){
        if (trendTabRef.current && state.trend == trendTabRef.current.id) {
            return "specialTab";
        } 
        return "";
    };
    return (
        <div className={`weekTabs ${selectInitial()}`} id={props.index} ref={trendTabRef} style={{textAlign:"center", alignItems:"center", justifyContent:"center", fontSize:"16px"}} onClick={handleClick}>
            <p className="paTab Date">{props.trend}</p>
        </div>
    );
};
