import React, { useEffect, useState } from 'react';
import './zmiany.css';

export default function Zmiany() {
  const [zmiany, setZmiany] = useState({
    imie: "",
    nazwisko: "",
    zmiany: []
  });
  const dniTygodnia = ['pon', 'wt', 'śr', 'czw', 'pt', 'sob', 'niedz'];
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    const sortedZmiany = storedUserData.zmiany.sort((a, b) => a - b)
    setZmiany({
      imie: storedUserData.imie, 
      nazwisko: storedUserData.nazwisko, 
      zmiany: sortedZmiany
    });
  }, []);

  const zmianyTydzien = () => {
    const today = new Date().toLocaleDateString();
    const foundWeek = [];
    let firstDate = "";
    let lastDate = "";
  
    for(let i = 0; i < zmiany.zmiany.length; i++) {
      if(zmiany.zmiany[i].data === today) {
        const todayNum = new Date().getDay();
        if(todayNum === 1) {
          for(let g = i; g < (i + 7); g++) {
            if(zmiany.zmiany[g]) {
              foundWeek.push(zmiany.zmiany[g]);
            } else foundWeek.push("");
          }
          firstDate = foundWeek[0]?.data;
          lastDate = foundWeek[foundWeek.length - 1]?.data;
          break;
        } else {
          for(let h = i - (todayNum - 1); h < h + 7; h++) {
            if(zmiany.zmiany[h]) {
              foundWeek.push(zmiany.zmiany[h]);
            } else foundWeek.push("");
          }
          firstDate = foundWeek[0]?.data;
          lastDate = foundWeek[foundWeek.length - 1]?.data;
        }
      }
    }
  
    const weekList = foundWeek.map((tydzien, index) => (
      <li key={index}>{`${dniTygodnia[index]}: ${tydzien.od}-${tydzien.do}`}</li>
    ));
  
    return(
      <>
        <h1 className='font-bold'>{`${firstDate} - ${lastDate}`}</h1>
        {weekList}
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
    <div className='zmiany'>
      <h1 className='font-bold text-[1.5rem] mx-auto mt-[3vh] h-[4vh]'>Dzisiaj</h1>
      <div className='zmianaDzisiaj'>
        {zmiany.zmiany.map((dzisiaj, index) => {
          return <div key={index}>
            {dzisiaj.data === new Date().toLocaleDateString() ? 
            `${dzisiaj.od}-${dzisiaj.do}` : ""}
          </div>
        })}
      </div>
      <h1 className='font-bold text-[1.5rem] mx-auto h-[4vh]'>Tydzień</h1>
      <ul className='zmianyTydzien'>
        {zmianyTydzien()}
      </ul>
      <h1 className='font-bold text-[1.5rem] mx-auto h-[4vh]'>Wybierz dzień</h1>
      <div className='wybranyDzien'>
        <input type="date" id="wybranaData" value={selectedDate} onChange={handleDateChange}/>
        <span className='godzina'>
          {selectedDay()}
        </span>
      </div>
    </div>
  )
}
