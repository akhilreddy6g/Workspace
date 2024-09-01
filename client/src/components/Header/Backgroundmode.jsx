import {useContext, useEffect} from "react";
import featuresTabHook from "../Noncomponents";

export default function Backgroundmode(){
    const {state} = useContext(featuresTabHook);
    useEffect (() => {
        const navbars = document.querySelectorAll(".navbar");
        const background = document.querySelectorAll(".background");
        const feature = document.querySelectorAll(".feature");
        if(state.darkMode){
          document.body.style.backgroundColor = "rgb(48,48,48)";
          document.querySelector("#profilepic").setAttribute("src", "src/assets/white-user.svg");
          document.querySelector("#profilepic").style.border = "1px solid grey";
          navbars.forEach(element => {element.classList.add("navdarkMode");});
          background.forEach(element => {element.classList.add("backgdarkMode");});
          feature.forEach(element => {element.classList.add("featuredarkMode")});
        }
        else{
          document.body.style.backgroundColor = "white";
          document.querySelector("#profilepic").setAttribute("src", "src/assets/user.svg");
          document.querySelector("#profilepic").style.border = "1px solid black";
          navbars.forEach(element => {element.classList.remove("navdarkMode");});
          background.forEach(element => {element.classList.remove("backgdarkMode");});
          feature.forEach(element => {element.classList.remove("featuredarkMode")});
        }
      },[state.darkMode]);
};