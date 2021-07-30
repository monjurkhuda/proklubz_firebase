import React from "react";
import Profile from "./Profile";
import Navigation from "./Navigation";
import firebaseApp from "./firebase";
import "./Dashboard.css";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="dashboard__container">
      <div className="dashboard__header">
        <button
          className="signout__button"
          onClick={() => firebaseApp.auth().signOut()}
        >
          Sign Out
        </button>
      </div>
      <Profile />
      <Navigation />
    </div>
  );
};

export default Dashboard;
