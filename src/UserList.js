import React, { useState, useEffect } from "react";
import firebaseApp from "./firebase";
import axios from "axios";
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
  const [clubname, setClubname] = useState();
  const [managerClubname, setManagerClubname] = useState();
  const [disabledInviteButton, setDisabledInviteButton] = useState(false);
  const [inviteSentAlready, setInviteSentAlready] = useState(true);

  const userid = props.userid;
  const senderid = props.senderid;
  let prevSenderid;
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

  // axios.get("http://localhost:5000/clubs/" + clubid).then((res) => {
  //   if (res.data?.length > 0) {
  //     setClubname(res.data[0].clubname);
  //   }
  // });

  // const notification = {
  //   notificationFromFirebaseId: senderFbid,
  //   notificationType: "INVITE_TO_CLUB",
  // };

  function invitePlayer() {
    if (managerClubname?.length > 0) {
      notifRef
        .orderByChild("senderid")
        .equalTo(senderid)
        .on("value", async function (snapshot) {
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
    // axios
    //   .get("http://localhost:5000/clubs/managerfirebaseid/" + senderFbid)
    //   .then((res) => {
    //     console.log(res);
    //     console.log(res.data.length);
    //     if (res.data.length > 0) {
    //       axios
    //         .post(
    //           "http://localhost:5000/users/notification/" + receiverFbid,
    //           notification
    //         )
    //         .then((res) => console.log(res.data));
    //       setDisabledInviteButton(true);
    //     } else {
    //       alert("You don't have a club to invite to!");
    //     }
    //   });
  }

  function hideRedditMessage() {
    return redditusername?.length === 0 ? true : false;
  }

  function clubBadgeShow() {
    if (clubid?.length > 0) {
      return <BiShieldQuarter size="1.6em" color="darkgreen" />;
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
