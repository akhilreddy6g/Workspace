import Trendtab from "./Trendtab"
import featuresTabHook from "../../Noncomponents";
import { useContext } from "react";
import T1 from "./T1";
import T2 from "./T2";
import T3 from "./T3";

export default function Trendsandprogress(){
    var trends = [{trend: 'Time Sceduled based on Activity Priority', index: 0}, {trend: 'No of Activities Skipped and Completed Over Time', index: 1}, {trend: 'Daily Activity Streak', index: 2}]
    const {state, takeAction} = useContext(featuresTabHook);

    function mapping(object){
        return(
            <Trendtab key={object.trend} trend={object.trend} index={object.index}/>
        );
    }

    return (
        <>
        <div className="tabsContainer">
            <div className="trends">
                {trends.map(mapping)}
            </div>
        </div>
        {state.trend == "0" && <T1></T1>}
        {state.trend == "1" && <T2></T2>}
        {state.trend == "2" && <T3></T3>}
        </>
    )
}