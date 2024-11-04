import { useContext, useRef} from "react";
import featuresTabHook from "../../Noncomponents";
import { parseLocaleDateString } from "../../Noncomponents";

export default function Weektabs(props) {
    const { state, takeAction } = useContext(featuresTabHook);
    const weekTabRef = useRef(null);
    function handleClick() {
        takeAction({type: "changeActDateTabRef", payload: weekTabRef});
        takeAction({type: "changeActDate", payload: parseLocaleDateString(props.date)});
    };
    function selectInitial(){
        const propsDate = new Date(props.date).toLocaleDateString('en-CA');
        const actDate = new Date(state.actDate).toLocaleDateString('en-CA'); 
        if (propsDate === actDate) {
            return "specialTab";
        };
        return "";
    };
    return (
        <div className={`weekTabs ${selectInitial()}`} ref={weekTabRef} onClick={handleClick}>
            <p className="paTab Date">{props.date}</p>
            <p className="paTab Day">{props.day}</p>
        </div>
    );
};
