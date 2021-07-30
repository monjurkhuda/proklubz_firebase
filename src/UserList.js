import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BiShieldQuarter } from "react-icons/bi";
import { SiReddit } from "react-icons/si";
import "./UserList.css";

function UserList(props) {
  const [disabledInviteButton, setDisabledInviteButton] = useState(false);
  const [clubname, setClubname] = useState("");
  const senderFbid = props.senderFbid;
  const receiverFbid = props.receiverFbid;
  const username = props.username;
  const clubid = props.clubid;
  const redditusername = props.redditusername;
  console.log(props);

  axios.get("http://localhost:5000/clubs/" + clubid).then((res) => {
    if (res.data?.length > 0) {
      setClubname(res.data[0].clubname);
    }
  });

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
              "http://localhost:5000/users/notification/" + receiverFbid,
              notification
            )
            .then((res) => console.log(res.data));

          setDisabledInviteButton(true);
        } else {
          alert("You don't have a club to invite to!");
        }
      });
  }

  function hideRedditMessage() {
    return redditusername.length === 0 ? true : false;
  }

  function clubBadgeShow() {
    if (clubname.length > 0) {
      return <BiShieldQuarter size="1.6em" color="darkgreen" />;
    } else {
      return "";
    }
  }

  return (
    <tr>
      <td>{props.primaryposition}</td>
      <td className="positionratingtd">{props.primarypositionrating}</td>
      <td className="usernametd">
        <Link style={{ textDecoration: "none" }} to={`/users/${receiverFbid}`}>
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
            disabled={hideRedditMessage()}
          >
            <SiReddit size="1.8em" />
          </button>
        </a>
      </td>
    </tr>
  );
}

export default UserList;
