import React, { useState, useEffect } from "react";
import Main from "../main/main";
import AdminMain from "../main/adminMain"
import axios from "axios";
import "./login.css";

export default function Login() {
    const url = process.env.REACT_APP_URL;
    const [isLogged, setIsLogged] = useState(false);
    const [loginData, setLoginData] = useState({
        login: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [userRole, setUserRole] = useState("")

    useEffect(() => {
        const logged = localStorage.getItem("isLogged");
        if (logged === "true") {
            setIsLogged(true);
            axios.get(process.env.REACT_APP_FETCH)
            .then(res => {
                const user = res.data.users.filter((item) => item._id === localStorage.getItem("user"))
                setUserRole(user[0].role)
            })
        }
    }, []);

    const handleChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        })
        .then(response => {
            if (response.ok) {
                console.log("Zalogowano pomyślnie");
                setIsLogged(true);
                localStorage.setItem("isLogged", "true");
                return response.json();
            } else {
                throw new Error(`Błąd logowania: ${response.statusText}`);
            }
        })
        .then(data => {
            const {user} = data;
            localStorage.setItem("user", user._id);
            window.location.reload();
        })
        .catch(error => {
            setError(error.message);
        })
        .finally(() => {
            setIsLoading(false);
        });
    };

    if (isLogged) {
        if(userRole === "admin") {
            return <AdminMain />;
        } else return <Main />;
    }

    return (
        <div className="Bcg">
            <form onSubmit={handleSubmit} className="loginForm">
                <div className="panelPrac">
                    Panel Pracownika
                </div>
                <p className="dane">Wprowadź dane</p>
                <input 
                    name="login"
                    autoComplete="off"
                    type="text"
                    placeholder="Login"
                    className="login"
                    value={loginData.login}
                    onChange={handleChange}
                />
                <input
                    name="password"
                    autoComplete="off"
                    type="password"
                    placeholder="Hasło"
                    className="haslo"
                    value={loginData.password}
                    onChange={handleChange}
                />
                {error && <p className="error">{error}</p>}
                <button type="submit" className="loginButton" disabled={isLoading}>
                    {isLoading ? "Logowanie..." : "Zaloguj się"}
                </button>
            </form>
        </div>
    );
}
