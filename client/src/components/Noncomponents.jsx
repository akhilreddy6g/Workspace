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

export function futureDate(){
  const now = new Date();
  now.setDate(now.getDate() + 1);
  const timeZone = 'America/New_York';
  const options = { timeZone: timeZone, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  const newYorkTimeString = new Intl.DateTimeFormat('en-US', options).format(now);
  const newYorkTime = new Date(newYorkTimeString);
  return newYorkTime;
}

export function parseLocaleDateString(dateString) {
  const [month, day, year] = dateString.replace(",", "").split(" ");
  const parsedDate = new Date(`${month} ${day}, ${year}`);
  return parsedDate;
}

export function localDate(value){
  const actDate = new Date(value);
  const options = { timeZone: 'America/New_York', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  const localDate = new Intl.DateTimeFormat('en-US', options).format(actDate);
  const date = localDate.toString().split(',')[0];
  return date
}

export default featuresTabHook;