import { createContext } from "react";

const featuresTabHook = createContext();

export function dayStatus(){
    const time = new Date().getHours();
    if((time>=0 && time <=6) || time>=19){
      return true;
    } else {
      return false;
    }
  }

export const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
};

export default featuresTabHook;