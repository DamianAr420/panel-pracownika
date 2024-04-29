import React, { useState, useEffect } from 'react';
import './home.css';

export default function Home() {
  const [userData, setUserData] = useState({
    imie: "",
    nazwisko: "",
    zmiany: []
  });
  const [otherUsers, setOtherUsers] = useState([]);
  const [today, setToday] = useState("");

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (storedUserData && storedUserData.imie) {
      setUserData(storedUserData);

      const today = new Date().toLocaleDateString();
      const filteredZmiany = storedUserData.zmiany.filter(zmiana => zmiana.data === today);

      setUserData(prevState => ({
        ...prevState,
        zmiany: filteredZmiany
      }));

      setToday(today);
    }

    const storedOtherUsers = JSON.parse(localStorage.getItem("otherUsers"));
    if (storedOtherUsers) {
      setOtherUsers(storedOtherUsers);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("isLogged");
    localStorage.removeItem("userData");
    localStorage.removeItem("otherUsers");
    window.location.reload();
  };

  return (
    <div className='home'>
      <div className='witaj'>
        Witaj {userData.imie} {userData.nazwisko}
      </div>
      <h1 className='font-bold text-[1.5rem]'>Dzisiejsza zmiana</h1>
      <div className='zmianaDzisiaj'>
        {userData.zmiany.map((zm, index) => (
          <h2 key={index}>
            <span className='font-bold'>{zm.data}:</span> {zm.od}-{zm.do}
          </h2>
        ))}
      </div>
      <h1 className='font-bold text-[1.5rem]'>Pracownicy na zmianie</h1>
      <div className='pracownicyDzisiaj'>
        <h1 className='font-bold text-[2rem]'>{today}</h1>
        <ul>
          {otherUsers.map((user, index) => (
            <li key={index}>
              {user.zmiany.map((zmiana, zmianaIndex) => {
                return (
                  <span key={zmianaIndex}>
                    {zmiana.data === new Date().toLocaleDateString() ? `${user.imie} ${user.nazwisko}: ${zmiana.od}-${zmiana.do}` : ""}
                  </span>
                );
              })}
            </li>
          ))}
        </ul>
      </div>
      <button className='logout' onClick={logout}>Wyloguj</button>
    </div>
  );
}
