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
  const [notifType, setNotifType] = useState("");

  const userid = firebaseApp.auth().currentUser.uid;
  const notifid = props.notifid;
  const notificationType = props.type;
  // const fromFirebaseId = props.fromFirebaseId;
  const history = useHistory();
  const db = firebaseApp.database();
  const specificNotifRef = db
    .ref()
    .child("notifications/" + userid + "/" + notifid);

  // const notification = {
  //   notificationFromFirebaseId: fromFirebaseId,
  //   notificationType: notificationType,
  // };

  //Getting name of sender and clubname
  useEffect(() => {
    specificNotifRef.once("value", (snapshot) => {
      setSenderid(snapshot.val().senderid);
      setNotifType(snapshot.val().notiftype);
    });

    const senderRef = db.ref().child("users/" + senderid);
    senderRef.once("value", (senderSnapshot) => {
      setSenderUsername(senderSnapshot.val().username);
      setSenderClubid(senderSnapshot.val().clubid);
    });

    const senderClubRef = db.ref().child("clubs/" + senderClubid);
    senderClubRef.once("value", (clubSnapshot) => {
      clubSnapshot.forEach((childSnapshot) => {
        setSenderClubname(childSnapshot.val().clubname);
      });
    });
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
  }, [senderUsername, senderClubname]);

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
    // console.log("accept club");
    // //Check if user is manager
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
          <Link style={{ textDecoration: "none" }} to={`/clubs/${senderid}`}>
            {senderClubname}
          </Link>
          {" has invited you to join."}
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
