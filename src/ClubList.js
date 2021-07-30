import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./ClubList.css";
import { SiReddit } from "react-icons/si";

function ClubList(props) {
  const [disabledInviteButton, setDisabledInviteButton] = useState(false);
  const [redditusername, setRedditusername] = useState("");
  const [managerusername, setManagerusername] = useState("");

  console.log(props);

  const senderFbid = props.senderFbid;
  const receiverFbid = props.receiverFbid;
  const clubname = props.clubname;

  const notification = {
    notificationFromFirebaseId: senderFbid,
    notificationType: "REQUEST_TO_JOIN",
  };

  function requestToJoin() {
    axios
      .post(
        "http://localhost:5000/users/notification/" + receiverFbid,
        notification
      )
      .then((res) => console.log(res.data));
    setDisabledInviteButton(true);
  }

  axios
    .get("http://localhost:5000/users/firebaseid/" + receiverFbid)
    .then((loadedUser) => {
      setRedditusername(loadedUser.data[0].redditusername);
      setManagerusername(loadedUser.data[0].username);
    });

  function hideRedditMessage() {
    return redditusername.length === 0 ? true : false;
  }

  return (
    <tr>
      <td className="clubnametd">
        <Link style={{ textDecoration: "none" }} to={`/clubs/${receiverFbid}`}>
          {clubname}
        </Link>
      </td>
      <td className="timezonetd">{props.timezone}</td>
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
            disabled={hideRedditMessage()}
          >
            <SiReddit size="1.8em" />
          </button>
        </a>
      </td>
    </tr>
  );
}

export default ClubList;
