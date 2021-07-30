import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Navigation from "./Navigation";
import axios from "axios";
import firebaseApp from "./firebase";
import { SiReddit } from "react-icons/si";
import { FiEdit2 } from "react-icons/fi";
import { ImUser } from "react-icons/im";
import "./Profile.css";

function UserProfile() {
  const [system, setSystem] = useState();
  const [username, setUsername] = useState();
  const [primaryposition, setPrimaryposition] = useState();
  const [primarypositionrating, setPrimarypositionrating] = useState();
  const [timezone, setTimezone] = useState();
  const [playstyle, setPlaystyle] = useState();
  const [redditusername, setRedditusername] = useState("");
  const [disabledInviteButton, setDisabledInviteButton] = useState(false);

  const { firebaseid } = useParams("");
  const senderFbid = firebaseApp.auth().currentUser.uid;

  console.log(firebaseid);

  useEffect(() => {
    axios
      .get("http://localhost:5000/users/firebaseid/" + firebaseid)
      .then((loadedUser) => {
        console.log(loadedUser);
        setUsername(loadedUser.data[0].username);
        setSystem(loadedUser.data[0].system);
        setPrimaryposition(loadedUser.data[0].primaryposition);
        setPrimarypositionrating(loadedUser.data[0].primarypositionrating);
        setTimezone(loadedUser.data[0].timezone);
        setPlaystyle(loadedUser.data[0].playstyle);
        setRedditusername(loadedUser.data[0].redditusername);
      });
  }, []);

  const notification = {
    notificationFromFirebaseId: senderFbid,
    notificationType: "INVITE_TO_CLUB",
  };

  function invitePlayer() {
    axios
      .get("http://localhost:5000/clubs/managerfirebaseid/" + senderFbid)
      .then((res) => {
        console.log(res);
        console.log(res.data.length);
        if (res.data.length > 0) {
          axios
            .post(
              "http://localhost:5000/users/notification/" + firebaseid,
              notification
            )
            .then((res) => console.log(res.data));

          setDisabledInviteButton(true);
        } else {
          alert("You don't have a club to invite to!");
        }
      });
  }

  console.log(redditusername.length);

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
    <div className="profile__container">
      <div className="userprofile__username">
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
      </div>
      <div className="userprofile__buttons">
        <button
          className="userprofile__invite__button"
          onClick={() => invitePlayer()}
          disabled={disabledInviteButton}
        >
          Invite +
        </button>
        <div className="userprofile__button">
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

      <Navigation />
    </div>
  );
}

export default UserProfile;
