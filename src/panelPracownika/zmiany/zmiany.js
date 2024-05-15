import React, { useEffect, useState } from 'react';
import axios from "axios";
import './zmiany.css';

export default function Zmiany() {
  const [zmiany, setZmiany] = useState({
    imie: "",
    nazwisko: "",
    zmiany: []
  });
  const weekDays = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Niedz'];
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    axios.get(process.env.REACT_APP_FETCH)
      .then(res => {
        const user = res.data.users.find(user => user._id === localStorage.getItem("user"));
        if(user) {
          setZmiany({
            imie: user.imie,
            nazwisko: user.nazwisko,
            zmiany: user.zmiany
          });
        } else {
          setZmiany(["Error: User not found"]);
          console.log("Error: User not found");
        }
      })
      .catch(err => {
        setZmiany(["Error: ", err]);
        console.log('Error', err);
      });
  }, []);

  const shiftToday = () => {
    const today = new Date().toLocaleDateString();
    for(let i = 0; i < zmiany.zmiany.length; i++) {
      if(zmiany.zmiany[i].data === today) {
        return(
          <>
            {`${zmiany.zmiany[i].data}: ${zmiany.zmiany[i].od} - ${zmiany.zmiany[i].do}`}
          </>
        )
      }
    }
    return(
      <>
        Dzień wolny
      </>
    )
  };

  const shiftsWeek = () => {
    const today = new Date();
    const firstDate = new Date(today);
    const lastDate = new Date(today);
    const weekShift = new Array(7)
  
    firstDate.setDate(today.getDate() - today.getDay() + 1);
    lastDate.setDate(today.getDate() + (7 - today.getDay()));
  
    for(let i = 0; i < 7; i++) {
      for(let g = 0; g < zmiany.zmiany.length; g++) {
        if(zmiany.zmiany[g].data === firstDate.toLocaleDateString()) {
          weekShift[i] = `${zmiany.zmiany[g].od} - ${zmiany.zmiany[g].do}`
        }
      }
      if(weekShift[i] === undefined) {
        weekShift[i] = "Dzień wolny";
      }
      firstDate.setDate(firstDate.getDate() + 1);
    }

    firstDate.setDate(today.getDate() - today.getDay() + 1);
    

    return (
      <>
        <h1>{`${firstDate.toLocaleDateString()} - ${lastDate.toLocaleDateString()}`}</h1>
        <ul>
          {weekShift.map((shift, index) => (
            <li key={index}>
              <div className='text-red-500 w-[30%]'>{weekDays[index]}:</div>
              <div className='text-green-700'>{shift}</div>
            </li>
          ))}
        </ul>
      </>
    );
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const selectedDay = () => {
    if(!selectedDate) {
      return (
        <>
          Wybierz datę
        </>
      );
    }
  
    const formattedDate = new Date(selectedDate).toLocaleDateString();
    let foundChange = null;
  
    for(let a = 0; a < zmiany.zmiany.length; a++) {
      if(zmiany.zmiany[a].data === formattedDate) {
        foundChange = `${zmiany.zmiany[a].od}-${zmiany.zmiany[a].do}`;
        break;
      }
    }
  
    if(foundChange) {
      return (
        <>
          {foundChange}
        </>
      );
    } else {
      return (
        <>
          Dzień wolny
        </>
      );
    }
  };

  return (
    <div className='shift'>
      <h1 className='font-bold text-[1.5rem] mx-auto mt-[3vh] h-[4vh]'>Dzisiaj</h1>
      <div className='shiftToday'>
        {shiftToday()}
      </div>
      <h1 className='font-bold text-[1.5rem] mx-auto h-[4vh]'>Tydzień</h1>
      <div className='shiftsWeek'>
        {shiftsWeek()}
      </div>
      <h1 className='font-bold text-[1.5rem] mx-auto h-[4vh]'>Wybierz dzień</h1>
      <div className='selectedDay'>
        <input type="date" className='selectedDate' value={selectedDate} onChange={handleDateChange}/>
        <span className='hours'>
          {selectedDay()}
        </span>
      </div>
    </div>
  )
}
