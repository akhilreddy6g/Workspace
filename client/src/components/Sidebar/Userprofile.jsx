import PropTypes from "prop-types";
import featuresTabHook from "../Noncomponents";
import { useContext } from "react";

export default function Userprofile(props){
    const {state} = useContext(featuresTabHook);
    return (<div name={props.elementName} className={props.title}><img src={state.darkMode? "./assets/white-user.svg":"./assets/user.svg"} id="profilepic" className={`userPic  ${state.darkMode? "profilepic1" : "profilepic2"}`} alt="Profile Picture" /></div>);
};

Userprofile.propTypes = {
    elementName:PropTypes.string,
    className:PropTypes.string,
    src:PropTypes.string.isRequired,
    title:PropTypes.string.isRequired
};