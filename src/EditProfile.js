import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import firebaseApp from "./firebase.js";
import Navigation from "./Navigation";
import "./EditProfile.css";

function EditProfile() {
  const [system, setSystem] = useState("");
  const [username, setUsername] = useState("");
  const [primaryposition, setPrimaryposition] = useState("");
  const [primarypositionrating, setPrimarypositionrating] = useState("");
  const [timezone, setTimezone] = useState("");
  const [playstyle, setPlaystyle] = useState("");
  const [redditusername, setRedditusername] = useState("");

  const history = useHistory();
  const firebaseid = firebaseApp.auth().currentUser.uid;

  useEffect(() => {
    axios
      .get("http://localhost:5000/users/firebaseid/" + firebaseid)
      .then((currentUser) => {
        console.log(currentUser);
        setUsername(currentUser.data[0].username);
        setSystem(currentUser.data[0].system);
        setPrimaryposition(currentUser.data[0].primaryposition);
        setPrimarypositionrating(currentUser.data[0].primarypositionrating);
        setTimezone(currentUser.data[0].timezone);
        setPlaystyle(currentUser.data[0].playstyle);
        setRedditusername(currentUser.data[0].redditusername);
      });
  }, []);

  function saveHandler(e) {
    e.preventDefault();

    console.log(firebaseid);
    console.log(system);

    const user = {
      system: system,
      username: username,
      primaryposition: primaryposition,
      primarypositionrating: primarypositionrating,
      timezone: timezone,
      playstyle: playstyle,
      redditusername: redditusername,
    };
    console.log(user);

    axios
      .post("http://localhost:5000/users/update/" + firebaseid, user)
      .then((res) => console.log(res.data));

    history.push("/");
  }

  function cancelHandler(e) {
    e.preventDefault();
    history.push("/");
  }

  return (
    <div>
      <div className="editprofile__container">
        <h3>Edit Profile</h3>
        <div className="edit__system__timezone">
          <select
            className="edit__select"
            value={system}
            onChange={(e) => setSystem(e.target.value)}
          >
            <option value="ps4">PS4</option>
            <option value="xboxone">Xbox One</option>
            <option value="ps5">PS5</option>
            <option value="xbox">Xbox (4th Gen)</option>
            <option value="pc">PC</option>
          </select>

          <select
            className="edit__select"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          >
            <option value="EST">EST</option>
            <option value="EUR">EUR</option>
          </select>
        </div>

        <input
          className="edit__select"
          placeholder="Username"
          maxLength="20"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        ></input>

        <input
          className="edit__select"
          placeholder="Reddit Username"
          maxLength="20"
          value={redditusername}
          onChange={(e) => setRedditusername(e.target.value)}
        ></input>

        <div className="edit__position__positionrating">
          <select
            className="edit__select"
            value={primaryposition}
            onChange={(e) => setPrimaryposition(e.target.value)}
          >
            <option value="GK">GK</option>
            <option value="RB">RB</option>
            <option value="CB">CB</option>
          </select>

          <select
            className="edit__select"
            value={primarypositionrating}
            onChange={(e) => setPrimarypositionrating(e.target.value)}
          >
            <option value="70">70</option>
            <option value="80">80</option>
            <option value="90">90</option>
          </select>
        </div>

        <textarea
          className="edit__select__playstyle"
          maxLength="90"
          placeholder="Playing Style"
          value={playstyle}
          onChange={(e) => setPlaystyle(e.target.value)}
        ></textarea>

        <div className="edit__buttons">
          <button className="edit__save__button" onClick={saveHandler}>
            + Save Changes
          </button>

          <button className="edit__cancel__button" onClick={cancelHandler}>
            x Cancel
          </button>
        </div>
      </div>
      <Navigation />
    </div>
  );
}

export default EditProfile;
