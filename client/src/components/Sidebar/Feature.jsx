import {useContext} from "react";
import PropTypes from 'prop-types';
import featuresTabHook from "../Noncomponents";
import { useNavigate, useLocation } from 'react-router-dom';

Feature.propTypes = {
    featureName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    show: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired
};

export default function Feature(props) {
    const {state, takeAction} = useContext(featuresTabHook);
    const navigate = useNavigate();
    const location = useLocation();
    const isSelected = location.pathname === props.path ? "selectFeature" : "";

    const handleNavigation = () => {
        navigate(props.path);
    };

    return (
        <div 
            name={props.featureName} 
            id={"feature" + props.id} 
            className={`feature ${state.darkMode && "featuredarkMode"} ${isSelected}`} 
            onClick={() => {
                handleNavigation();
                switch (props.show) {
                    case "cs":
                        takeAction({type: "changeScheduleState"});
                        break;
                    case "da":
                        takeAction({type: "changeDailyActState"});
                        break;
                    case "syd":
                        takeAction({type: "changeStdState"});
                        break;
                    case "qa":
                        takeAction({type: "changeQuickSessState"});
                        break;
                    default:
                        break;
                }
            }}
        >
            <p className="featureTitle">{props.title}</p>
        </div>
    );
}
