import React from "react";
import "../styles/LoginSignupContainer.css";
import {useState} from "react";
import {useRef} from "react";
import Login from "./Login";
import Signup from "./Signup";
import { getCookie } from 'cookies-next';

const LoginSignupContainer = () => {
    const[login, setLogin] = useState(true);
    const loginSignupContainerRef = useRef(null);   

    const handleClick = () => {
        setLogin(!login);
        loginSignupContainerRef.current.classList.toggle("active");
    };
    return (
    <div className="login-signup-container" ref={loginSignupContainerRef}>
         <Login /> 
        <div className="side-div">
            <button type="button" onClick={handleClick}> 
            {" "}
            {login ? "Signup" : "Login"}
            </button>
        </div>
        <Signup /> 

       </div>
    );
};
 export default LoginSignupContainer;