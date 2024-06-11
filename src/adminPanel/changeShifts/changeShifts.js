import React, {useEffect, useState} from 'react';
import axios from 'axios';
import "./changeShifts.css";

export default function ChangeShifts() {
    const [users, setUser] = useState([]);
    const [selected, setSelected] = useState();
    const [date, setDate] = useState({
      from: "",
      to: "",
    });
    const [dateList, setDateList] = useState([]);
    const [dates, setDates] = useState([]);
    const [isSaved, setIsSaved] = useState(false);
  
    useEffect(() => {
      axios.get(process.env.REACT_APP_FETCH)
        .then(res => {
          const users = res.data.users;
          if (users) {
            setUser(users);
          } else {
            setUser(["Error: User not found"]);
            console.log("Error: User not found");
          }
        })
        .catch(err => {
          setUser(["Error: ", err]);
          console.log('Error', err);
        });
    }, []);
  
    const select = () => {
      return users.map((names, index) => {
        return <option key={index} value={names._id}>{`${names.imie} ${names.nazwisko}`}</option>
      })
    };
  
    const createDatesList = () => {
      const { from, to } = date;
  
      if (from && to) {
        let startDate = new Date(from);
        let endDate = new Date(to);
        let currDate = new Date(from);
        const dates = [];
  
        if (startDate <= endDate) {
          try {
            while (currDate <= endDate) {
              dates.push(new Date(currDate).toLocaleDateString());
              currDate.setDate(currDate.getDate() + 1);
            }
            setDateList(dates);
          } catch (err) {
            console.log("Błąd podczas generowania tablicy dat");
          }
        } else {
          console.log("Data początkowa jest większa od końcowej");
        }
      } else {
        console.log("Brak daty");
      }
    };
  
    const handleInputChange = (index, field, value) => {
      setDates(prevDates => {
        const updatedDates = [...prevDates];
        if (!updatedDates[index]) {
          updatedDates[index] = { date: dateList[index], od: "", do: "" };
        }
        updatedDates[index][field] = value;
        return updatedDates;
      });
    };
  
    const shiftsFetch = () => {
      if (dateList.length > 0 && selected !== "") {
        return dateList.map((dates, index) => {
          const [day, month, year] = dates.split(".");
          const formattedDate = `${year}-${month}-${day}`;
          return (
            <div key={index} className='inputs'>
              <input type="date" value={formattedDate} readOnly />
              <input type="text" placeholder='Godzina od gg:mm' onChange={(e) => handleInputChange(index, 'od', e.target.value)} />
              <input type="text" placeholder='Godzina do gg:mm' onChange={(e) => handleInputChange(index, 'do', e.target.value)} />
            </div>
          );
        });
      } else {
        return <div className='text'>Wprowadź daty i wybierz pracownika żeby przypisać mu zmiany na dane dni</div>;
      }
    };
  
    const handleSubmit = () => {
      const shifts = dates.map((shift, index) => ({
        user: selected,
        date: dateList[index],
        od: shift.od,
        do: shift.do,
      }));
  
      axios.post(process.env.REACT_APP_POST, { shifts })
        .then(res => {
          console.log('Zmiany zostały zapisane', res);
          setIsSaved(true);
        })
        .catch(err => {
          console.log('Błąd podczas zapisywania', err);
        });
    };
  
    useEffect(() => {
      if (isSaved) {
        setTimeout(() => {
          setIsSaved(false);
          window.location.reload();
        }, 4000);
      }
    }, [isSaved]);
  
    return (
      <div className='changeShifts'>
        {isSaved === true ? <div className='notification'>Zmiany zostały zapisane!</div> : ""}
        <select onChange={(event) => setSelected(event.target.value)} value={selected}>
          <option></option>
          {select()}
        </select>
        <div className='dates'>
          <label>Data od</label>
          <input 
            type="date" 
            value={date.from} 
            onChange={(event) => {
              setDate(prevState => ({
                ...prevState,
                from: event.target.value
              }));
            }} 
          /> <br />
          <label>Data do</label>
          <input 
            type="date" 
            value={date.to} 
            onChange={(event) => {
              setDate(prevState => ({
                ...prevState,
                to: event.target.value
              }));
            }}
          /><br />
          <button onClick={createDatesList} className='datesButton'>OK</button>
        </div>
        <div className='shifts'>
          {shiftsFetch()}
          {dateList.length > 0 && selected !== "" ? <button onClick={handleSubmit} className='submitButton'>Zapisz zmiany</button> : ""}
        </div>
      </div>
    );
}
 