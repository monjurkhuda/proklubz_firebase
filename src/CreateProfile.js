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
          <option defaultValue value="British Isles">
            British Isles
          </option>
          <option value="Western Europe">Western Europe</option>
          <option value="Eastern Europe">Eastern Europe</option>
          <option value="Northern Europe">Northern Europe</option>
          <option value="Southern Europe">Southern Europe</option>
          <option value="Eastern N.America">Eastern N.America</option>
          <option value="Western N.America">Western N.America</option>
          <option value="South America">South America</option>
          <option value="Central America">Central America</option>
          <option value="Northern Asia">Northern Asia</option>
          <option value="Southern Asia">Southern Asia</option>
          <option value="Central Asia">Central Asia</option>
          <option value="Indonesia">Indonesia</option>
          <option value="Australia/New Zealand">Australia/New Zealand</option>
          <option value="South Africa">South Africa</option>
          <option value="Middle East">Middle East</option>
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
          <option value="80">80</option>
          <option value="81">81</option>
          <option value="82">82</option>
          <option value="83">83</option>
          <option value="84">84</option>
          <option value="85">85</option>
          <option value="86">86</option>
          <option value="87">87</option>
          <option value="88">88</option>
          <option value="89">89</option>
          <option value="90">90</option>
          <option value="91">91</option>
          <option value="92">92</option>
          <option value="93">93</option>
          <option value="94">94</option>
          <option value="95">95</option>
          <option value="96">96</option>
          <option value="97">97</option>
          <option value="98">98</option>
          <option value="99">99</option>
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
