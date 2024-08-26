import {useContext, useRef, useEffect, useState} from "react";
import PropTypes from 'prop-types';
import featuresTabHook from "../Noncomponents";

Feature.propTypes = {
    featureName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    show: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
};

function Feature(props){
    const {state,takeAction} = useContext(featuresTabHook);
    const [last, changelast] = useState({val:""});
    const buttonRef = useRef(null)
    useEffect(()=> {
        if(last.val){
            const feature = last.val;
            const features = document.querySelectorAll(".feature");
            features.forEach(element => {
                if(element.id!=feature){
                    console.log("id",element.id);
                    element.classList.remove("selectFeature");
                }
            });

        };
    }, [last]);

    return (<div name={props.featureName} id={"feature"+props.id} className="feature" ref = {buttonRef} onClick={() => {
        buttonRef.current.classList.add("selectFeature");
        const feature = "feature"+props.id;
        changelast({val:feature});
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
        };
}}><p className="featureTitle">{props.title}</p></div>);};

export default Feature;