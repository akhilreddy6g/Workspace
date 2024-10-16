import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title} from 'chart.js';
import featuresTabHook from './Noncomponents';
import { useContext, useEffect, useRef, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { timeToMinutes, currentTimeInMinutes } from './Noncomponents';
import axios from 'axios';
import { convertTimeToAmPm } from './Noncomponents';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

function getColor(status, startTime, endTime, statusList) {
    if (status === 0) {
        statusList.push("Skipped");
        return "red";
    } else if (status === 1) {
        statusList.push("Completed");
        return 'green';
    } else if (status === null && startTime < currentTimeInMinutes() && currentTimeInMinutes() < endTime) {
        statusList.push("In Progress");
        return 'orange';
    } else if (status === null) {
        statusList.push("Not Yet Started");
        return 'white';
    }
}

export function Target() {
    const {state, takeAction} = useContext(featuresTabHook);
    const actdata = state.combinedActivityData;
    const actNames = [];
    const actColors = [];
    const actStatus = [];
    const actTime = [];
    const timePeriod = [];
    const borderColors = [];
    var count = 0;
    const isFirstRender = useRef(true);

    actdata.forEach((element, index) => {
        actNames.push((index+1) + ". " + element.activity_name);
        actColors.push(getColor(element.activity_status, timeToMinutes(element.activity_start_time), timeToMinutes(element.activity_end_time), actStatus));
        actTime.push(timeToMinutes(element.activity_end_time) - timeToMinutes(element.activity_start_time));
        if(element.activity_status==1){
            count+=1;
        };
        let t1 = convertTimeToAmPm(element.activity_start_time);
        let t2 = convertTimeToAmPm(element.activity_end_time);
        timePeriod.push(`${t1} - ${t2}`);
        element.activity_type=='c'? borderColors.push('black') : borderColors.push('teal')
    });

    async function alterData(){
        const combinedAct = await axios.get("http://localhost:3000/combined-activities");
        takeAction({type:"changeCombinedActivityData", payload: combinedAct.data})
      };

    const data = {
        labels: timePeriod, 
        datasets: [
            {
                label: 'Activities',
                data: actTime,
                backgroundColor: actColors, 
                borderWidth: 2,

            }
        ]
    };
    
    const options = {
        responsive: true,
        cutout: "0%",
        plugins: {
            title: {
                display: true,
                text: `${count}/${state.combinedActivityData.length} Completed`,
                color: state.darkMode? 'white' : 'black',
                font: {
                    size: 18,  
                    align: 'center'
                }},
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    generateLabels: function (chart) {
                        const labels = [
                            { text: 'Completed', fillStyle: 'green', fontColor:state.darkMode? 'white' : 'rgb(48,48,48)', padding: 20, borderColor:'green'},
                            { text: 'Skipped', fillStyle: 'red', fontColor:state.darkMode? 'white' : 'rgb(48,48,48)', padding: 20, borderColor:'red'},
                            { text: 'Not Yet Started', fillStyle: 'white', fontColor:state.darkMode? 'white' : 'rgb(48,48,48)', padding: 20, borderColor:'white'},
                            { text: 'In Progress', fillStyle: 'orange', fontColor:state.darkMode? 'white' : 'rgb(48,48,48)', padding: 20, borderColor:'orange'}
                        ];
                        return labels;
                    },
                    fontColor: 'white',

                }
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return ` ${actNames[tooltipItem.dataIndex]} -> ${actStatus[tooltipItem.dataIndex]}`;
                    }
                }
            }
        },
        elements: {
            arc: {
                borderColor: borderColors
            }
        },
    };

    useEffect(() => {
        if (isFirstRender.current) {
          isFirstRender.current = false;
        } else {
          alterData()};
        },[state.updateActivity]);  

    return (
        <div className='currentTarget' style={{width:"85vw", height:"85vh", position:"fixed", left:"28vw", top:"10vh", overflow:"clip"}}>
            <Doughnut
                data={data}
                options={options}
            />
        </div>
    );
};