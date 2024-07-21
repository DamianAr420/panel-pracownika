import React, { useState, useEffect } from 'react';
import axios from "axios";
import './home.css';

export default function Home() {
  const [userData, setUserData] = useState({
    imie: "",
    nazwisko: "",
    zmiany: []
  });
  const [otherUsers, setOtherUsers] = useState([]);

  useEffect(() => {
    axios.get(process.env.REACT_APP_FETCH)
      .then(res => {
        const user = res.data.users.find(user => user._id === localStorage.getItem("user"));
        if(user) {
          setUserData({
            imie: user.imie,
            nazwisko: user.nazwisko,
            zmiany: user.zmiany
          });
          const otherUsersData = res.data.users.filter(u => u._id !== localStorage.getItem("user"));
          setOtherUsers(otherUsersData);
        } else {
          setUserData(["Error: User not found"]);
          console.log("Error: User not found");
        }
      })
      .catch(err => {
        setUserData(["Error: ", err]);
        console.log('Error', err);
      });
  }, []);

  const shiftToday = () => {
    const today = new Date().toLocaleDateString();
    for(let i = 0; i < userData.zmiany.length; i++) {
      if(userData.zmiany[i].data === today) {
        return(
          <>
            {`${userData.zmiany[i].data}: ${userData.zmiany[i].od} - ${userData.zmiany[i].do}`}
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

  const employeesToday = () => {
    const today = new Date().toLocaleDateString();
    const employees = [];

    for(let i = 0; i < otherUsers.length; i++) {
      for(let g = 0; g < otherUsers[i].zmiany.length; g++) {
        if(otherUsers[i].zmiany[g].data === today) {
          employees.push(`${otherUsers[i].imie} ${otherUsers[i].nazwisko}: ${otherUsers[i].zmiany[g].od} - ${otherUsers[i].zmiany[g].do}`)
        }
      }
    }
    return(
      <>
        <h1 className='text-[1.7rem] font-bold border-b-2 border-black'>{today}</h1>
        <ul>
          {employees.map((emp, index) => {
            return <li key={index}>{emp}</li>
          })}
        </ul>
      </>
    )
  };

  const logout = () => {
    localStorage.removeItem("isLogged");
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div className='home'>
      <div className='welcome'>
        Witaj {userData.imie} {userData.nazwisko}
      </div>
      <h1 className='font-bold text-[1.5rem]'>Dzisiejsza zmiana</h1>
      <div className='shiftToday'>
        {shiftToday()}
      </div>
      <h1 className='font-bold text-[1.5rem]'>Pracownicy dzisiaj</h1>
      <div className='employeesToday'>
        {employeesToday()}
      </div>
      <button className='logout' onClick={logout}>Wyloguj</button>
    </div>
  );
}
