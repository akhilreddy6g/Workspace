import featuresTabHook from "../../Noncomponents";
import { timeToMinutes } from "../../Noncomponents";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { useContext, useEffect, useState} from 'react';
import { Doughnut } from 'react-chartjs-2';
import { minutesToHours } from "../../Noncomponents";
import { apiUrl } from "../../Noncomponents";
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels);

export default function T1() {
    const { state, takeAction } = useContext(featuresTabHook);
    const actData = state.combinedActivityData;
    const [loading, setLoading] = useState(true); 
    var lowPriority = 0;
    var midPriority = 0;
    var highPriority = 0;
    var lowPriorityTime = 0;
    var maxlowPriorityTime = 0;
    var midPriorityTime = 0;
    var maxmidPriorityTime = 0;
    var highPriorityTime = 0;
    var maxhighPriorityTime = 0;
    const actColors = ['red', 'yellow', 'green'];
    
    actData.forEach(element => {
        let p = element.activity_priority;
        if (p >= 1 && p <= 2) {
            highPriority += 1;
            let timePeriod = timeToMinutes(element.activity_end_time) - timeToMinutes(element.activity_start_time);
            highPriorityTime += timePeriod;
            if (maxhighPriorityTime < timePeriod) {
                maxhighPriorityTime = timePeriod;
            }
        } else if (p >= 3 && p <= 6) {
            midPriority += 1;
            let timePeriod = timeToMinutes(element.activity_end_time) - timeToMinutes(element.activity_start_time);
            midPriorityTime += timePeriod;
            if (maxmidPriorityTime < timePeriod) {
                maxmidPriorityTime = timePeriod;
            }
        } else {
            lowPriority += 1;
            let timePeriod = timeToMinutes(element.activity_end_time) - timeToMinutes(element.activity_start_time);
            lowPriorityTime += timePeriod;
            if (maxlowPriorityTime < timePeriod) {
                maxlowPriorityTime = timePeriod;
            }
        }
    });
    
    const actCount = [
        "Total Activities: " + highPriority + ", \n Total Time: " + minutesToHours(highPriorityTime),
        "Total Activities: " + midPriority + ", \n Total Time: " + minutesToHours(midPriorityTime),
        "Total Activities: " + lowPriority + ", \n Total Time: " + minutesToHours(lowPriorityTime)
    ];
    
    const actTime = [maxhighPriorityTime, maxmidPriorityTime, maxlowPriorityTime];
    const totalTime = highPriorityTime + midPriorityTime + lowPriorityTime;
    const actTimePercent = [
        (highPriorityTime / totalTime) * 100,
        (midPriorityTime / totalTime) * 100,
        (lowPriorityTime / totalTime) * 100
    ];

    async function alterData() {
        try {
            setLoading(true); 
            const sessionMail = sessionStorage.getItem('email');
            const mail = state.emailId ? state.emailId : sessionMail;
            const response = await apiUrl.get(`/combined-activities/${mail}`);
            if(response.data.length>0){
                takeAction({ type: "changeCombinedActivityData", payload: response.data });
            }
        } catch (error) {
            console.error("Error fetching combined activities", error);
        } finally {
            setLoading(false); 
        }
    };

    const data = {
        labels: ['High Priority (1-2)', 'Mid Priority (3-6)', 'Low Priority (7-10)'],
        datasets: [{
            label: 'Activities',
            data: actTime,
            backgroundColor: actColors,
            borderWidth: 4,
        }]
    };

    const options = {
        responsive: true,
        cutout: "0%",
        plugins: {
            legend: {
                display: true,
                position: 'right',
                labels: {
                    generateLabels: function () {
                        const labels = [
                            { text: 'High', fillStyle: 'red', fontColor: state.darkMode ? 'white' : 'rgb(48,48,48)', padding: 20, borderColor: 'red' },
                            { text: 'Mid', fillStyle: 'yellow', fontColor: state.darkMode ? 'white' : 'rgb(48,48,48)', padding: 20, borderColor: 'yellow' },
                            { text: 'Low', fillStyle: 'green', fontColor: state.darkMode ? 'white' : 'rgb(48,48,48)', padding: 20, borderColor: 'green' }
                        ];
                        return labels;
                    },
                    fontColor: 'white',
                }
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return ` ${actCount[tooltipItem.dataIndex]}`;
                    }
                }
            },
            datalabels: {
                color: 'black',
                font: {
                    size: 16,
                    weight: 'bold'
                },
                formatter: (value, context) => {
                    const percent = actTimePercent[context.dataIndex];
                    return percent > 0 ? `${percent.toFixed(1)}%` : ''; 
                },                
                listeners: {
                    enter: function (context) {
                        return actCount[context.dataIndex];
                    },
                    leave: function (context) {
                        return `${actTimePercent[context.dataIndex].toFixed(1)}%`;
                    }
                }
            }
        },
        elements: {
            arc: {
                borderColor: state.darkMode ? 'rgb(48, 48, 48)' : 'white'
            }
        }
    };

    useEffect(() => {
        alterData()
    }, [state.updateActivity]);

    if (loading) {
        return <div className={`loadingSpinner ${state.fthState ? "scheduleDisclaimer1" : "scheduleDisclaimer2"}`} ><p className="loadingText" style={{color: state.darkMode? 'white' : 'black'}}>Loading, please wait...</p></div>;
    }

    return (state.trend == "0" && (actData.length > 0 ? (
        <div className='tnpT1'>
            <Doughnut
                data={data}
                options={options}
            />
        </div>
        ) : ( <>
            <div className={`scheduleDisclaimer`} style={{left: state.fthState? "16.5vw" : "9.5vw", top:"185px"}}>
                <p className="scheduleContext">Schedule Activities Regularly to View this Trend</p>
            </div>
        </> ))
    );
};
