import React, { useCallback, useContext, useState } from "react";
import { withRouter, Redirect } from "react-router";
import { Link } from "react-router-dom";
import firebaseApp from "./firebase.js";
import { AuthContext } from "./Auth.js";
import "./SignIn.css";

const SignIn = ({ history }) => {
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignIn = useCallback(
    async (event) => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      try {
        await firebaseApp
          .auth()
          .signInWithEmailAndPassword(email.value, password.value);
        history.push("/dashboard");
      } catch (error) {
        setErrorMessage(error.message);
      }
    },
    [history]
  );

  const demoSignIn = useCallback(
    async (event) => {
      event.preventDefault();
      try {
        await firebaseApp
          .auth()
          .signInWithEmailAndPassword("demo@demo.com", "demouserpass");
        history.push("/dashboard");
      } catch (error) {
        setErrorMessage(error.message);
      }
    },
    [history]
  );

  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="signin__container">
      <div>
        <div className="prodot__text">
          <p>CLUBS</p>
          <p className="dot">.</p>
          <p>SCOUT</p>
        </div>
        <div className="sub__text">
          <p>Easily Find Clubs and Players For Fifa Pro Clubs</p>
        </div>
      </div>
      <div className="auth__div">
        <form className="auth__form" onSubmit={handleSignIn}>
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
            Sign In
          </button>
        </form>
      </div>

      <button className="demo__button" onClick={demoSignIn}>
        DEMO Sign In
      </button>

      <div hidden={!errorMessage} className="signin__error">
        {errorMessage}
      </div>
      <div>
        <Link className="auth__link" to="/signup">
          Don't have an account? Sign Up!
        </Link>
      </div>
      <div>
        <Link className="auth__link" to="/passwordreset">
          Forgot Password?
        </Link>
      </div>
    </div>
  );
};

export default withRouter(SignIn);
