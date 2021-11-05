import React, { useState, useEffect } from "react";
import firebaseApp from "./firebase";
import { Link } from "react-router-dom";
import { BiShieldQuarter } from "react-icons/bi";
import { SiReddit } from "react-icons/si";
import "./UserList.css";

function UserList(props) {
  const [clubid, setClubid] = useState("");
  const [playstyle, setPlaystyle] = useState();
  const [primaryposition, setPrimaryposition] = useState();
  const [primarypositionrating, setPrimarypositionrating] = useState();
  const [redditusername, setRedditusername] = useState("");
  const [system, setSystem] = useState();
  const [timezone, setTimezone] = useState();
  const [username, setUsername] = useState();
  const [managerClubname, setManagerClubname] = useState();
  const [disabledInviteButton, setDisabledInviteButton] = useState(false);

  const userid = props.userid;
  const senderid = props.senderid;
  const db = firebaseApp.database();
  const userRef = db.ref().child("users/" + userid);
  const managerClubRef = db.ref("clubs/");

  //let managerClub = "";

  useEffect(() => {
    userRef.once("value", (snapshot) => {
      setClubid(snapshot.val().clubid);
      setPlaystyle(snapshot.val().playstyle);
      setPrimaryposition(snapshot.val().primaryposition);
      setPrimarypositionrating(snapshot.val().primarypositionrating);
      setRedditusername(snapshot.val().redditusername);
      setSystem(snapshot.val().system);
      setTimezone(snapshot.val().timezone);
      setUsername(snapshot.val().username);
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
    clubid,
    playstyle,
    primaryposition,
    primarypositionrating,
    redditusername,
    system,
    timezone,
    username,
    managerClubname,
  ]);

  console.log(
    clubid,
    playstyle,
    primaryposition,
    primarypositionrating,
    redditusername,
    system,
    timezone,
    username,
    senderid,
    managerClubname
  );

  const notifRef = db.ref().child("notifications/" + userid);

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

  function hideRedditMessage() {
    return redditusername?.length === 0 ? true : false;
  }

  function clubBadgeShow() {
    if (clubid?.length > 0) {
      return <BiShieldQuarter size="1em" color="black" />;
    } else {
      return "";
    }
  }

  return (
    <tr>
      <td>{primaryposition}</td>
      <td className="positionratingtd">{primarypositionrating}</td>
      <td className="usernametd">
        <Link style={{ textDecoration: "none" }} to={`/users/${userid}`}>
          {username}
        </Link>
      </td>
      <td>{clubBadgeShow()}</td>
      <td>
        <button
          className="buttontd"
          onClick={() => invitePlayer()}
          disabled={disabledInviteButton}
        >
          Invite
        </button>
      </td>
      <td>
        <a
          href={`https://www.reddit.com/message/compose/?to=${redditusername}`}
        >
          <button
            className="table__reddit__button"
            hidden={hideRedditMessage()}
          >
            {hideRedditMessage() ? null : <SiReddit size="1.6em" />}
          </button>
        </a>
      </td>
    </tr>
  );
}

export default UserList;
