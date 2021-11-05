import React, { useState } from "react";
import UserList from "./UserList";
import Navigation from "./Navigation";
import firebaseApp from "./firebase";
import { BiShieldQuarter } from "react-icons/bi";
import "./SearchFilters.css";

function SearchPlayers() {
  const [system, setSystem] = useState("ps4");
  const [username, setUsername] = useState("");
  const [primaryposition, setPrimaryposition] = useState("GK");
  const [timezone, setTimezone] = useState("EST");
  const [userFilteredArray, setUserFilteredArray] = useState([]);

  const senderid = firebaseApp.auth().currentUser.uid;
  const db = firebaseApp.database();
  const userRef = db.ref("users/");
  let userArray = [];

  function searchHandler(e) {
    e.preventDefault();

    userRef
      .orderByChild("primaryposition")
      .equalTo(primaryposition)
      .on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          if (
            childSnapshot.val().system === system &&
            childSnapshot.val().timezone === timezone
          ) {
            userArray.push(childSnapshot.key);
          }
        });
        setUserFilteredArray(userArray);
      });
  }

  function searchByUsername(e) {
    e.preventDefault();

    userRef
      .orderByChild("username")
      .equalTo(username)
      .on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          userArray.push(childSnapshot.key);
        });
        setUserFilteredArray(userArray);
      });
  }

  return (
    <div>
      <div className="search__container">
        <div className="search__filters__container">
          <h4>Search Players</h4>
          <div>
            <select
              className="search__select"
              onChange={(e) => setSystem(e.target.value)}
            >
              <option defaultValue value="ps4">
                PS4
              </option>
              <option value="xboxone">Xbox One</option>
              <option value="ps5">PS5</option>
              <option value="xbox">Xbox (4th Gen)</option>
              <option value="pc">PC</option>
            </select>

            <select
              className="search__select"
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
          </div>

          <div>
            <select
              className="search__select"
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
              <option value="Australia/New Zealand">
                Australia/New Zealand
              </option>
              <option value="South Africa">South Africa</option>
              <option value="Middle East">Middle East</option>
            </select>

            <button className="search__select" onClick={searchHandler}>
              🔍
            </button>
          </div>

          <div>
            <input
              className="search__select"
              placeholder="EXACT Username..."
              onChange={(e) => setUsername(e.target.value)}
            ></input>

            <button className="search__select" onClick={searchByUsername}>
              🔍
            </button>
          </div>
        </div>
        <div className="legend">
          <BiShieldQuarter size="1.5em" color="black" />
          <div>{" = under contract"}</div>
        </div>

        <table>
          <tbody>
            {userFilteredArray.map((userid) => {
              return (
                <UserList key={userid} userid={userid} senderid={senderid} />
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="nav__container">
        <Navigation />
      </div>
    </div>
  );
}

export default SearchPlayers;
