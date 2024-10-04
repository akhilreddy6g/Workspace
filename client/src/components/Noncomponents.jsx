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

export function convertTimeToAmPm(time24hr) {
  let [hours, minutes] = time24hr.split(':').map(Number);
  let period = hours < 12 ? 'AM' : 'PM';
  if (hours === 0) {
      hours = 12; 
  } else if (hours > 12) {
      hours -= 12; 
  }
  return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export function resetButtonStyle(buttonRef){
    if (buttonRef && buttonRef.current) {
      buttonRef.current.style.boxShadow = "none";
      buttonRef.current.style.backgroundColor = "rgb(255,255,144)";
    } else if (buttonRef) {
      buttonRef.style.boxShadow = "none";
      buttonRef.style.backgroundColor = "rgb(255,255,144)";
    };
  };

export const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
};

export default featuresTabHook;