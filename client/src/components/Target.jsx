import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title} from 'chart.js';
import featuresTabHook from './Noncomponents';
import { useContext, useEffect, useState} from 'react';
import { Doughnut } from 'react-chartjs-2';
import { timeToMinutes, currentTimeInMinutes } from './Noncomponents';
import { apiUrl } from './Noncomponents';
import { convertTimeToAmPm } from './Noncomponents';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

function getColor(status, startTime, endTime, statusList) {
    if (status == 0) {
        statusList.push("Skipped");
        return "red";
    } else if (status == 1) {
        statusList.push("Completed");
        return 'green';
    } else if (status == null && startTime < currentTimeInMinutes() && currentTimeInMinutes() < endTime) {
        statusList.push("In Progress");
        return 'orange';
    } else if (status == null) {
        statusList.push("Not Yet Started");
        return 'black';
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
    const [loading, setLoading] = useState(true); 

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
        try {
            setLoading(true); 
            const sessionMail = sessionStorage.getItem('email');
            const mail = state.emailId? state.emailId : sessionMail
            const combinedAct = await apiUrl.get(`/combined-activities/${mail}`);
            takeAction({type:"changeCombinedActivityData", payload: combinedAct.data})
        } catch (error) {
            console.error("Error fetching combined activities:", error);
        } finally {
            setLoading(false); 
        }
      };

    const data = {
        labels: timePeriod, 
        datasets: [
            {
                label: 'Activities',
                data: actTime,
                backgroundColor: actColors, 
                borderWidth: 4,

            }
        ]
    };
    
    const options = {
        responsive: true,
        cutout: "0%",
        plugins: {
            title: {
                display: true,
                position: 'bottom',
                text: `${count}/${state.combinedActivityData.length} Completed`,
                color: state.darkMode? 'white' : 'black',
                font: {
                    size: 24,  
                    align: 'center',
                    family: 'serif'
                }},
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    generateLabels: function (chart) {
                        const labels = [
                            { text: 'Completed', fillStyle: 'green', fontColor:state.darkMode? 'white' : 'rgb(48,48,48)', padding: 20, borderColor:'green'},
                            { text: 'Skipped', fillStyle: 'red', fontColor:state.darkMode? 'white' : 'rgb(48,48,48)', padding: 20, borderColor:'red'},
                            { text: 'Not Yet Started', fillStyle: 'black', fontColor:state.darkMode? 'white' : 'rgb(48,48,48)', padding: 20, borderColor:''},
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
            },
            datalabels: {
                display: false
            }
        },
        elements: {
            arc: {
                borderColor : state.darkMode? 'rgb(48, 48, 48)' : 'white'
            }
        },
    };

    useEffect(() => {
          alterData();
        },[]);  

    if (loading) {
        return <div className={`loadingSpinner ${state.fthState ? "scheduleDisclaimer1" : "scheduleDisclaimer2"}`} ><p className="loadingText" style={{color: state.darkMode? 'white' : 'black'}}>Loading, please wait...</p></div>;
    }

    return (
        <div className='currentTarget'>
            <Doughnut
                data={data}
                options={options}
            />
        </div>
    );
};