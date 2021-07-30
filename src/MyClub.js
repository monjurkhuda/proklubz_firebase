import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import firebaseApp from "./firebase";
import Navigation from "./Navigation";
import Lineup from "./Lineup";
import { BiShieldQuarter } from "react-icons/bi";
import "./MyClub.css";

function MyClub() {
  const [clubid, setClubid] = useState("");
  const [system, setSystem] = useState("");
  const [clubname, setClubname] = useState("");
  const [timezone, setTimezone] = useState("");
  const [playstyle, setPlaystyle] = useState("");
  const [isManager, setIsManager] = useState(false);
  const [lineupObj, setLineupObj] = useState({ players: "" });

  const firebaseid = firebaseApp.auth().currentUser.uid;
  const history = useHistory();

  useEffect(() => {
    axios
      .get("http://localhost:5000/users/firebaseid/" + firebaseid)
      .then((currentUser) => {
        const idOfClub = currentUser.data[0].clubid;
        setClubid(idOfClub);
        return idOfClub;
      })
      .then((idOfClub) => {
        axios
          .get("http://localhost:5000/clubs/clubid/" + idOfClub)
          .then((myClub) => {
            console.log(myClub);
            if (myClub.data.length > 0) {
              setClubname(myClub.data[0].clubname);
              setSystem(myClub.data[0].system);
              setTimezone(myClub.data[0].timezone);
              setPlaystyle(myClub.data[0].playstyle);

              const lineupObjExtractor = myClub.data[0].players;

              if (lineupObjExtractor.length > 0) {
                setLineupObj({ players: lineupObjExtractor });
              } else {
                setLineupObj({ players: "" });
              }

              if (myClub.data[0].managerfirebaseid === firebaseid) {
                setIsManager(true);
              }
            } else {
              setClubid(false);
            }
          });
      });
  }, []);

  function manageClub() {
    history.push("/manageclub");
  }

  function leaveClub() {
    const removeClubid = {
      clubid: "",
    };

    axios
      .post(
        "http://localhost:5000/users/updateclubid/" + firebaseid,
        removeClubid
      )
      .then((res) => console.log(res.data));

    const removePlayerFromClub = {
      playerFbid: firebaseid,
    };

    axios
      .post(
        "http://localhost:5000/clubs/removeplayer/" + clubid,
        removePlayerFromClub
      )
      .then((res) => console.log(res.data));

    window.location.reload();
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
                {Array.from(lineupObj.players).map((playerlist) => {
                  return (
                    <Lineup
                      playerFbid={playerlist.playerFbid}
                      isManager={isManager}
                      managerFbid={firebaseid}
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
