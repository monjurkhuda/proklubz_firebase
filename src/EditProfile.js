import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
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
  const [isLoading, setLoading] = useState(true);

  const history = useHistory();
  const userid = firebaseApp.auth().currentUser.uid;
  const db = firebaseApp.database();
  const profileRef = db.ref("users/" + userid);

  useEffect(() => {
    profileRef.once("value", (snapshot) => {
      setUsername(snapshot.val().username);
      setSystem(snapshot.val().system);
      setPrimaryposition(snapshot.val().primaryposition);
      setPrimarypositionrating(snapshot.val().primarypositionrating);
      setTimezone(snapshot.val().timezone);
      setPlaystyle(snapshot.val().playstyle);
      setRedditusername(snapshot.val().redditusername);
      setLoading(false);
    });
  }, []);

  function saveHandler(e) {
    e.preventDefault();

    profileRef.update({
      system: system,
      username: username,
      primaryposition: primaryposition,
      primarypositionrating: primarypositionrating,
      timezone: timezone,
      playstyle: playstyle,
      redditusername: redditusername,
    });

    history.push("/");
  }

  function cancelHandler(e) {
    e.preventDefault();
    history.push("/");
  }

  if (isLoading) {
    return <div className="App">Loading...</div>;
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
            <option value="xboxx">Xbox X</option>
            <option value="pc">PC</option>
          </select>

          <select
            className="edit__select"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          >
            <option value="British Isles">British Isles</option>
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
            <option value="LB">LB</option>
            <option value="CDM">CDM</option>
            <option value="CM">CM</option>
            <option value="CAM">CAM</option>
            <option value="RW">RW</option>
            <option value="ST">ST</option>
            <option value="LW">LW</option>
          </select>

          <select
            className="edit__select"
            value={primarypositionrating}
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
