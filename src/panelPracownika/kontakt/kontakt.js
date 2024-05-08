import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './kontakt.css';

export default function Kontakt() {
  const [data, setData] = useState([]);
  const [clicked, setClicked] = useState(null);
  const [selected, setSelected] = useState("");

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

  const handleClick = (userId) => {
    if(clicked === userId) {
      setClicked(null)
    } else setClicked(userId)
  }

  const fetchSuperiors = () => {
    return data.map((user, key) => {
      if(user.role === "admin") {
        return(
          <li 
            onClick={() => handleClick(user._id)} 
            className='user' 
            key={key}
          >
            <div className='name'>{`${user.imie} ${user.nazwisko}`}</div>
            {clicked === user._id && (
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

  const fetchEmployees = () => {
    return data.map((selected, key) => {
      if(selected.role === "user") {
        return(
          <option 
            key={key}
            value={selected._id}
          >
            {`${selected.imie} ${selected.nazwisko}`}
          </option>
        )
      }
      return null;
    })
  };

  const employee = () => {
    const selectedEmployee = data.find(emp => emp._id === selected);
    
    if(selectedEmployee) {
      return(
        <div>
          <div className="user name">
            {`${selectedEmployee.imie} ${selectedEmployee.nazwisko}`}
          </div>
          <div className="info">
            <p>{`Telefon: ${selectedEmployee.tel}`}</p>
            <p>{`E-mail: ${selectedEmployee.email}`}</p>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div className='contact'>
      <h1 className='font-bold text-[1.5rem] mx-auto mt-[3vh] h-[4vh]'>Przełożeni</h1>
      <div className='superiors'>
        <ul>
          {fetchSuperiors()}
        </ul>
      </div>
      <h1 className='font-bold text-[1.5rem] mx-auto mt-[3vh] h-[4vh]'>Pracownicy</h1>
      <div className={selected !== "" ? "employees" : "employees h-[6vh]"}>
        <select onChange={(event) => setSelected(event.target.value)} value={selected}>
          <option></option>
          {fetchEmployees()}
        </select>
        {employee()}
      </div>
    </div>
  );
}
