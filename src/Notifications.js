import axios from "axios";
import React, { useState, useEffect } from "react";
import firebaseApp from "./firebase";
import NotificationList from "./NotificationList.js";
import Navigation from "./Navigation";
import "./Notifications.css";

function Notifications() {
  const [notificationObj, setNotificationObj] = useState({ notifications: "" });
  const [notifFilteredArray, setNotifFilteredArray] = useState([]);

  const userid = firebaseApp.auth().currentUser.uid;
  const db = firebaseApp.database();
  const notifRef = db.ref().child("notifications/" + userid);
  let notifArray = [];

  useEffect(() => {
    notifRef.once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        notifArray.push(childSnapshot.key);
      });
      setNotifFilteredArray(notifArray);
    });

    // axios
    //   .get("http://localhost:5000/users/firebaseid/" + firebaseId)
    //   .then((response) => {
    //     const notificationObjExtractor = response.data[0].notifications;
    //     if (notificationObjExtractor.length > 0) {
    //       setNotificationObj({ notifications: notificationObjExtractor });
    //     } else {
    //       setNotificationObj({ notifications: "" });
    //     }
    //   });
  }, []);

  console.log(notifFilteredArray);

  return (
    <div className="notifications__container">
      <div className="notifications__title">Notifications:</div>
      <div>
        <table className="notificationtable">
          <tbody>
            {notifFilteredArray.map((notifid) => {
              return <NotificationList key={notifid} notifid={notifid} />;
            })}
          </tbody>
        </table>
      </div>
      <Navigation />
    </div>
  );
}

export default Notifications;
