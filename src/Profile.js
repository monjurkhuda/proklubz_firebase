import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import firebaseApp from "./firebase";
import { SiReddit } from "react-icons/si";
import { FiEdit2 } from "react-icons/fi";
import { ImUser } from "react-icons/im";
import "./Profile.css";

function Profile() {
  const [system, setSystem] = useState();
  const [username, setUsername] = useState();
  const [primaryposition, setPrimaryposition] = useState();
  const [primarypositionrating, setPrimarypositionrating] = useState();
  const [timezone, setTimezone] = useState();
  const [playstyle, setPlaystyle] = useState();
  const [redditusername, setRedditusername] = useState();

  const userid = firebaseApp.auth().currentUser.uid;
  const db = firebaseApp.database();
  const profileRef = db.ref("users/" + userid);

  useEffect(() => {
    profileRef.once("value", (snapshot) => {
      setUsername(snapshot.val().username);
      setSystem(snapshot.val().system);
      setPrimaryposition(snapshot.val().primaryposition);
      setPrimarypositionrating(snapshot.val().primarypositionrating);
      setTimezone(snapshot.val().timezone);
      setPlaystyle(snapshot.val().playstyle);
      setRedditusername(snapshot.val().redditusername);
    });
  }, [
    playstyle,
    primaryposition,
    primarypositionrating,
    redditusername,
    system,
    timezone,
    username,
  ]);

  function systemStyler(sys) {
    switch (sys) {
      case "ps4":
        return <div className="profile__system__ps4">PS4</div>;
      case "ps5":
        return <div className="profile__system__ps4">PS5</div>;
      case "xboxone":
        return <div className="profile__system__xboxone">XBOX ONE</div>;
      case "xboxx":
        return <div className="profile__system__xboxone">XBOX X</div>;
      default:
        break;
    }
  }

  return (
    <div className="profile__container">
      <div className="profile__username">
        <ImUser size="1.2em" />
        {username}
      </div>
      <div className="profile__inner__container">
        {systemStyler(system)}
        <div className="profile__position__rating">
          <div className="profile__position">{primaryposition}</div>
          <div className="profile__rating">{primarypositionrating}</div>
        </div>
        <div className="profile__reddit">
          <SiReddit size="1.8em" />
          <span className="profile__reddit__text">{redditusername}</span>
        </div>
        <div className="edit__profile">
          <Link to="/editprofile" style={{ textDecoration: "none" }}>
            <FiEdit2 size="1.3em" /> Edit Profile
          </Link>
        </div>
      </div>
      <div className="playstyle__container">
        <div className="playstyle__title">Playstyle:</div>
        <div className="playstyle__body">{playstyle}</div>
      </div>
    </div>
  );
}

export default Profile;
