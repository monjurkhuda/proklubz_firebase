import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navigation from "./Navigation";
import Lineup from "./Lineup";
import axios from "axios";
import { BiShieldQuarter } from "react-icons/bi";
import { FaUserTie } from "react-icons/fa";
import "./MyClub.css";
import firebaseApp from "./firebase";

function ClubProfile() {
  const [system, setSystem] = useState();
  const [clubname, setClubname] = useState();
  const [timezone, setTimezone] = useState();
  const [playstyle, setPlaystyle] = useState();
  const [managerid, setManagerid] = useState("");
  const [redditusername, setRedditusername] = useState("");
  const [managerusername, setManagerusername] = useState("");
  const [lineupObj, setLineupObj] = useState({ players: "" });
  const [disabledRequestButton, setDisabledRequestButton] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const { clubid } = useParams("");

  const senderid = firebaseApp.auth().currentUser.uid;
  const db = firebaseApp.database();
  const allClubsRef = db.ref("/clubs");
  const clubRef = db.ref().child("clubs/" + clubid);

  let lineupArray = [];

  useEffect(() => {
    clubRef.once("value", (snapshot) => {
      setClubname(snapshot.val().clubname);
      setSystem(snapshot.val().system);
      setTimezone(snapshot.val().timezone);
      setPlaystyle(snapshot.val().playstyle);
      setManagerid(snapshot.val().managerid);
    });

    const managerRef = db.ref().child("users/" + managerid);
    managerRef.once("value", (snapshot) => {
      setManagerusername(snapshot.val().username);
    });

    setLoading(false);
    // axios
    //   .get("http://localhost:5000/clubs/managerfirebaseid/" + managerfirebaseid)
    //   .then((myClub) => {
    //     if (myClub.data.length > 0) {
    //       setClubname(myClub.data[0].clubname);
    //       setSystem(myClub.data[0].system);
    //       setTimezone(myClub.data[0].timezone);
    //       setPlaystyle(myClub.data[0].playstyle);
    //       const lineupObjExtractor = myClub.data[0].players;
    //       if (lineupObjExtractor.length > 0) {
    //         setLineupObj({ players: lineupObjExtractor });
    //       } else {
    //         setLineupObj({ players: "" });
    //       }
    //     }
    //   });

    console.log(
      managerusername,
      clubname,
      system,
      timezone,
      playstyle,
      managerid
    );
  }, [managerusername, clubname, system, timezone, playstyle, managerid]);

  // const notification = {
  //   notificationFromFirebaseId: senderFbid,
  //   notificationType: "REQUEST_TO_JOIN",
  // };

  const lineupRef = db.ref().child("lineups/" + clubid);

  lineupRef.on("value", async function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      lineupArray.push(childSnapshot.key);
      console.log(childSnapshot);
    });
    console.log(lineupArray);
  });

  const notifRef = db.ref().child("notifications/" + managerid);

  function requestToJoin() {
    allClubsRef
      .orderByChild("managerid")
      .equalTo(senderid)
      .once("value", async function (snapshot) {
        const doesSnapshotHaveData = await snapshot.val();
        if (doesSnapshotHaveData) {
          alert(
            "You must delete your club or hand over manager rights to a club member before you can join another club."
          );
          return;
        } else {
          notifRef
            .orderByChild("senderid")
            .equalTo(senderid)
            .once("value", async function (snapshot) {
              const doesSnapshotHaveData = await snapshot.val();
              if (!doesSnapshotHaveData) {
                notifRef.push({
                  notiftype: "REQUEST_TO_JOIN",
                  senderid: senderid,
                });
              }
            });
          setDisabledRequestButton(true);
        }
      });

    // axios
    //   .post(
    //     "http://localhost:5000/users/notification/" + managerfirebaseid,
    //     notification
    //   )
    //   .then((res) => console.log(res.data));
  }

  // axios
  //   .get("http://localhost:5000/users/firebaseid/" + managerfirebaseid)
  //   .then((loadedUser) => {
  //     setRedditusername(loadedUser.data[0].redditusername);
  //     setManagerusername(loadedUser.data[0].username);
  //   });

  function hideRedditMessage() {
    return redditusername.length === 0 ? true : false;
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

  return (
    <div className="club__container">
      <div className="club__inner__container">
        <div className="clubname">
          <BiShieldQuarter size="1.2em" />
          {clubname}
        </div>
        <div className="clubname">
          <FaUserTie size="1.2em" />
          {managerusername}
        </div>
        <div className="club__system__timezone">
          <div className="club__system">{systemStyler(system)}</div>
          <div className="club__timezone">{timezone}</div>
        </div>
        <button
          className="club__button"
          onClick={() => requestToJoin()}
          disabled={disabledRequestButton}
        >
          Request To Join
        </button>
        <div className="clubprofile__reddit__button">
          <a
            href={`https://www.reddit.com/message/compose/?to=${redditusername}`}
          >
            <button disabled={hideRedditMessage()}>Reddit 💬</button>
          </a>
        </div>
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
                  isManager={false}
                  managerid={managerid}
                  clubid={clubid}
                />
              );
            })}
          </tbody>
        </table>
      </div>
      <Navigation />
    </div>
  );
}

export default ClubProfile;
