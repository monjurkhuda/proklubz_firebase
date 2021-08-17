import React, { useState, useEffect } from "react";
import firebaseApp from "./firebase";
import { Link } from "react-router-dom";
import "./ClubList.css";
import { SiReddit } from "react-icons/si";

function ClubList(props) {
  const [disabledInviteButton, setDisabledInviteButton] = useState(false);
  const [redditusername, setRedditusername] = useState("");
  const [managerusername, setManagerusername] = useState("");
  const [managerid, setManagerid] = useState("");
  const [system, setSystem] = useState("");
  const [clubname, setClubname] = useState("");
  const [timezone, setTimezone] = useState("");
  const [playstyle, setPlaystyle] = useState("");

  const senderFbid = props.senderFbid;
  // const receiverFbid = props.receiverFbid;
  const clubid = props.clubid;
  console.log(props);

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
  }, []);

  console.log(clubname, system, timezone, playstyle, managerid);

  // const notification = {
  //   notificationFromFirebaseId: senderFbid,
  //   notificationType: "REQUEST_TO_JOIN",
  // };

  function requestToJoin() {
    // axios
    //   .post(
    //     "http://localhost:5000/users/notification/" + receiverFbid,
    //     notification
    //   )
    //   .then((res) => console.log(res.data));
    // setDisabledInviteButton(true);
  }

  // axios
  //   .get("http://localhost:5000/users/firebaseid/" + receiverFbid)
  //   .then((loadedUser) => {
  //     setRedditusername(loadedUser.data[0].redditusername);
  //     setManagerusername(loadedUser.data[0].username);
  //   });

  // function hideRedditMessage() {
  //   return redditusername.length === 0 ? true : false;
  // }

  return (
    <tr>
      <td className="clubnametd">
        {clubid}
        {/* <Link style={{ textDecoration: "none" }} to={`/clubs/${receiverFbid}`}>
          {clubname}
        </Link> */}
      </td>
      <td className="timezonetd">{timezone}</td>
      <td>
        <button
          className="table__button"
          onClick={() => requestToJoin()}
          disabled={disabledInviteButton}
        >
          Join
        </button>
      </td>
      <td>
        <a
          href={`https://www.reddit.com/message/compose/?to=${redditusername}`}
        >
          <button
            className="table__reddit__button"
            //disabled={hideRedditMessage()}
          >
            <SiReddit size="1.8em" />
          </button>
        </a>
      </td>
    </tr>
  );
}

export default ClubList;
