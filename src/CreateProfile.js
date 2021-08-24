import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import firebaseApp from "./firebase.js";
import "./CreateProfile.css";

function CreateProfile() {
  const [system, setSystem] = useState("ps4");
  const [username, setUsername] = useState("");
  const [primaryposition, setPrimaryposition] = useState("GK");
  const [primarypositionrating, setPrimarypositionrating] = useState(70);
  const [timezone, setTimezone] = useState("EST");
  const [playstyle, setPlaystyle] = useState("");
  const [clubid, setClubid] = useState("");
  const [redditusername, setRedditusername] = useState("");

  const history = useHistory();
  const userid = firebaseApp.auth().currentUser.uid;
  const db = firebaseApp.database();
  const userRef = db.ref().child("users/" + userid);

  function createProfileHandler(e) {
    e.preventDefault();

    userRef.set({
      system: system,
      username: username,
      primaryposition: primaryposition,
      primarypositionrating: primarypositionrating,
      timezone: timezone,
      playstyle: playstyle,
      clubid: clubid,
      redditusername: redditusername,
    });

    setTimeout(() => {
      history.push("/");
    }, 200);
  }

  return (
    <div className="createprofile__container">
      <div className="createprofile__system__timezone">
        <select
          className="createprofile__select"
          onChange={(e) => setSystem(e.target.value)}
        >
          <option defaultValue value="ps4">
            PS4
          </option>
          <option value="xboxone">Xbox One</option>
          <option value="ps5">PS5</option>
          <option value="xboxx">Xbox X</option>
          <option value="pc">PC</option>
        </select>

        <select
          className="createprofile__select"
          onChange={(e) => setTimezone(e.target.value)}
        >
          <option defaultValue value="EST">
            EST
          </option>
          <option value="EUR">EUR</option>
        </select>
      </div>

      <input
        className="createprofile__select"
        placeholder="Username"
        maxLength="20"
        onChange={(e) => setUsername(e.target.value)}
      ></input>

      <input
        className="createprofile__select"
        placeholder="Reddit Username"
        maxLength="20"
        onChange={(e) => setRedditusername(e.target.value)}
      ></input>

      <div className="createprofile__position__positionrating">
        <select
          className="createprofile__select"
          onChange={(e) => setPrimaryposition(e.target.value)}
        >
          <option defaultValue value="GK">
            GK
          </option>
          <option value="RB">RB</option>
          <option value="CB">CB</option>
          <option value="LB">LB</option>
          <option value="CDM">CDM</option>
          <option value="CM">CM</option>
          <option value="CAM">CAM</option>
          <option value="RW">RW</option>
          <option value="ST">ST</option>
          <option value="LW">LW</option>
        </select>

        <select
          className="createprofile__select"
          onChange={(e) => setPrimarypositionrating(e.target.value)}
        >
          <option defaultValue value="70">
            70
          </option>
          <option value="80">80</option>
          <option value="90">90</option>
        </select>
      </div>

      <input
        className="createprofile__select"
        placeholder="Playing Style"
        maxLength="90"
        onChange={(e) => setPlaystyle(e.target.value)}
      ></input>

      <button
        disabled={username.length < 1 || playstyle.length < 1}
        className="createprofile__button"
        onClick={createProfileHandler}
      >
        Create Profile
      </button>
    </div>
  );
}

export default CreateProfile;
