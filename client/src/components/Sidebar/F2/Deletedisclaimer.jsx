import Disclaimer from "../../Disclaimer";
import featuresTabHook from "../../Noncomponents";
import { useContext } from "react";

export default function Deletedisclaimer(){
    const {state, takeAction} = useContext(featuresTabHook);
    return <>
    {state.editActivity && <div className="overLay1"></div>}
    {state.disclaimerButtons && <div className="overLay"></div>}
    <Disclaimer message="Do you want to delete the activity?"></Disclaimer>
    </>
}