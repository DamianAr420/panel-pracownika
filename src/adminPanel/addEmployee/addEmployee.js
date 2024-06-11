import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './addEmployee.css';

export default function AddEmployee() {
  const [isSaved, setIsSaved] = useState(false);
  const [employee, setEmployee] = useState({
    imie: '',
    nazwisko: '',
    stanowisko: '',
    password: '',
    umowa: '',
    login: '',
    role: '',
    dodanyPrzez: ''
  });

  useEffect(() => {
    axios.get(process.env.REACT_APP_FETCH)
      .then(res => {
        const user = res.data.users.find(u => u._id === localStorage.getItem('user'));
        if (user) {
          setEmployee({ dodanyPrzez: `${user.imie} ${user.nazwisko}` });
        } else {
          setEmployee({ dodanyPrzez: "Error: User not found" });
          console.log("Error: User not found");
        }
      })
      .catch(err => {
        setEmployee.dodanyPrzez(["Error: ", err]);
        console.log('Error', err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({
      ...employee,
      [name]: value
    });
  };

  useEffect(() => {
    if (isSaved) {
      setTimeout(() => {
        setIsSaved(false);
      }, 4000);
    }
  }, [isSaved]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(process.env.REACT_APP_ADDUSER, employee);
      console.log('Pracownik dodany pomyślnie: ', response.data);
      setEmployee({
        imie: '',
        nazwisko: '',
        stanowisko: '',
        password: '',
        umowa: '',
        login: '',
        role: ''
      });
      setIsSaved(true);
    } catch (error) {
      console.error('Wystąpił problem podczas dodawania pracownika: ', error);
    }
  };

  return (
    <div className="addEmployeeContainer">
      {isSaved === true ? <div className='notification'>Dodano pracownika!</div> : ""}
      <form onSubmit={handleSubmit}>
        <div className="formGroup">
          <label>Imię</label>
          <input type="text" name="imie" value={employee.imie} onChange={handleChange} required />
        </div>
        <div className="formGroup">
          <label>Nazwisko</label>
          <input type="text" name="nazwisko" value={employee.nazwisko} onChange={handleChange} required />
        </div>
        <div className="formGroup">
          <label>Stanowisko</label>
          <input type="text" name="stanowisko" value={employee.stanowisko} onChange={handleChange} required />
        </div>
        <div className="formGroup">
          <label>Hasło</label>
          <input type="password" name="password" value={employee.password} onChange={handleChange} required autoComplete='no'/>
        </div>
        <div className="formGroup">
          <label>Umowa</label>
          <input type="text" name="umowa" value={employee.umowa} onChange={handleChange} required />
        </div>
        <div className="formGroup">
          <label>Login</label>
          <input type="text" name="login" value={employee.login} onChange={handleChange} required />
        </div>
        <div className="formGroup">
          <label>Rola</label>
          <input type="text" name="role" value={employee.role} onChange={handleChange} required />
        </div>
        <button className='addEmpButton' type="submit">Dodaj Pracownika</button>
      </form>
    </div>
  );
}
