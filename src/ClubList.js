import React, { useState, useEffect } from "react";
import firebaseApp from "./firebase";
import { Link } from "react-router-dom";
import "./ClubList.css";
import { SiReddit } from "react-icons/si";

function ClubList(props) {
  const [disabledJoinButton, setDisabledJoinButton] = useState(false);
  const [redditusername, setRedditusername] = useState("");
  const [managerid, setManagerid] = useState("");
  const [system, setSystem] = useState("");
  const [clubname, setClubname] = useState("");
  const [timezone, setTimezone] = useState("");
  const [playstyle, setPlaystyle] = useState("");

  const senderid = props.senderid;
  const clubid = props.clubid;
  const db = firebaseApp.database();
  const clubRef = db.ref().child("clubs/" + clubid);

  useEffect(() => {
    clubRef.once("value", (snapshot) => {
      setClubname(snapshot.val().clubname);
      setSystem(snapshot.val().system);
      setTimezone(snapshot.val().timezone);
      setPlaystyle(snapshot.val().playstyle);
      setManagerid(snapshot.val().managerid);
    });

    const managerRef = db.ref().child("users/" + managerid);
    managerRef.once("value", (snapshot) => {
      setRedditusername(snapshot.val().redditusername);
    });
  }, [clubname, system, timezone, playstyle, managerid, redditusername]);

  const receiverid = managerid;
  const notifRef = db.ref().child("notifications/" + receiverid);

  function requestToJoin() {
    notifRef
      .orderByChild("senderid")
      .equalTo(senderid)
      .once("value", async function (snapshot) {
        const doesSnapshotHaveData = await snapshot.val();
        if (!doesSnapshotHaveData) {
          notifRef.push({
            notiftype: "REQUEST_TO_JOIN",
            senderid: senderid,
          });
        }
      });
    setDisabledJoinButton(true);
  }

  function hideRedditMessage() {
    return redditusername?.length === 0 ? true : false;
  }

  return (
    <tr>
      <td className="clubnametd">
        <Link style={{ textDecoration: "none" }} to={`/clubs/${clubid}`}>
          {clubname}
        </Link>
      </td>
      <td className="timezonetd">{timezone}</td>
      <td>
        <button
          className="table__button"
          onClick={() => requestToJoin()}
          disabled={disabledJoinButton}
        >
          Join Request
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

export default ClubList;
