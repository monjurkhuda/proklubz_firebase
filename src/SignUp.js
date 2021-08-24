import React, { useCallback, useState } from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import firebaseApp from "./firebase";
import "./SignIn.css";

const SignUp = ({ history }) => {
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignUp = useCallback(
    async (event) => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      try {
        await firebaseApp
          .auth()
          .createUserWithEmailAndPassword(email.value, password.value);
        history.push("/createprofile");
      } catch (error) {
        setErrorMessage(error.message);
      }
    },
    [history]
  );

  return (
    <div className="signin__container">
      <div className="prodot__text">
        <p>CLUB</p>
        <p className="dot">.</p>
        <p>SCOUT</p>
      </div>
      <div className="sub__text__centered">
        <p>Create An Account</p>
      </div>
      <form className="auth__form" onSubmit={handleSignUp}>
        <input
          className="auth__input"
          name="email"
          type="email"
          placeholder="Email"
        />
        <input
          className="auth__input"
          name="password"
          type="password"
          placeholder="Password"
        />
        <button className="auth__button" type="submit">
          Sign Up
        </button>
      </form>
      <div hidden={!errorMessage} className="signin__error">
        {errorMessage}
      </div>

      <Link className="auth__link" to="/">
        Already have an account? Sign In!
      </Link>
    </div>
  );
};

export default withRouter(SignUp);
