import React, { useState, useEffect } from "react";
import axios from "axios";
import firebaseApp from "./firebase";
import { useHistory, Link } from "react-router-dom";
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
  //const notificationType = props.type;
  // const fromFirebaseId = props.fromFirebaseId;
  const history = useHistory();
  const db = firebaseApp.database();
  const specificNotifRef = db
    .ref()
    .child("notifications/" + myid + "/" + notifid);
  const myRef = db.ref().child("users/" + myid);
  const clubRef = db.ref("/clubs");

  console.log(myid, props);

  // const notification = {
  //   notificationFromFirebaseId: fromFirebaseId,
  //   notificationType: notificationType,
  // };

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

    //////////////////NOT GETTING SENDER CLUB ID

    if (senderClubid && senderUsername) {
      const senderClubRef = db.ref().child("clubs/" + senderClubid);
      senderClubRef.once("value", async function (clubSnapshot) {
        console.log(clubSnapshot.val());
        setSenderClubname(clubSnapshot.val().clubname);
      });

      console.log("senderClubid", senderClubid);
      console.log("senderClubname", senderClubname);

      myRef.once("value", (senderSnapshot) => {
        setMyClubid(senderSnapshot.val().clubid);
      });
    }
    // axios
    //   .get("http://localhost:5000/users/firebaseid/" + fromFirebaseId)
    //   .then((res) => {
    //     if (res.data.length > 0) {
    //       const nameOfUser = res.data[0].username;
    //       setUsername(nameOfUser);
    //     } else {
    //       setUsername("");
    //     }
    //   });
  }, [senderClubid, senderClubname]);

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:5000/clubs/managerfirebaseid/" + fromFirebaseId)
  //     .then((res) => {
  //       if (res.data.length > 0) {
  //         const nameOfClub = res.data[0].clubname;
  //         const idOfClub = res.data[0]._id;
  //         setClubName(nameOfClub);
  //         setClubid(idOfClub);
  //       } else {
  //         setClubName("");
  //       }
  //     });
  // }, []);

  function acceptPlayer() {
    const senderRef = db.ref().child("users/" + senderid);
    senderRef.update({
      clubid: myClubid,
    });

    const myLineupRef = db.ref().child("lineups/" + myClubid + "/" + senderid);
    myLineupRef.set(senderid);

    specificNotifRef.set({});

    //Refreshing page to show cleared notifications
    window.location.reload();

    // axios
    //   .get("http://localhost:5000/clubs/managerfirebaseid/" + firebaseid)
    //   .then((res) => {
    //     const myclubid = res.data[0]._id;
    //     console.log(myclubid);
    //     const acceptedPlayerUpdate = {
    //       myclubid: myclubid,
    //     };
    //     console.log(fromFirebaseId);
    //     axios
    //       .post(
    //         "http://localhost:5000/users/changeplayerclubid/" + fromFirebaseId,
    //         acceptedPlayerUpdate
    //       )
    //       .then((res) => {
    //         console.log(res.data);
    //       });
    //     const addPlayerToClub = {
    //       playerFbid: fromFirebaseId,
    //     };
    //     axios
    //       .post(
    //         "http://localhost:5000/clubs/addplayer/" + firebaseid,
    //         addPlayerToClub
    //       )
    //       .then((res) => console.log(res.data));
    //   });
    // //get rid of the specific notification
    // axios
    //   .post(
    //     "http://localhost:5000/users/clearonenotification/" + firebaseid,
    //     notification
    //   )
    //   .then((res) => {
    //     //Refreshing page to show cleared notifications
    //     window.location.reload();
    //     console.log(res.data);
    //   });
  }

  function rejectPlayer() {
    specificNotifRef.set({});

    //Refreshing page to show cleared notifications
    window.location.reload();
    // axios
    //   .post(
    //     "http://localhost:5000/users/clearonenotification/" + firebaseid,
    //     notification
    //   )
    //   .then((res) => {
    //     //Refreshing page to show cleared notifications
    //     window.location.reload();
    //     console.log(res.data);
    //   });
  }

  function acceptClub() {
    // //Check if user is manager
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

    // console.log("accept club");
    //Check if user is manager
    // axios
    //   .get("http://localhost:5000/clubs/managerfirebaseid/" + firebaseid)
    //   .then((res) => {
    //     if (res.data.length > 0) {
    //       alert(
    //         "You must delete your club or hand over manager rights to a club member before you can join another club."
    //       );
    //       return;
    //     } else {
    //       const clubAcceptanceChanges = {
    //         clubid: clubid,
    //       };
    //       axios
    //         .post(
    //           "http://localhost:5000/users/updateclubid/" + firebaseid,
    //           clubAcceptanceChanges
    //         )
    //         .then((res) => console.log(res.data));
    //       const addPlayerToClub = {
    //         playerFbid: firebaseid,
    //       };
    //       axios
    //         .post(
    //           "http://localhost:5000/clubs/addplayer/" + fromFirebaseId,
    //           addPlayerToClub
    //         )
    //         .then((res) => console.log(res.data));
    //       axios
    //         .post(
    //           "http://localhost:5000/users/clearnotifications/" + firebaseid
    //         )
    //         .then((res) => {
    //           history.push("/myclub");
    //           console.log(res.data);
    //         });
    //     }
    //   });
  }

  function rejectClub() {
    specificNotifRef.set({});

    //Refreshing page to show cleared notifications
    window.location.reload();
    // axios
    //   .post(
    //     "http://localhost:5000/users/clearonenotification/" + firebaseid,
    //     notification
    //   )
    //   .then((res) => {
    //     //Refreshing page to show cleared notifications
    //     window.location.reload();
    //     console.log(res.data);
    //   });
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
