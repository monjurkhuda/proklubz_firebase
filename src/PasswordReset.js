import React, { useState } from "react";
import { Link } from "react-router-dom";
import firebaseApp from "./firebase.js";
import "./SignIn.css";

function PasswordReset() {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function resetPassword() {
    firebaseApp
      .auth()
      .sendPasswordResetEmail(email)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  }

  return (
    <div className="signin__container">
      <div>
        <div className="prodot__text">
          <p>CLUB</p>
          <p className="dot">.</p>
          <p>SCOUT</p>
        </div>
        <div className="sub__text">
          <p>Enter Email to Reset Your Password</p>
        </div>
      </div>
      <div className="auth__div">
        <input
          className="auth__input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <button className="auth__button" onClick={resetPassword}>
          Send Password Reset Email
        </button>
      </div>
      <div hidden={!errorMessage} className="signin__error">
        {errorMessage}
      </div>
      <div>
        <Link className="auth__link" to="/signup">
          Don't have an account? Sign Up!
        </Link>
      </div>
      <div>
        <Link className="auth__link" to="/">
          Already have an account? Sign In!
        </Link>
      </div>
    </div>
  );
}

export default PasswordReset;
