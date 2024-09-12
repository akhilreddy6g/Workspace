import {useContext, useRef, useEffect, useState} from "react";
import PropTypes from 'prop-types';
import featuresTabHook from "../Noncomponents";
import { useNavigate } from 'react-router-dom';

Feature.propTypes = {
    featureName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    show: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
};

export default function Feature(props){
    const {state,takeAction} = useContext(featuresTabHook);
    const [last, changelast] = useState({val:""});
    const buttonRef = useRef(null);
    const navigate = useNavigate();
    useEffect(()=> {
        if(last.val){
            const feature = last.val;
            const features = document.querySelectorAll(".feature");
            features.forEach(element => {
                if(element.id!=feature){
                    console.log("id",element.id);
                    element.classList.remove("selectFeature");
                };
            });
        };
    }, [last]);

    const handleNavigation = () => {
    navigate(props.path);};

    return (<div name={props.featureName} id={"feature"+props.id} className={`feature ${state.darkMode && "featuredarkMode"}`} ref = {buttonRef} onClick={() => {
        buttonRef.current.classList.add("selectFeature");
        const feature = "feature"+props.id;
        changelast({val:feature});
        handleNavigation();
        switch (props.show) {
            case "cs":
                takeAction({type:"changeScheduleState"});
                break;
            case "da":
                takeAction({type:"changeDailyActState"});
                break;
            case "syd":
                takeAction({type:"changeStdState"});
                break;
            case "qa":
                takeAction({type:"changeQuickSessState"});
            default:
                break;
        };}}>
        <p className="featureTitle">{props.title}</p></div>
        );};