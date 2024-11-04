import { useContext, useEffect, useRef } from "react";
import featuresTabHook from "../../Noncomponents";

export default function Trendtab(props) {
    const { state, takeAction } = useContext(featuresTabHook);
    const trendTabRef = useRef(null);

    useEffect(() => {
        if (trendTabRef.current && state.trend == props.index) {
            trendTabRef.current.classList.add("specialTab");
        } else if (trendTabRef.current) {
            trendTabRef.current.classList.remove("specialTab");
        }
    }, [state.trend, props.index]);

    function handleClick() {
        takeAction({ type: "changeTrend", payload: trendTabRef.current.id});
    }

    return (
        <div
            className="weekTabs"
            id={props.index}
            ref={trendTabRef}
            onClick={handleClick}
        >
            <p className="paTab Date">{props.trend}</p>
        </div>
    );
}
