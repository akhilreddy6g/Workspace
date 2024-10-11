import Disclaimer from "./Disclaimer";
import featuresTabHook from "./Noncomponents";
import { useContext } from "react";

export default function Disclaimersetup(props){
    const {state, takeAction} = useContext(featuresTabHook);
    return <>
    {state.editActivity && <div className="overLay1"></div>}
    {state.disclaimerButtons && <div className="overLay"></div>}
    <Disclaimer message={`Do you want to ${state.currentAction}`}></Disclaimer>
    </>
}