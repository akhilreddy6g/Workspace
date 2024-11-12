import React, { useEffect, useContext, useState } from 'react';
import featuresTabHook from '../../Noncomponents';
import { apiUrl } from '../../Noncomponents';
import { BarChart } from '@mui/x-charts/BarChart';

export default function T3() {
    const [actData, changeData] = useState([]);
    const [actDates, changeDates] = useState([]);
    const { state } = useContext(featuresTabHook);
    const [filter, changeFilter] = useState(7);
    const [activity, changeActivity] = useState(null);
    const [actStreaks, changeStreak] = useState(null);
    const [loading, setLoading] = useState(true); 
    
    async function alterData(days) {
        try {
            setLoading(true); 
            const sessionMail = sessionStorage.getItem('email');
            const mail = state.emailId || sessionMail;
            const response = await apiUrl.get(`/user-da-progress/${mail}?days=${days}`);
            const unqDates = response.data.distDates;
            const lastDate = response.data.lastDate;
            const unqActivities = response.data.distActivities;
            const allActivities = response.data.all;
            const streaks = calculateStreaks(unqActivities, allActivities);
            changeStreak(streaks);
            let finalData = new Map();
            changeData(unqActivities);
            let unqActBook = {};
            unqActivities.forEach((element, index) => {
                unqActBook[element.activity_name] = index + 1;
            });
            allActivities.forEach(element => {
                const index = unqActBook[element.activity_name];
                const dateKey = element.date_completed.split("T")[0];
                if (!finalData.has(dateKey)) {
                    finalData.set(dateKey, []);
                }
                finalData.get(dateKey).push(index);
            });
            const sortedData = Array.from(finalData, ([date, activities]) => ({ date, activities })).sort((a, b) => new Date(b.date) - new Date(a.date));
            changeDates(sortedData);
        } catch (error) {
            console.error("Error fetching user daily progress", error);
        } finally {
            setLoading(false); 
        } 
    }

    function calculateStreaks(unqActivities, allActivities) {
        const streaks = {};
        unqActivities.forEach(activity => {
            streaks[activity.activity_name] = { currentStreak: 0, maxStreak: 0 };
        });
        const activityDates = {};
        allActivities.forEach(activity => {
            const { activity_name, date_completed } = activity;
            if (!activityDates[activity_name]) {
                activityDates[activity_name] = [];
            }
            activityDates[activity_name].push(new Date(date_completed));
        });
        Object.keys(activityDates).forEach(activityName => {
            const dates = activityDates[activityName].sort((a, b) => b - a);
            let currentStreak = 0;
            let maxStreak = 0;
            let streakCount = 1;
            let now = new Date();
            let currDate = null;
            let prevDate = null;
            let currDay = null;
            let prevDay = null;
            now.setHours(now.getHours()-4);
            now.setDate(now.getDate()-1);
            let yesterday = now;
            let flag = false;
            if (yesterday.getUTCDate() == dates[0].getUTCDate()){
                flag = true
            } else {
                currentStreak = 0
            }
            for (let i = 0; i < dates.length; i++) {
                if(i==0){
                    prevDate = dates[i];
                }
                else{
                    currDate = new Date(dates[i]);
                    currDate.setDate(currDate.getDate()+1);
                    currDay = currDate.getUTCDate();
                    prevDay = prevDate.getUTCDate();
                    if(prevDay==currDay){
                        streakCount++;
                    } else{
                        if(flag){
                            currentStreak = streakCount;
                            flag = false;
                        }
                        maxStreak = Math.max(maxStreak, streakCount);
                        streakCount = 1; 
                    }
                    prevDate = dates[i];
                }
            }
            maxStreak = Math.max(maxStreak, streakCount);
            streaks[activityName].maxStreak = maxStreak;
            streaks[activityName].currentStreak = flag? maxStreak : currentStreak;
        });
        return streaks;
    };
    
    function changeNo(newNo){
        if (newNo==activity){
            changeActivity(null);
        } else {
            changeActivity(newNo);
        }
    }

    function streakTabMapping(element, index){
        return <div key={`activity-${index}-${element}`} className={`activity-${index}-${element} ${element==activity && "specialTab1"} defaultSTM`} onClick={()=>{changeNo(element)}} style={{border: state.darkMode? '1px solid white' : '1px solid black'}}>{element}</div>
    }

    function datesMapping(element, index) {
        return (
            <div key={"dateTab" + element.date} className={`dateTab${element.date} ${element.activities.includes(activity) && "specialTab2"} defaultDT`} style={{border: state.darkMode? '0.1px solid white' : '0.1px solid black'}}>
                <div key={"dindex" + index} className={`dindex-${index} defaultDI`} style={{color: state.darkMode ? 'white' : 'black'}}>{index + 1} </div>
                <div key={"date"+ element.date} className={`date-${element.date} defaultD`} style={{color: state.darkMode ? 'white' : 'black'}}>{element.date}</div>
                <div key={"streakOn" + element.date} className={`streakOn-${element.date} streakActNum`} style={{color: state.darkMode ? 'white' : 'black'}}>{element.activities.map(streakTabMapping)}</div>
            </div>
        );
    }

    function activitiesMapping(element, index){
        return (<div key={"streakTab" + index} className={`streakTab-${index} ${index+1==activity && "specialTab1"} defaultST`} onClick={()=>{changeNo(index+1)}} style={{border: state.darkMode? '0.1px solid white' : '0.1px solid black'}}>
        <div key={'aindex' + index} className={`aindex-${index} defaultAI`} style={{color: ( state.darkMode) ? 'white' : 'black'}}>{index+1}</div>
        <div key={'activityElement' + index} className={`activityElement-${index} defaultAE`} style={{color: state.darkMode ? 'white' : 'black'}}>{element.activity_name}</div>
        </div>)
    }

    useEffect(() => {
        if (state.trend === "2") {
            alterData(filter);
        }
    }, [state.trend, filter]);

    if (loading) {
        return <div className={`loadingSpinner ${state.fthState ? "scheduleDisclaimer1" : "scheduleDisclaimer2"}`} ><p className="loadingText" style={{color: state.darkMode? 'white' : 'black'}}>Loading, please wait...</p></div>;
    }

    return (
        state.trend === "2" && (actData && actData.length > 0 ? (
                <>
                <div className='t3FilterContainer'>
                    <select name="t3Filter" id="t3FilterIpBox" onChange={(e) => {
                        const value = e.target.value;
                        changeFilter(value);
                    }}>
                        <option value={7}>Last week</option>
                        <option value={30}>Last month</option>
                        <option value={90}>Last 3 months</option>
                        <option value={180}>Last 6 months</option>
                        <option value={365}>Last year</option>
                        <option value="Max">Max</option>
                    </select>
                </div>
                { activity!=null &&
                <div className='streakStats' style={{color: state.darkMode? "white" : "black"}}>
                <p style={{border: state.darkMode? "0.1px solid white" : "0.1px solid black", backgroundColor: actStreaks[actData[activity-1].activity_name].currentStreak>0 && "green"}}> Current Streak: {actStreaks!=null && actData!=null && activity!= null && actStreaks[actData[activity-1].activity_name].currentStreak} </p>
                <p style={{border: state.darkMode? "0.1px solid white" : "0.1px solid black"}}> Max Streak: {actStreaks!=null && actData!=null && activity!= null && actStreaks[actData[activity-1].activity_name].maxStreak} </p>
                </div>
                }
                <div className='tnpT3' style={{left:"18.5vw", border: `0.1 px solid ${state.darkMode? "white": "black"}`}}>
                    <div className='streakContainer-1'>
                        <div className='headingContainerInitial'>
                            <div className='headingElement-1'>S.No</div>
                            <div className='headingElement-2'>Date</div>
                            <div className='headingElement-3'>Activities Completed</div>
                        </div>
                        {actDates!=null && actDates.length>0 && actDates.map(datesMapping)}
                    </div>
                    <div className='streakContainer-2'>
                        <div className='headingContainerFinal'>
                            <div className='headingElement-4'>S.No</div>
                            <div className='headingElement-5'>Activity Name</div>
                        </div>
                        {actData!=null && actData.length>0 && actData.map(activitiesMapping)}
                    </div>
                </div>
                <div
                    className='t3barChart'
                    >
                    <BarChart
                        xAxis={[
                            {
                                scaleType: 'band',
                                data: Object.keys(actStreaks),
                                label: 'Activities',
                                labelStyle: { fill: state.darkMode? 'white' : 'black' }, 
                                tickLabelStyle: { fill: state.darkMode? 'white' : 'black' }, 
                            }
                        ]}
                        yAxis={[
                            {
                                label: "No of Days",
                                labelStyle: { fill: state.darkMode? 'white' : 'black' }, 
                                tickLabelStyle: { fill: state.darkMode? 'white' : 'black' }, 
                            }
                        ]}
                        series={[
                            {
                                label: "Max Streak",
                                labelStyle: { fill: state.darkMode? 'white' : 'black' }, 
                                name: 'Max Streak',
                                data: Object.keys(actStreaks).map((key) => actStreaks[key].maxStreak), 
                                color: 'orangered',
                            },
                            {
                                label: "Current Streak",
                                labelStyle: { fill: state.darkMode? 'white' : 'black' }, 
                                name: 'Current Streak',
                                data: Object.keys(actStreaks).map((key) => actStreaks[key].currentStreak),
                                color: 'green',
                            }
                        ]}
                        width={1000}
                        height={300}
                    />
                </div>
            </>
            ) : ( <>
                    <div className={`scheduleDisclaimer`} style={{left: state.fthState? "16.5vw" : "9.5vw", top:"185px"}}>
                        <p className="scheduleContext">Schedule Activities Regularly to View this Trend</p>
                    </div>
            </> ))
    );
}
