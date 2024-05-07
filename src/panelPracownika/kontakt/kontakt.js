import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './kontakt.css';

export default function Kontakt() {
  const [data, setData] = useState([]);
  const [clicked, setClicked] = useState(null);

  useEffect(() => {
    axios.get(process.env.REACT_APP_FETCH)
      .then(res => {
        setData(res.data.users);
      })
      .catch(err => {
        setData(["Error"])
        console.log('Error', err);
      });
  }, []);

  const handleClick = (key) => {
    if(clicked === key) {
      setClicked(null)
    } else setClicked(key)
  }

  const fetch = () => {
    return data.map((user, key) => {
      if (user.role === "admin") {
        return (
          <li 
            onClick={() => handleClick(key)} 
            className='user' 
            key={key}
          >
            <div className='imie'>{`${user.imie} ${user.nazwisko}`}</div>
            {clicked === key && (
              <div className="info">
                <p>{`Telefon: ${user.tel}`}</p>
                <p>{`E-mail: ${user.email}`}</p>
              </div>
            )}
          </li>
        );
      }
      return null;
    });
  };

  return (
    <div className='kontakt'>
      <h1 className='font-bold text-[1.5rem] mx-auto mt-[3vh] h-[4vh]'>Przełożeni</h1>
      <div className='przełożeni'>
        <ul>
          {fetch()}
        </ul>
      </div>
    </div>
  );
}
