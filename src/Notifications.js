import axios from "axios";
import React, { useState, useEffect } from "react";
import firebaseApp from "./firebase";
import NotificationList from "./NotificationList.js";
import Navigation from "./Navigation";
import "./Notifications.css";

function Notifications() {
  const [notificationObj, setNotificationObj] = useState({ notifications: "" });

  const firebaseId = firebaseApp.auth().currentUser.uid;

  useEffect(() => {
    axios
      .get("http://localhost:5000/users/firebaseid/" + firebaseId)
      .then((response) => {
        const notificationObjExtractor = response.data[0].notifications;

        if (notificationObjExtractor.length > 0) {
          setNotificationObj({ notifications: notificationObjExtractor });
        } else {
          setNotificationObj({ notifications: "" });
        }
      });
  }, []);

  console.log(notificationObj);

  return (
    <div className="notifications__container">
      <div className="notifications__title">Notifications:</div>
      <div>
        <table className="notificationtable">
          <tbody>
            {Array.from(notificationObj.notifications).map(
              (notificationlist) => {
                return (
                  <NotificationList
                    type={notificationlist.notificationType}
                    fromFirebaseId={notificationlist.notificationFromFirebaseId}
                  />
                );
              }
            )}
          </tbody>
        </table>
      </div>
      <Navigation />
    </div>
  );
}

export default Notifications;
