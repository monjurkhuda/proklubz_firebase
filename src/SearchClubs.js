import React, { useState } from "react";
import ClubList from "./ClubList";
import Navigation from "./Navigation";
import firebaseApp from "./firebase";
import "./SearchFilters.css";

function SearchClubs() {
  const [system, setSystem] = useState("ps4");
  const [clubname, setClubname] = useState("");
  const [timezone, setTimezone] = useState("EST");
  const [availablePos, setAvailablePos] = useState("wantany");
  const [clubFilteredArray, setClubFilteredArray] = useState([]);

  const senderid = firebaseApp.auth().currentUser.uid;
  const db = firebaseApp.database();
  const clubRef = db.ref("clubs/");
  let clubArray = [];

  function searchHandler(e) {
    e.preventDefault();
    setClubFilteredArray([""]);

    clubRef
      .orderByChild(availablePos)
      .equalTo("yes")
      .on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          if (
            childSnapshot.val().system === system &&
            childSnapshot.val().timezone === timezone
          ) {
            clubArray.push(childSnapshot.key);
            console.log(childSnapshot);
          }
        });
        setClubFilteredArray(clubArray);
      });
  }

  function searchByClubname(e) {
    e.preventDefault();

    clubRef
      .orderByChild("clubname")
      .equalTo(clubname)
      .on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          clubArray.push(childSnapshot.key);
          console.log(childSnapshot);
        });
        setClubFilteredArray(clubArray);
      });
  }

  return (
    <div className="search__container">
      <div className="search__filters__container">
        <h4>Search Clubs</h4>
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
            <option value="Australia/New Zealand">Australia/New Zealand</option>
            <option value="South Africa">South Africa</option>
            <option value="Middle East">Middle East</option>
          </select>
        </div>

        <div>
          <label>Available Position: </label>
          <select
            className="search__select"
            onChange={(e) => setAvailablePos(e.target.value)}
          >
            <option defaultValue value="wantany">
              ANY
            </option>
            <option value="wantgk">GK</option>
            <option value="wantrb">RB</option>
            <option value="wantcb">CB</option>
            <option value="wantlb">LB</option>
            <option value="wantcdm">CDM</option>
            <option value="wantcm">CM</option>
            <option value="wantcam">CAM</option>
            <option value="wantrw">RW</option>
            <option value="wantst">ST</option>
            <option value="wantlw">LW</option>
          </select>
          <button className="search__select" onClick={searchHandler}>
            🔍
          </button>
        </div>

        <div>
          <input
            className="search__select"
            placeholder="EXACT Club Name..."
            onChange={(e) => setClubname(e.target.value)}
          ></input>

          <button className="search__select" onClick={searchByClubname}>
            🔍
          </button>
        </div>
      </div>

      <table>
        <tbody>
          {clubFilteredArray.map((clubid) => {
            return (
              <ClubList key={clubid} clubid={clubid} senderid={senderid} />
            );
          })}
        </tbody>
      </table>
      <Navigation />
    </div>
  );
}

export default SearchClubs;
