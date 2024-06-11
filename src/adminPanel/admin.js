import React, { useState } from 'react';
import ChangeShifts from "./changeShifts/changeShifts";
import AddEmployee from "./addEmployee/addEmployee";
import "./admin.css";

export default function Admin() {
  const [page, setPage] = useState('');

  const changeContent = (event) => {
    const value = event.target.value;
    setPage(value)
  }

  const components = {
    ChangeShifts: <ChangeShifts />,
    AddEmployee: <AddEmployee />,
  }

  const selectContent = () => {
    if(page === '') {
      return(
        <>
          <h1 className='text-[2rem] text-center my-5'>Wybierz Opcje</h1>
        </>
      )
    } else {
      return components[page] || null;
    }
  }
  return(
    <div>
        <div className="adminButtonsBox">
          <button onClick={changeContent} value="ChangeShifts" className='adminButton'>Zmiany</button>
          <button onClick={changeContent} value="AddEmployee" className='adminButton'>Nowy Pracownik</button>
        </div>
        <div className='adminContent'>
          {selectContent()}
        </div>
    </div>
  )
}
