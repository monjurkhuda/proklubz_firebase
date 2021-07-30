import React, { useState } from "react";
import { Link } from "react-router-dom";
import firebaseApp from "./firebase";
import axios from "axios";
import "./Navigation.css";
import { FaRegUserCircle } from "react-icons/fa";
import { BsShieldShaded, BsInbox } from "react-icons/bs";
import { RiUserSearchLine } from "react-icons/ri";
import { AiOutlineFileSearch } from "react-icons/ai";

const Navigation = () => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [username, setUsername] = useState("");

  const firebaseid = firebaseApp.auth().currentUser.uid;

  axios
    .get("http://localhost:5000/users/firebaseid/" + firebaseid)
    .then((currentUser) => {
      setNotificationCount(currentUser.data[0].notifications.length);
      setUsername(currentUser.data[0].username);
    });

  function notificationCircleShow() {
    if (notificationCount > 0) {
      return <div className="notifications__circle">{notificationCount}</div>;
    } else {
      return (
        <div hidden className="notifications__circle">
          {notificationCount}
        </div>
      );
    }
  }

  return (
    <div className="nav__container">
      <div className="nav__search">
        <Link
          to="/searchplayers"
          style={{ textDecoration: "none", color: "white" }}
        >
          <RiUserSearchLine />
          Player Search
        </Link>
        <Link
          to="/searchclubs"
          style={{ textDecoration: "none", color: "white" }}
        >
          <AiOutlineFileSearch />
          Club Search
        </Link>
      </div>

      <div className="nav__navigation">
        <div className="nav__icon">
          <Link to="/">
            <FaRegUserCircle color="white" size="2.5rem" />
          </Link>
          <div className="navtext">Profile</div>
        </div>
        <div>
          <Link to="/myclub">
            <BsShieldShaded color="white" size="2.5rem" />
          </Link>
          <div className="navtext">My Club</div>
        </div>
        <div className="notifications">
          <div className="notification__box">
            <Link to="/notifications">
              <BsInbox color="white" size="2.5rem" />
            </Link>
            {notificationCircleShow()}
          </div>
          <div className="navtext">Notifications</div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
