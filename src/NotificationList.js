import React, { useState, useEffect } from "react";
import firebaseApp from "./firebase";
import { Link } from "react-router-dom";
import "./Notifications.css";

function NotificationList(props) {
  const [senderClubname, setSenderClubname] = useState("");
  const [senderUsername, setSenderUsername] = useState("");
  const [senderClubid, setSenderClubid] = useState("");
  const [senderid, setSenderid] = useState("");
  const [myClubid, setMyClubid] = useState("");
  const [notifType, setNotifType] = useState("");

  const myid = firebaseApp.auth().currentUser.uid;
  const notifid = props.notifid;
  const db = firebaseApp.database();
  const specificNotifRef = db
    .ref()
    .child("notifications/" + myid + "/" + notifid);
  const myRef = db.ref().child("users/" + myid);
  const clubRef = db.ref("/clubs");

  console.log(myid, props);

  //Getting name of sender and clubname
  useEffect(() => {
    specificNotifRef.once("value", function (snapshot) {
      console.log(snapshot.val());
      setSenderid(snapshot.val().senderid);
      setNotifType(snapshot.val().notiftype);
    });

    console.log(senderid);

    const senderRef = db.ref().child("users/" + senderid);
    senderRef.once("value", (senderSnapshot) => {
      setSenderUsername(senderSnapshot.val().username);
      setSenderClubid(senderSnapshot.val().clubid);
    });

    console.log("senderClubid", senderClubid);
    console.log("senderClubname", senderClubname);

    if (senderClubid && senderUsername) {
      const senderClubRef = db.ref().child("clubs/" + senderClubid);
      senderClubRef.once("value", async function (clubSnapshot) {
        console.log(clubSnapshot.val());
        setSenderClubname(clubSnapshot.val().clubname);
      });
    }

    myRef.once("value", (senderSnapshot) => {
      setMyClubid(senderSnapshot.val().clubid);
    });
  }, [senderClubid, senderClubname, myClubid, senderid]);

  async function acceptPlayer() {
    console.log(senderid);
    const senderRef = db.ref().child("users/" + senderid);
    console.log(senderRef);
    senderRef.update({
      clubid: myClubid,
    });

    console.log(myClubid);

    const myLineupRef = db.ref().child("lineups/" + myClubid + "/" + senderid);
    console.log(myLineupRef);
    myLineupRef.set(senderid);

    specificNotifRef.set({});

    //Refreshing page to show cleared notifications
    window.location.reload();
  }

  function rejectPlayer() {
    specificNotifRef.set({});

    //Refreshing page to show cleared notifications
    window.location.reload();
  }

  function acceptClub() {
    //Check if user is manager
    clubRef
      .orderByChild("managerid")
      .equalTo(myid)
      .once("value", async function (snapshot) {
        const doesSnapshotHaveData = await snapshot.val();
        if (doesSnapshotHaveData) {
          alert(
            "You must delete your club or hand over manager rights to a club member before you can join another club."
          );
          return;
        }
      });

    myRef.update({
      clubid: senderClubid,
    });

    const senderLineupRef = db
      .ref()
      .child("lineups/" + senderClubid + "/" + myid);
    senderLineupRef.set(myid);

    specificNotifRef.set({});

    //Refreshing page to show cleared notifications
    window.location.reload();
  }

  function rejectClub() {
    specificNotifRef.set({});

    //Refreshing page to show cleared notifications
    window.location.reload();
  }

  if (notifType === "REQUEST_TO_JOIN") {
    return (
      <tr className="notificationtr">
        <td>
          <Link style={{ textDecoration: "none" }} to={`/users/${senderid}`}>
            {senderUsername}
          </Link>
          {" wants to join your club."}
        </td>
        <td>
          <button className="accept__button" onClick={acceptPlayer}>
            +
          </button>
        </td>
        <td>
          <button className="reject__button" onClick={rejectPlayer}>
            x
          </button>
        </td>
      </tr>
    );
  } else {
    return (
      <tr className="notificationtr">
        <td>
          {"The club "}
          <Link style={{ textDecoration: "none" }} to={`/clubs/${senderid}`}>
            {senderClubname}
          </Link>
          {" wants you."}
        </td>
        <td>
          <button className="accept__button" onClick={acceptClub}>
            +
          </button>
        </td>
        <td>
          <button className="reject__button" onClick={rejectClub}>
            x
          </button>
        </td>
      </tr>
    );
  }
}

export default NotificationList;
