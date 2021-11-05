import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navigation from "./Navigation";
import firebaseApp from "./firebase";
import { SiReddit } from "react-icons/si";
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
  const [managerClubname, setManagerClubname] = useState();
  const [disabledInviteButton, setDisabledInviteButton] = useState(false);

  const { userid } = useParams("");
  const senderid = firebaseApp.auth().currentUser.uid;
  const db = firebaseApp.database();
  const userRef = db.ref().child("users/" + userid);
  const managerClubRef = db.ref("clubs/");
  const notifRef = db.ref().child("notifications/" + userid);

  console.log(userid);

  useEffect(() => {
    userRef.once("value", (snapshot) => {
      setUsername(snapshot.val().username);
      setSystem(snapshot.val().system);
      setPrimaryposition(snapshot.val().primaryposition);
      setPrimarypositionrating(snapshot.val().primarypositionrating);
      setTimezone(snapshot.val().timezone);
      setPlaystyle(snapshot.val().playstyle);
      setRedditusername(snapshot.val().redditusername);
    });

    managerClubRef
      .orderByChild("managerid")
      .equalTo(senderid)
      .on("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          const managerClub = childSnapshot.val().clubname;
          setManagerClubname(managerClub);
        });
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

  console.log(managerClubname);

  function invitePlayer() {
    if (managerClubname?.length > 0) {
      notifRef
        .orderByChild("senderid")
        .equalTo(senderid)
        .once("value", async function (snapshot) {
          const doesSnapshotHaveData = await snapshot.val();
          if (!doesSnapshotHaveData) {
            notifRef.push({
              notiftype: "INVITE_TO_CLUB",
              senderid: senderid,
            });
          }
        });
    } else {
      alert("You don't have a club to invite to!");
    }
    setDisabledInviteButton(true);
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
          className="userprofile__button"
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
