import React, { useState } from "react";
import axios from "axios";
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
  const [usersObj, setUsersObj] = useState({ user: "" });
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
            console.log(childSnapshot.val().username);
          }
        });
        setUserFilteredArray(userArray);
      });

    // console.log(usersObj.user.length);
    // axios
    //   .get(
    //     "http://localhost:5000/users/searchuser/" +
    //       system +
    //       "/" +
    //       primaryposition +
    //       "/" +
    //       timezone
    //   )
    //   .then((response) => {
    //     console.log(response);
    //     if (response.data.length > 0) {
    //       setUsersObj({
    //         user: response.data,
    //       });
    //     } else {
    //       setUsersObj({
    //         user: "",
    //       });
    //     }
    //   });
  }

  function searchByUsername(e) {
    e.preventDefault();

    userRef
      .orderByChild("username")
      .equalTo(username)
      .on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          userArray.push(childSnapshot.key);
          console.log(childSnapshot);
        });
        setUserFilteredArray(userArray);
      });

    // axios
    //   .get("http://localhost:5000/users/searchuserbyname/" + username)
    //   .then((response) => {
    //     console.log(response);
    //     if (response.data.length > 0) {
    //       setUsersObj({
    //         user: response.data,
    //       });
    //     } else {
    //       setUsersObj({
    //         user: "",
    //       });
    //     }
    //   });
  }

  function systemSwitcher(e) {
    switch (e) {
      case "ps4":
        return "PS4";
      case "xboxone":
        return "Xbox One";
      case "ps5":
        return "PS5";
      case "xbox":
        return "Xbox (4th Gen)";
      case "pc":
        return "PC";
      default:
        return "N/A";
    }
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

            <select
              className="search__select"
              onChange={(e) => setTimezone(e.target.value)}
            >
              <option defaultValue value="EST">
                EST
              </option>
              <option value="EUR">EUR</option>
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
          <BiShieldQuarter size="1.6em" color="darkgreen" />
          {" = On Contract"}
        </div>

        <table>
          <tbody>
            {userFilteredArray.map((userid) => {
              return (
                <UserList
                  key={userid}
                  userid={userid}
                  // system={systemSwitcher(userlist.system)}
                  // username={userlist.username}
                  // redditusername={userlist.redditusername}
                  // clubid={userlist.clubid}
                  // primaryposition={userlist.primaryposition}
                  // primarypositionrating={userlist.primarypositionrating}
                  // timezone={userlist.timezone}
                  // receiverFbid={userlist.firebaseid}
                  senderid={senderid}
                />
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
