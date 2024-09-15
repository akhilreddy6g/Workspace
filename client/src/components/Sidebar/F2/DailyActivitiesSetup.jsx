import Dailyactivities from "./Dailyactivities";
import Addactivity from "./Addactivity";
import Filtercheckbox from "./Filtercheckbox";

export default function DailyActivitiesSetup(){
    return(<><div className="overLayInitial"></div>
            <Filtercheckbox></Filtercheckbox>
            <Dailyactivities></Dailyactivities>
            <Addactivity></Addactivity>
        </>);};