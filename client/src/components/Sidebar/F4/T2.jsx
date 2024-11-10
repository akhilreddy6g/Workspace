import React, { useEffect, useContext, useState } from 'react';
import featuresTabHook from '../../Noncomponents';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { apiUrl } from '../../Noncomponents';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function T2() {
    const [statData, changeData] = useState([]);
    const { state } = useContext(featuresTabHook);
    const [filter, changeFilter] = useState(7);
    const [loading, setLoading] = useState(true); 

    const options = {
        plugins: {
            title: {
                display: true,
                text: 'Skipped Activities vs Completed Activities',
                color: state.darkMode ? 'white' : 'black'
            },
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: state.darkMode ? 'white' : 'black'
                }
            },
            datalabels: {
                display: false
            }
        },
        responsive: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Date',
                    color: state.darkMode ? 'white' : 'black',
                },
                grid: {
                    display: false,
                },
                ticks: {
                    color: state.darkMode ? 'white' : 'black'
                },
                border: {
                    display: true,
                    color: state.darkMode ? 'white' : 'black',
                    width: 0.5
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'No of Activities',
                    color: state.darkMode ? 'white' : 'black'
                },
                grid: {
                    display: false
                },
                ticks: {
                    color: state.darkMode ? 'white' : 'black'
                },
                border: {
                    display: true,
                    color: state.darkMode ? 'white' : 'black',
                    width: 0.5
                }
            },
        },
    };

    async function alterData(days) {
        try {
            setLoading(true); 
            const sessionMail = sessionStorage.getItem('email');
            const mail = state.emailId || sessionMail;
            const response = await apiUrl.get(`/user-statistics/${mail}?days=${days}`);
            if (response.data.length > 0) {
                changeData(response.data);
            }
        } catch (error) {
            console.error("Error fetching user statistics", error);
        } finally {
            setLoading(false); 
        }
    }

    const chartData = {
        labels: statData.map(item => item.date.split('T')[0]),
        datasets: [
            {
                label: 'Skipped',
                data: statData.map(item => item.skipped_activities),
                backgroundColor: 'red',
                borderColor: 'red',
                borderWidth: 1,
            },
            {
                label: 'Completed',
                data: statData.map(item => item.completed_activities),
                backgroundColor: 'green',
                borderColor: 'green',
                borderWidth: 1,
            },
        ],
    };

    useEffect(() => {
        if (state.trend === "1"){
            alterData(filter);
        }
    }, [state.trend, filter]);

    if (loading) {
        return <div className={`loadingSpinner ${state.fthState ? "scheduleDisclaimer1" : "scheduleDisclaimer2"}`} ><p className="loadingText">Loading, please wait...</p></div>;
    }

    return (
        state.trend === "1" && (statData.length > 0 ? (
            <> 
                <div className='t2FilterContainer'>
                    <select name="t2Filter" id="t2FilterIpBox" onChange={(e) => {
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
                <div className='tnpT1' style={{color: state.darkMode ? 'white' : 'black', left:"20vw"}}>
                    <Bar data={chartData} options={options} />
                </div>
            </>
            ) : ( <>
                    <div className={`scheduleDisclaimer`} style={{left: state.fthState? "16.5vw" : "9.5vw", top:"185px"}}>
                        <p className="scheduleContext">Schedule Activities Regularly to View this Trend</p>
                    </div>
            </> ))
    );
}
