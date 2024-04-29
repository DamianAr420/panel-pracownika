import React from 'react'
import { BrowserRouter as Router, Link, Routes, Route } from "react-router-dom";
import Home from './home/home';
import Zmiany from './zmiany/zmiany';
import Kontakt from './kontakt/kontakt';
import Profil from './profil/profil';
import "./main.css";

export default class Main extends React.Component {
  render(){
    return (
      <div>
        <Router>
        <div className="header">
          <Link className='navi' to="/">Strona Główna</Link>
          <Link className='navi' to="/zmiany">Zmiany</Link>
          <Link className='navi' to="/kontakt">Kontakt</Link>
          <Link className='navi' to="/profil">Profil</Link>
        </div>
        <div className="body">
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route path="/zmiany" element={<Zmiany />} />
              <Route path="/kontakt" element={<Kontakt />} />
              <Route path="/profil" element={<Profil />} />
            </Routes>
        </div>
        </Router>
      </div>
    );
  }
}
