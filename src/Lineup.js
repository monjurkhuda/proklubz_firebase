import React, { useState, useEffect } from "react";
import firebaseApp from "./firebase";
import { Link, useHistory } from "react-router-dom";
import "./Lineup.css";

function Lineup(props) {
  const [username, setUsername] = useState("");
  const [primaryposition, setPrimaryposition] = useState("");
  const [primarypositionrating, setPrimarypositionrating] = useState("");
  const [timezone, setTimezone] = useState("");

  const history = useHistory();
  const currentUserid = firebaseApp.auth().currentUser.uid;

  const userid = props.userid;
  const isManager = props.isManager;
  const managerid = props.managerid;
  const clubid = props.clubid;

  const db = firebaseApp.database();
  const userRef = db.ref().child("users/" + userid);
  const lineupPlayerRef = db.ref().child("lineups/" + clubid + "/" + userid);
  const clubRef = db.ref().child("clubs/" + clubid);

  function hideRemoveAndMakeManagerButtons() {
    if (!isManager || userid === managerid) {
      return true;
    } else {
      return false;
    }
  }

  useEffect(() => {
    userRef.once("value", (snapshot) => {
      setUsername(snapshot.val().username);
      setPrimaryposition(snapshot.val().primaryposition);
      setPrimarypositionrating(snapshot.val().primarypositionrating);
      setTimezone(snapshot.val().timezone);
    });
  }, []);

  function removePlayer() {
    userRef.update({ clubid: "" });
    lineupPlayerRef.remove();
    history.push("/myclub");
  }

  function makeManager() {
    clubRef.update({ managerid: userid });
    window.location.reload();
  }

  console.log(primaryposition);

  return (
    <tr>
      <td className={primaryposition}>{primaryposition}</td>
      <td className="positionratingtd">{primarypositionrating}</td>
      <td className="usernametd">
        <Link style={{ textDecoration: "none" }} to={`/users/${userid}`}>
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
