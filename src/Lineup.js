import React, { useState, useEffect } from "react";
import axios from "axios";
import firebaseApp from "./firebase";
import { Link, useHistory } from "react-router-dom";
import "./Lineup.css";

function Lineup(props) {
  const [username, setUsername] = useState("");
  const [primaryposition, setPrimaryposition] = useState("");
  const [primarypositionrating, setPrimarypositionrating] = useState("");
  const [timezone, setTimezone] = useState("");

  const history = useHistory();
  const firebaseid = firebaseApp.auth().currentUser.uid;

  const playerFbid = props.playerFbid;
  const isManager = props.isManager;
  const managerFbid = props.managerFbid;
  const clubid = props.clubid;

  console.log(props);

  function hideRemoveAndMakeManagerButtons() {
    if (!isManager || playerFbid === managerFbid) {
      return true;
    } else {
      return false;
    }
  }

  useEffect(() => {
    axios
      .get("http://localhost:5000/users/firebaseid/" + playerFbid)
      .then((res) => {
        if (res.data.length > 0) {
          setUsername(res.data[0].username);
          setPrimaryposition(res.data[0].primaryposition);
          setPrimarypositionrating(res.data[0].primarypositionrating);
          setTimezone(res.data[0].timezone);
        }
      });
  }, []);

  function removePlayer() {
    if (window.confirm("Are you sure you want to kick this player?")) {
      const playerRemovalChanges = {
        clubid: "",
      };
      axios
        .post(
          "http://localhost:5000/users/updateclubid/" + playerFbid,
          playerRemovalChanges
        )
        .then((res) => console.log(res.data));

      const removePlayerFromClub = {
        playerFbid: playerFbid,
      };

      axios
        .post(
          "http://localhost:5000/clubs/removeplayer/" + clubid,
          removePlayerFromClub
        )
        .then((res) => console.log(res.data));

      window.location.reload();
    }
  }

  function makeManager() {
    if (
      window.confirm(
        "Are you sure you want to make this player manager? You will loose control of the club."
      )
    ) {
      const makePlayerManager = {
        playerFbid: playerFbid,
      };

      axios
        .post(
          "http://localhost:5000/clubs/changemanager/" + managerFbid,
          makePlayerManager
        )
        .then((res) => console.log(res.data));

      window.location.reload();
    }
  }

  return (
    <tr>
      <td className="positiontd">{primaryposition}</td>
      <td className="positionratingtd">{primarypositionrating}</td>
      <td className="usernametd">
        <Link style={{ textDecoration: "none" }} to={`/users/${playerFbid}`}>
          {username}
        </Link>
      </td>
      <td>
        <button
          className="remove__player__button"
          hidden={hideRemoveAndMakeManagerButtons()}
          onClick={() => removePlayer()}
        >
          Kick
        </button>
      </td>
      <td>
        <button
          className="make__manager__button"
          hidden={hideRemoveAndMakeManagerButtons()}
          onClick={() => makeManager()}
        >
          Make Manager
        </button>
      </td>
    </tr>
  );
}

export default Lineup;
