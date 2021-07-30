import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import firebaseApp from "./firebase.js";
import "./CreateClub.css";
import Navigation from "./Navigation.js";

function CreateClub() {
  const [system, setSystem] = useState("ps4");
  const [clubname, setClubname] = useState("");
  const [timezone, setTimezone] = useState("EST");
  const [playstyle, setPlaystyle] = useState("");

  const history = useHistory();
  const managerfirebaseid = firebaseApp.auth().currentUser.uid;

  function createClubHandler(e) {
    e.preventDefault();

    const club = {
      system: system,
      clubname: clubname,
      timezone: timezone,
      playstyle: playstyle,
      managerfirebaseid: managerfirebaseid,
    };
    console.log(club);

    axios
      .post("http://localhost:5000/clubs/add", club)
      .then((res) => console.log(res.data))
      .catch((err) =>
        alert(
          err +
            " --> Failed to create Club! Try a new name. Or, maybe you already have a club :)"
        )
      )
      .then(() => {
        axios
          .get(
            "http://localhost:5000/clubs/managerfirebaseid/" + managerfirebaseid
          )
          .then((myClub) => {
            const clubid = myClub.data[0]._id;
            return clubid;
          })
          .then((clubid) => {
            const onContractUser = {
              clubid: clubid,
            };

            axios
              .post(
                "http://localhost:5000/users/updateclubid/" + managerfirebaseid,
                onContractUser
              )
              .then((res) => console.log(res.data));

            const addPlayerToClub = {
              playerFbid: managerfirebaseid,
            };

            axios
              .post(
                "http://localhost:5000/clubs/addplayer/" + managerfirebaseid,
                addPlayerToClub
              )
              .then((res) => console.log(res.data));
          });
      });

    setTimeout(() => {
      history.push("/myclub");
    }, 200);
  }

  return (
    <div>
      <div className="createclub__container">
        <div className="createclub__system__timezone">
          <select
            className="createclub__select"
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
            className="createclub__select"
            onChange={(e) => setTimezone(e.target.value)}
          >
            <option defaultValue value="EST">
              EST
            </option>
            <option value="EUR">EUR</option>
          </select>
        </div>

        <input
          className="createclub__select"
          placeholder="Club Name"
          onChange={(e) => setClubname(e.target.value)}
        ></input>

        <input
          className="createclub__select"
          placeholder="Playing Style"
          onChange={(e) => setPlaystyle(e.target.value)}
        ></input>

        <button
          disabled={clubname.length < 1 || playstyle.length < 1}
          className="createclub__button"
          onClick={createClubHandler}
        >
          Create Club
        </button>
      </div>
      <Navigation />
    </div>
  );
}

export default CreateClub;
