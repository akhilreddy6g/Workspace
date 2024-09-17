import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';

const DateTimeDisplay = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  function getDayOfWeek(number) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    if (number >= 0 && number <= 6) {
        return daysOfWeek[number];
    } else {
        return "Invalid number! Please enter a number between 0 and 6.";
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="dateTimeDisplay">
      <Typography sx={{color:"orange", display: "flex",justifyContent: "center", fontFamily:"Cambria, Cochin, Georgia, Times, 'Times New Roman', serif", textShadow:"0 0 5px black"}} variant="h3">
        {currentDateTime.toLocaleTimeString()} 
      </Typography>
      <Typography sx={{color:"orange", display: "flex",justifyContent: "center", fontFamily:"Cambria, Cochin, Georgia, Times, 'Times New Roman', serif",  textShadow:"0 0 5px black"}} variant="h5">
        {`${currentDateTime.toLocaleDateString()}, ${getDayOfWeek(currentDateTime.getDay())}`} 
      </Typography>
    </div>
  );
};

export default DateTimeDisplay;
