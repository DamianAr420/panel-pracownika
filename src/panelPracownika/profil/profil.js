import React, { useEffect, useState } from 'react';
import axios from "axios";
import "./profil.css";

export default function Profil() {
  const [data, setData] = useState({
    imie: "",
    nazwisko: "",
    Tel: "",
    Email: "",
    Stanowisko: "",
    Umowa: "",
    Hasło: "",
    Login: "",
  });
  const [dataChange, setDataChange] = useState({
    _id: "",
    Tel: "",
    Email: "",
    Login: "",
    Hasło: "",
  })
  const [changes, setChanges] = useState({
    Tel: false,
    Email: false,
    Login: false,
    Hasło: false,
  })
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    axios.get(process.env.REACT_APP_FETCH)
      .then(res => {
        const user = res.data.users.filter((item) => item._id === localStorage.getItem("user"))
        if(user) {
          setData({
            imie: user[0].imie,
            nazwisko: user[0].nazwisko,
            Tel: user[0].tel,
            Email: user[0].email,
            Stanowisko: user[0].stanowisko,
            Umowa: user[0].umowa,
            Login: user[0].login,
            Hasło: "",
          });
          setDataChange({
            _id: user[0]._id,
            Tel: user[0].tel,
            Email: user[0].email,
            Login: user[0].login,
            Hasło: "",
          });
        } else {
          setData({ error: "User not found" });
          console.log({ error: "User not found" });
        }
      })
      .catch(err => {
        setData({ error: "Error: " + err });
        console.log('Error', err);
      });
  }, []);

  const fetchData = () => {
    const array = []
    
    for(let key in data) {
      if(!["imie", "nazwisko"].includes(key)) {
        array.push(`${key}: ${data[key]}`)
      }
    }

    return(
      <>
        <ul>
          {array.map((user, index) => {
            return <li key={index}>{user}</li>
          })}
        </ul>
      </>
    )
  };
  
  const edit = () => {
    setModalIsOpen(true);
    setIsSaved(false);
  };

  const handleInputChange = (e, index) => {
    const { value } = e.target;
    setDataChange(prevData => ({
      ...prevData,
      [index]: value
    }));
    
    if(value === data[index]) {
      setChanges(prevChanges => ({
        ...prevChanges,
        [index]: false
      }));
    } else {
      setChanges(prevChanges => ({
        ...prevChanges,
        [index]: true
      }));
    }
  };

  const close = () => {
    setDataChange({
      Tel: data.Tel,
      Email: data.Email,
      Login: data.Login,
      Hasło: data.Hasło,
    });
    setModalIsOpen(false);
  };

  const saveChanges = () => {
    axios.post(process.env.REACT_APP_EDIT, dataChange)
      .then(response => {
        console.log(response.data);
        setModalIsOpen(false)
        setIsSaved(true)
      })
      .catch(error => {
        console.error("Błąd podczas aktualizacji danych: ", error);
      })
  };

  const generateChangesMessage = () => {
    const changesArray = Object.keys(changes);
    const trueChanges = [];
  
    for (let i = 0; i < changesArray.length; i++) {
      if (changes[changesArray[i]] === true) {
        trueChanges.push(changesArray[i]);
      }
    }
  
    if (trueChanges.length > 1) {
      return (
        <div className="changes">
          {trueChanges.map((chan, index) => {
            return <span key={index}>{`${chan} `}</span>;
          })}
          Zostały zmienione!
        </div>
      );
    } else if (trueChanges.length === 1) {
      return (
        <div className="changes">
          <span>{`${trueChanges[0]} `}</span>
          {trueChanges[0] === "Hasło" ? "Zostało zmienione" : "Został zmieniony"}
        </div>
      );
    } else {
      setModalIsOpen(false);
      return <div className="changes">Nie wprowadziłeś zmian</div>;
    }
  };

  const modal = () => {
    const names = Object.keys(data);
    
    if(modalIsOpen) {
      return(
        <div>
          <table className='modal'>
            <tbody>
              {names.map((name, index) => (
                !["imie", "nazwisko", "Stanowisko", "Umowa"].includes(name) && (
                  <tr key={index}>
                    <td><label>{name}:</label></td>
                    <td>
                      <input 
                        type={name === "Hasło" ? "password" : "text"} 
                        value={dataChange[name]} 
                        onChange={e => handleInputChange(e, name)} 
                      />
                    </td>
                  </tr>
                )
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td>
                  <button className='close' onClick={close}>Anuluj</button>
                </td>
                <td>
                  <button className='save' onClick={saveChanges}>Zapisz zmiany</button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )
    } else {
      return null;
    }
  };
  
  useEffect(() => {
    if (isSaved) {
      setTimeout(() => {
        setIsSaved(false);
        window.location.reload();
      }, 4000);
    }
  }, [isSaved]);

  const logout = () => {
    localStorage.removeItem("isLogged");
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div className='profile'>
      {isSaved === true ? generateChangesMessage() : ""}
      <div className="surname">
        {`${data.imie} ${data.nazwisko}`}
      </div>
      <div className="data">
        {fetchData()}
        <button className='edit' onClick={edit}>Edytuj</button>
      </div>
      {modal()}
      <button className='logout' onClick={logout}>Wyloguj</button>
    </div>
  )
}
