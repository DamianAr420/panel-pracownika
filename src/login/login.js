import react from "react";
import "./login.css";

export default function Login() {
    return(
        <div className="loginBcg">
            <form>
                <div className="panelPrac">
                    Panel Pracownika
                </div>
                <p className="dane">Wprowadź dane</p>
                <input name="login" autoComplete="off" type="text" placeholder="Login" className="login"/>
                <input name="haslo" autoComplete="off" type="password" placeholder="Hasło" className="haslo"/>
                <button className="loginButton">Zaloguj się</button>
            </form>
        </div>
    )
}
