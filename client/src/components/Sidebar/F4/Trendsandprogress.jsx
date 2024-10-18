import Trendtab from "./Trendtab"
import featuresTabHook from "../../Noncomponents";
import { useContext } from "react";
import T1 from "./T1";

export default function Trendsandprogress(){
    var trends = [{trend: 'Time Sceduled based on Activity Priority', index: 0}, {trend: 'No of Activities Completed, Skipped, and Missed Over Time', index: 1}, {trend: 'Daily Activity Streak', index: 2}, 
    {trend: 'Activities Scheduled vs Activities Completed on Time', index:3}, {trend: 'Productivity Levels', index:4}, {trend:'Missed Activities Over Time', index:5}, {trend: 'Daily Activities Completed Over Time', index:6}]
    const {state, takeAction} = useContext(featuresTabHook);

    function mapping(object){
        return(
            <Trendtab key={object.trend} trend={object.trend} index={object.index}/>
        );
    }

    return (
        <>
        <div className={`trends ${state.fthState? "planAhead1" : "planAhead2"}`} style={{display:"flex", flexDirection:"row", height:"25vh", width:"80vw", top:"90px", position:'fixed', gap:"10px", transition:"150ms linear"}}>
            {trends.map(mapping)}
        </div>
        <T1></T1>
        </>
    )
}