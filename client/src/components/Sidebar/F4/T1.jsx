import featuresTabHook from "../../Noncomponents";
import { timeToMinutes } from "../../Noncomponents";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title} from 'chart.js';
import { useContext, useEffect, useRef} from 'react';
import { Doughnut } from 'react-chartjs-2';
import { minutesToHours } from "../../Noncomponents";
import { apiUrl } from "../../Noncomponents";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export default function T1(){
    const {state, takeAction} = useContext(featuresTabHook);
    const actData = state.combinedActivityData;
    var lowPriority  = 0
    var midPriority = 0
    var highPriority = 0
    var lowPriorityTime = 0
    var midPriorityTime = 0
    var highPriorityTime = 0
    const actColors = ['red', 'yellow', 'green'];
    const isFirstRender = useRef(true);

    actData.forEach(element => {
        let p = element.activity_priority
        if(p>=1 && p<=2){
            highPriority +=1
            highPriorityTime +=  (timeToMinutes(element.activity_end_time) - timeToMinutes(element.activity_start_time));
        } else if (p>=3 && p<=6){
            midPriority +=1
            midPriorityTime +=  (timeToMinutes(element.activity_end_time) - timeToMinutes(element.activity_start_time));
        } else {
            lowPriority +=1
            lowPriorityTime +=  (timeToMinutes(element.activity_end_time) - timeToMinutes(element.activity_start_time));
        }
    });
    const actCount = ["Total Activities: " + highPriority + ", \n Total Time: " + minutesToHours(highPriorityTime), "Total Activities: " + midPriority + ", \n Total Time: " + minutesToHours(midPriorityTime), "Total Activities: " + lowPriority + ", \n Total Time: " + minutesToHours(lowPriorityTime)];
    const actTime = [highPriorityTime, midPriorityTime, lowPriorityTime];

    async function alterData(){
        const combinedAct = await apiUrl.get(`/combined-activities/${state.emailId}`);
        takeAction({type:"changeCombinedActivityData", payload: combinedAct.data})
      };

    const data = {
    labels: ['High Priority (1-2)', 'Mid Priority (3-6)', 'Low Priority (7-10)'], 
    datasets: [{
            label: 'Activities',
            data: actTime,
            backgroundColor: actColors,
            borderWidth: 2,
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
                    generateLabels: function (){
                        const labels = [
                            { text: 'High', fillStyle: 'red', fontColor:state.darkMode? 'white' : 'rgb(48,48,48)', padding: 20, borderColor:'red'},
                            { text: 'Mid', fillStyle: 'yellow', fontColor:state.darkMode? 'white' : 'rgb(48,48,48)', padding: 20, borderColor:'yellow'},
                            { text: 'Low', fillStyle: 'green', fontColor:state.darkMode? 'white' : 'rgb(48,48,48)', padding: 20, borderColor:'green'}
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
            }
        },
        elements: {
            arc: {
                borderColor: [actColors]
            }
        },
    };

    useEffect(() => {
        if (isFirstRender.current) {
          isFirstRender.current = false;
        } else {
          alterData()};
        },[state.updateActivity]);

    return ( state.trend=="0" &&
        <div className='tnpT1' style={{width:"80vw", height:"70vh", position:"fixed", left:"38vw", top:"25vh", overflow:"clip"}}>
            <Doughnut
                data={data}
                options={options}
            />
        </div>
    );
};