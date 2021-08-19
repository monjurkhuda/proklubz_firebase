import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import firebaseApp from "./firebase";
import Navigation from "./Navigation";
import Lineup from "./Lineup";
import { BiShieldQuarter } from "react-icons/bi";
import "./MyClub.css";

function MyClub() {
  const [clubid, setClubid] = useState("");
  const [managerid, setManagerid] = useState("");
  const [system, setSystem] = useState("");
  const [clubname, setClubname] = useState("");
  const [timezone, setTimezone] = useState("");
  const [playstyle, setPlaystyle] = useState("");
  const [isLoading, setLoading] = useState(true);

  const userid = firebaseApp.auth().currentUser.uid;
  const history = useHistory();
  const db = firebaseApp.database();
  const userRef = db.ref().child("users/" + userid);

  let lineupArray = [];
  let isManager = false;

  useEffect(() => {
    userRef.once("value", (snapshot) => {
      setClubid(snapshot.val().clubid);
    });

    const clubRef = db.ref().child("clubs/" + clubid);

    clubRef.once("value", (snapshot) => {
      setClubname(snapshot.val().clubname);
      setSystem(snapshot.val().system);
      setTimezone(snapshot.val().timezone);
      setPlaystyle(snapshot.val().playstyle);
      setManagerid(snapshot.val().managerid);
      setLoading(false);
    });
  }, [clubname, system, timezone, playstyle, managerid]);

  const lineupRef = db.ref().child("lineups/" + clubid);
  const lineupPlayerRef = db.ref().child("lineups/" + clubid + "/" + userid);

  lineupRef.on("value", async function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      lineupArray.push(childSnapshot.key);
      console.log(childSnapshot);
    });
    console.log(lineupArray);
  });

  if (managerid === userid) {
    isManager = true;
  }

  function manageClub() {
    history.push("/manageclub");
  }

  function leaveClub() {
    userRef.update({ clubid: "" });
    lineupPlayerRef.remove();
    history.push("/");
  }

  function systemStyler(sys) {
    switch (sys) {
      case "ps4":
        return <div className="profile__system__ps4">PS4</div>;
      case "ps5":
        return <div className="profile__system__ps4">PS5</div>;
      case "xboxone":
        return <div className="profile__system__xboxone">XBOX ONE</div>;
      case "xbox":
        return <div className="profile__system__xboxone">XBOX SERIES X</div>;
      default:
        break;
    }
  }

  if (isLoading) {
    return <div className="App">Loading...</div>;
  }

  function myClubRenderer() {
    if (clubid) {
      return (
        <div className="club__container">
          <div className="club__inner__container">
            <div className="clubname">
              <BiShieldQuarter size="1.2em" />
              {clubname}
            </div>
            <div className="club__system__timezone">
              <div className="club__system">{systemStyler(system)}</div>
              <div className="club__timezone">{timezone}</div>
            </div>
            <button
              hidden={!isManager}
              className="club__button"
              onClick={manageClub}
            >
              Manage Club
            </button>
            <button
              hidden={isManager}
              className="club__button"
              onClick={leaveClub}
            >
              Leave Club
            </button>
          </div>
          <div className="playstyle__container">
            <div className="playstyle__title">Playstyle:</div>
            <div className="playstyle__body">{playstyle}</div>
          </div>

          <div className="lineup__container">
            <table>
              <tbody>
                {lineupArray.map((userid) => {
                  return (
                    <Lineup
                      userid={userid}
                      isManager={isManager}
                      managerid={managerid}
                      clubid={clubid}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    } else {
      return (
        <div className="noclub__container">
          <Link to="/createclub">
            <button className="club__button">Create A Club</button>
          </Link>
          <Link to="/searchclubs">
            <button className="club__button">Join A Club</button>
          </Link>
        </div>
      );
    }
  }

  return (
    <div>
      <div>{myClubRenderer()}</div>
      <Navigation />
    </div>
  );
}

export default MyClub;
