import { createContext } from "react";
import axios from "axios";

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

export function currentTimeInMinutes() {
  const actDate = new Date();
  const options = { timeZone: 'America/New_York', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  const localDate = new Intl.DateTimeFormat('en-US', options).format(actDate);
  const newDate = new Date(localDate)
  let hours = newDate.getHours();
  const minutes = newDate.getMinutes();
  const totalMinutes = (hours * 60) + minutes;
  return totalMinutes;
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

export function minutesToHours(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours} hr ${remainingMinutes} min`;
}

export function minutesTo24hr(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}:${remainingMinutes}`;
}

export const apiUrl = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API || "http://localhost:3000",
  withCredentials: true,
});

export function formatTime(date) {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function convertMinutesToHours(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

export function isValidSessionStartTime(start, end, breakTime, totalSessions) {
  const now = new Date();
  const offset = now.getTimezoneOffset() / 60;
  const estOffset = offset - 5;
  const currentEstTime = new Date(now.getTime() + estOffset * 60 * 60 * 1000);
  const startTime = new Date(`1970-01-01T${start}`);
  const endTime = new Date(`1970-01-01T${end}`);
  const totalMinutes = (endTime - startTime) / (1000 * 60);
  const totalBreakTime = breakTime * totalSessions;
  const sessionDuration = Math.floor((totalMinutes - totalBreakTime) / totalSessions);
  const [hours, minutes] = start.split(":").map(Number);
  const [hours1, minutes1] = end.split(":").map(Number);
  const sessionStartTime = new Date(currentEstTime);
  sessionStartTime.setHours(hours);
  sessionStartTime.setMinutes(minutes);
  sessionStartTime.setSeconds(0);
  sessionStartTime.setMilliseconds(0);
  const isFutureTime = sessionStartTime > currentEstTime;
  const isEndFutureTime = hours1 < 24 && minutes1 < 60;
  const isBeforeEndOfDay = hours < 24 && minutes < 60;
  const breakConstraint = breakTime > 1
  const sessionConstraint = sessionDuration > 1
  return isFutureTime && isBeforeEndOfDay && isEndFutureTime && breakConstraint && sessionConstraint;
}

export default featuresTabHook;