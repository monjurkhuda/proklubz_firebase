import React, { useState } from "react";
import axios from "axios";
import UserList from "./UserList";
import Navigation from "./Navigation";
import firebaseApp from "./firebase";
import "./SearchFilters.css";

function SearchPlayers() {
  const [system, setSystem] = useState("ps4");
  const [username, setUsername] = useState("");
  const [primaryposition, setPrimaryposition] = useState("GK");
  const [timezone, setTimezone] = useState("EST");
  const [usersObj, setUsersObj] = useState({ user: "" });

  const senderFirebaseid = firebaseApp.auth().currentUser.uid;

  function searchHandler(e) {
    e.preventDefault();

    console.log(usersObj.user.length);

    axios
      .get(
        "http://localhost:5000/users/searchuser/" +
          system +
          "/" +
          primaryposition +
          "/" +
          timezone
      )
      .then((response) => {
        console.log(response);
        if (response.data.length > 0) {
          setUsersObj({
            user: response.data,
          });
        } else {
          setUsersObj({
            user: "",
          });
        }
      });
  }

  function searchByUsername(e) {
    e.preventDefault();

    axios
      .get("http://localhost:5000/users/searchuserbyname/" + username)
      .then((response) => {
        console.log(response);
        if (response.data.length > 0) {
          setUsersObj({
            user: response.data,
          });
        } else {
          setUsersObj({
            user: "",
          });
        }
      });
  }

  console.log(usersObj);

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

      <table>
        <tbody>
          {Array.from(usersObj.user).map((userlist) => {
            return (
              <UserList
                key={userlist._id}
                system={systemSwitcher(userlist.system)}
                username={userlist.username}
                redditusername={userlist.redditusername}
                clubid={userlist.clubid}
                primaryposition={userlist.primaryposition}
                primarypositionrating={userlist.primarypositionrating}
                timezone={userlist.timezone}
                receiverFbid={userlist.firebaseid}
                senderFbid={senderFirebaseid}
              />
            );
          })}
        </tbody>
      </table>
      <Navigation />
    </div>
  );
}

export default SearchPlayers;
