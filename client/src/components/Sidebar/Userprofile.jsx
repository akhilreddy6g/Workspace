import PropTypes from "prop-types";

export default function Userprofile(props){
    return (<div name={props.elementName} className={props.title}><img src={props.src} id="profilepic" className="userPic" alt="Profile Picture" /></div>);
};

Userprofile.propTypes = {
    elementName:PropTypes.string,
    className:PropTypes.string,
    src:PropTypes.string.isRequired,
    title:PropTypes.string.isRequired
};