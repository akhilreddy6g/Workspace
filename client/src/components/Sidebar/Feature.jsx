import {useContext} from "react";
import PropTypes from 'prop-types';
import featuresTabHook from "../Noncomponents";

Feature.propTypes = {
    featureName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    show: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
};

function Feature(props){
    const {takeAction} = useContext(featuresTabHook);
    return (<div name={props.featureName} id={"feature"+props.id} className="feature" onClick={() => {
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