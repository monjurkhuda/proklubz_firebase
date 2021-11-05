import React, { useState, useEffect } from "react";
import firebaseApp from "./firebase";
import NotificationList from "./NotificationList.js";
import Navigation from "./Navigation";
import "./Notifications.css";

function Notifications() {
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
