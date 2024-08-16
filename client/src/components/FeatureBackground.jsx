import React, { useContext } from "react";
import { truthHook } from "./App";

export default function Background() {
  const { data } = useContext(truthHook);
  return (data && <div className="background"></div>); 
}
