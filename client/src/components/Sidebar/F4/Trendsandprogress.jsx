import Trendtab from "./Trendtab"
import featuresTabHook from "../../Noncomponents";
import { useContext } from "react";
import T1 from "./T1";
import T2 from "./T2";
import T3 from "./T3";

export default function Trendsandprogress(){
    var trends = [{trend: 'Time Sceduled based on Activity Priority', index: 0}, {trend: 'No of Activities Skipped and Completed Over Time', index: 1}, {trend: 'Daily Activity Streak', index: 2}, 
    {trend: 'Productivity Levels', index:3}, {trend: 'Activities Scheduled vs Activities Completed on Time', index:4}, {trend:'Missed Activities Over Time', index:5}, {trend: 'Daily Activities Completed Over Time', index:6}]
    const {state, takeAction} = useContext(featuresTabHook);

    function mapping(object){
        return(
            <Trendtab key={object.trend} trend={object.trend} index={object.index}/>
        );
    }

    return (
        <>
        <div className={`trends ${state.fthState? "planAhead1" : "planAhead2"} defaultTrends`} style={{}}>
            {trends.map(mapping)}
        </div>
        {state.trend == "0" && <T1></T1>}
        {state.trend == "1" && <T2></T2>}
        {state.trend == "2" && <T3></T3>}
        </>
    )
}