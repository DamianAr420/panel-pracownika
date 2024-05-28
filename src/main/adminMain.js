import React from 'react'
import { BrowserRouter as Router, Link, Routes, Route } from "react-router-dom";
import Home from '../panelPracownika/home/home';
import Zmiany from '../panelPracownika/zmiany/zmiany';
import Kontakt from '../panelPracownika/kontakt/kontakt';
import Profil from '../panelPracownika/profil/profil';
import Admin from '../adminPanel/admin';
import "./adminMain.css";

export default class Main extends React.Component {
  render(){
    return (
      <div>
        <Router>
        <div className="adminHeader">
          <Link className='navi' to="/">Strona Główna</Link>
          <Link className='navi' to="/zmiany">Zmiany</Link>
          <Link className='navi' to="/kontakt">Kontakt</Link>
          <Link className='navi' to="/profil">Profil</Link>
          <Link className='navi' to="/admin">Admin</Link>
        </div>
        <div className="body">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/zmiany" element={<Zmiany />} />
            <Route path="/kontakt" element={<Kontakt />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
        </Router>
      </div>
    );
  }
}
