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
  const managerid = firebaseApp.auth().currentUser.uid;
  const db = firebaseApp.database();
  const clubRef = db.ref("clubs/");
  const userRef = db.ref().child("users/" + managerid);

  function createClubHandler(e) {
    e.preventDefault();

    //creates a club as well as grab the key to be used as clubid
    const clubid = clubRef
      .push({
        system: system,
        clubname: clubname,
        timezone: timezone,
        playstyle: playstyle,
        managerid: managerid,
        wantany: "yes",
        wantgk: "no",
        wantrb: "no",
        wantcb: "no",
        wantlb: "no",
        wantcdm: "no",
        wantcm: "no",
        wantcam: "no",
        wantrw: "no",
        wantst: "no",
        wantlw: "no",
      })
      .getKey();

    userRef.update({
      clubid: clubid,
    });

    const lineupRef = db.ref().child("lineups/" + clubid + "/" + managerid);

    lineupRef.set(managerid);

    history.push("/myclub");
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
            <option value="xboxx">Xbox X</option>
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
          maxLength="20"
          onChange={(e) => setClubname(e.target.value)}
        ></input>

        <input
          className="createclub__select"
          placeholder="Playing Style"
          maxLength="90"
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
