import axios from "axios";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import firebaseApp from "./firebase";
import Navigation from "./Navigation";
import "./ManageClub.css";

function ManageClub() {
  const [system, setSystem] = useState("");
  const [clubname, setClubname] = useState("");
  const [timezone, setTimezone] = useState("");
  const [playstyle, setPlaystyle] = useState("");
  const [wantany, setWantany] = useState("");
  const [wantgk, setWantgk] = useState("");
  const [wantrb, setWantrb] = useState("");
  const [wantcb, setWantcb] = useState("");
  const [isLoading, setLoading] = useState(true);

  const firebaseid = firebaseApp.auth().currentUser.uid;
  const history = useHistory();

  useEffect(() => {
    axios
      .get("http://localhost:5000/clubs/managerfirebaseid/" + firebaseid)
      .then((club) => {
        setSystem(club.data[0].system);
        setClubname(club.data[0].clubname);
        setTimezone(club.data[0].timezone);
        setPlaystyle(club.data[0].playstyle);
        setWantany(club.data[0].wantany);
        setWantgk(club.data[0].wantgk);
        setWantrb(club.data[0].wantrb);
        setWantcb(club.data[0].wantcb);
        setLoading(false);
      });
  }, []);

  function posAvailabilitySetter(e) {
    const position = e.target.name;
    const checked = e.target.checked;

    switch (position) {
      case "any":
        if (checked === true) {
          setWantany("yes");
        } else {
          setWantany("no");
        }
        break;

      case "gk":
        if (checked === true) {
          setWantgk("yes");
        } else {
          setWantgk("no");
        }
        break;

      case "rb":
        if (checked === true) {
          setWantrb("yes");
        } else {
          setWantrb("no");
        }
        break;

      case "cb":
        if (checked === true) {
          setWantcb("yes");
        } else {
          setWantcb("no");
        }
        break;

      default:
        break;
    }
  }

  function deleteClub() {
    if (window.confirm("Are you sure you want to delete your club?")) {
      axios
        .get("http://localhost:5000/users/firebaseid/" + firebaseid)
        .then((res) => {
          console.log(res);
          const clubid = res.data[0].clubid;
          axios.delete("http://localhost:5000/clubs/" + clubid);
          history.push("/myclub");
        });
    }
  }

  function saveHandler(e) {
    e.preventDefault();

    const club = {
      system: system,
      clubname: clubname,
      timezone: timezone,
      playstyle: playstyle,
      wantany: wantany,
      wantgk: wantgk,
      wantrb: wantrb,
      wantcb: wantcb,
    };

    axios
      .post("http://localhost:5000/clubs/update/" + firebaseid, club)
      .then((res) => console.log(res.data));

    history.push("/myclub");
  }

  function cancelHandler(e) {
    e.preventDefault();
    history.push("/myclub");
  }

  if (isLoading) {
    return <div className="App">Loading...</div>;
  }

  console.log(wantgk);

  return (
    <div>
      <div className="manageclub__container">
        <h3>Manage Club</h3>

        <div className="editclub__container">
          <div className="editclub__system__timezone">
            <select
              className="editclub__select"
              value={system}
              onChange={(e) => setSystem(e.target.value)}
            >
              <option value="ps4">PS4</option>
              <option value="xboxone">Xbox One</option>
              <option value="ps5">PS5</option>
              <option value="xbox">Xbox (4th Gen)</option>
              <option value="pc">PC</option>
            </select>

            <select
              className="editclub__select"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            >
              <option value="EST">EST</option>
              <option value="EUR">EUR</option>
            </select>
          </div>

          <input
            className="editclub__select"
            placeholder="Club Name"
            maxLength="20"
            value={clubname}
            onChange={(e) => setClubname(e.target.value)}
          ></input>

          <textarea
            className="editclub__select__playstyle"
            placeholder="Playing Style"
            maxLength="90"
            value={playstyle}
            onChange={(e) => setPlaystyle(e.target.value)}
          ></textarea>
        </div>

        <p>Open Positions:</p>
        <div className="open__positions">
          <div className="open__positions__checkbox">
            <input
              className="open__positions__checkbox"
              type="checkbox"
              name="any"
              defaultChecked={wantany === "yes" ? true : false}
              onChange={(e) => posAvailabilitySetter(e)}
            ></input>
            <label for="any">ANY</label>
          </div>

          <div className="open__positions__checkbox">
            <input
              className="open__positions__checkbox"
              type="checkbox"
              name="gk"
              defaultChecked={wantgk === "yes" ? true : false}
              onChange={(e) => posAvailabilitySetter(e)}
            ></input>
            <label for="gk">GK</label>
          </div>

          <div className="open__positions__checkbox">
            <input
              className="open__positions__checkbox"
              type="checkbox"
              name="rb"
              defaultChecked={wantrb === "yes" ? true : false}
              onChange={(e) => posAvailabilitySetter(e)}
            ></input>
            <label for="rb">RB</label>
          </div>

          <div className="open__positions__checkbox">
            <input
              className="open__positions__checkbox"
              type="checkbox"
              name="cb"
              defaultChecked={wantcb === "yes" ? true : false}
              onChange={(e) => posAvailabilitySetter(e)}
            ></input>
            <label for="cb">CB</label>
          </div>
        </div>

        <div className="manageclub__buttons">
          <button className="manageclub__save__button" onClick={saveHandler}>
            Save
          </button>
          <button
            className="manageclub__cancel__button"
            onClick={cancelHandler}
          >
            Cancel
          </button>
        </div>
      </div>

      <button className="deleteclub__button" onClick={deleteClub}>
        💀 Delete Club
      </button>
      <Navigation />
    </div>
  );
}

export default ManageClub;
