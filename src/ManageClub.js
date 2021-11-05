import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import firebaseApp from "./firebase";
import Navigation from "./Navigation";
import "./ManageClub.css";

function ManageClub() {
  const [clubid, setClubid] = useState("");
  const [system, setSystem] = useState("");
  const [clubname, setClubname] = useState("");
  const [timezone, setTimezone] = useState("");
  const [playstyle, setPlaystyle] = useState("");
  const [wantany, setWantany] = useState("");
  const [wantgk, setWantgk] = useState("");
  const [wantrb, setWantrb] = useState("");
  const [wantcb, setWantcb] = useState("");
  const [wantlb, setWantlb] = useState("");
  const [wantcdm, setWantcdm] = useState("");
  const [wantcm, setWantcm] = useState("");
  const [wantcam, setWantcam] = useState("");
  const [wantrw, setWantrw] = useState("");
  const [wantst, setWantst] = useState("");
  const [wantlw, setWantlw] = useState("");
  const [isLoading, setLoading] = useState(true);

  const userid = firebaseApp.auth().currentUser.uid;
  const history = useHistory();
  const db = firebaseApp.database();
  const userRef = db.ref("users/" + userid);

  useEffect(() => {
    userRef.once("value", (snapshot) => {
      setClubid(snapshot.val().clubid);
    });
    if (clubid) {
      let clubRef = db.ref().child("clubs/" + clubid);
      clubRef.once("value", (snapshot) => {
        setClubname(snapshot.val().clubname);
        setSystem(snapshot.val().system);
        setTimezone(snapshot.val().timezone);
        setPlaystyle(snapshot.val().playstyle);
        setWantany(snapshot.val().wantany);
        setWantgk(snapshot.val().wantgk);
        setWantrb(snapshot.val().wantrb);
        setWantcb(snapshot.val().wantcb);
        setWantlb(snapshot.val().wantlb);
        setWantcdm(snapshot.val().wantcdm);
        setWantcm(snapshot.val().wantcm);
        setWantcam(snapshot.val().wantcam);
        setWantrw(snapshot.val().wantrw);
        setWantst(snapshot.val().wantst);
        setWantlw(snapshot.val().wantlw);
        setLoading(false);
      });
    }
  }, [clubid]);

  console.log(clubid);

  let clubRef = db.ref().child("clubs/" + clubid);
  const lineupRef = db.ref().child("lineups/" + clubid);

  console.log(clubRef);

  console.log(
    clubid,
    clubname,
    system,
    timezone,
    playstyle,
    wantany,
    wantgk,
    wantrb,
    wantcb,
    wantlb,
    wantcdm,
    wantcm,
    wantcam,
    wantrw,
    wantst,
    wantlw
  );

  function posAvailabilitySetter(e) {
    const position = e.target.name;
    const checked = e.target.checked;

    console.log("pos: " + position, "check: " + checked);

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

      case "lb":
        if (checked === true) {
          setWantlb("yes");
        } else {
          setWantlb("no");
        }
        break;

      case "cdm":
        if (checked === true) {
          setWantcdm("yes");
        } else {
          setWantcdm("no");
        }
        break;

      case "cm":
        if (checked === true) {
          setWantcm("yes");
        } else {
          setWantcm("no");
        }
        break;

      case "cam":
        if (checked === true) {
          setWantcam("yes");
        } else {
          setWantcam("no");
        }
        break;

      case "rw":
        if (checked === true) {
          setWantrw("yes");
        } else {
          setWantrw("no");
        }
        break;

      case "st":
        if (checked === true) {
          setWantst("yes");
        } else {
          setWantst("no");
        }
        break;

      case "lw":
        if (checked === true) {
          setWantlw("yes");
        } else {
          setWantlw("no");
        }
        break;

      default:
        break;
    }

    console.log(
      clubid,
      clubname,
      system,
      timezone,
      playstyle,
      wantany,
      wantgk,
      wantrb,
      wantcb,
      wantlb,
      wantcdm,
      wantcm,
      wantcam,
      wantrw,
      wantst,
      wantlw
    );
  }

  function deleteClub() {
    if (window.confirm("Are you sure you want to delete your club?")) {
      clubRef.set({});
      lineupRef.set({});
      userRef.update({ clubid: "" });
      history.push("/myclub");
    }
  }

  function saveHandler(e) {
    e.preventDefault();

    console.log(
      clubid,
      clubname,
      system,
      timezone,
      playstyle,
      wantany,
      wantgk,
      wantcb,
      wantrb,
      wantlb,
      wantcdm,
      wantcm,
      wantcam,
      wantrw,
      wantst,
      wantlw
    );

    clubRef.update({
      system: system,
      clubname: clubname,
      timezone: timezone,
      playstyle: playstyle,
      wantany: wantany,
      wantgk: wantgk,
      wantcb: wantcb,
      wantrb: wantrb,
      wantlb: wantlb,
      wantcdm: wantcdm,
      wantcm: wantcm,
      wantcam: wantcam,
      wantrw: wantrw,
      wantst: wantst,
      wantlw: wantlw,
    });

    history.push("/myclub");
  }

  function cancelHandler(e) {
    e.preventDefault();
    history.push("/myclub");
  }

  if (isLoading) {
    return <div className="App">Loading...</div>;
  }

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
              <option value="xboxx">Xbox X</option>
              <option value="pc">PC</option>
            </select>

            <select
              className="editclub__select"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
            >
              <option value="British Isles">British Isles</option>
              <option value="Western Europe">Western Europe</option>
              <option value="Eastern Europe">Eastern Europe</option>
              <option value="Northern Europe">Northern Europe</option>
              <option value="Southern Europe">Southern Europe</option>
              <option value="Eastern N.America">Eastern N.America</option>
              <option value="Western N.America">Western N.America</option>
              <option value="South America">South America</option>
              <option value="Central America">Central America</option>
              <option value="Northern Asia">Northern Asia</option>
              <option value="Southern Asia">Southern Asia</option>
              <option value="Central Asia">Central Asia</option>
              <option value="Indonesia">Indonesia</option>
              <option value="Australia/New Zealand">
                Australia/New Zealand
              </option>
              <option value="South Africa">South Africa</option>
              <option value="Middle East">Middle East</option>
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

        <div className="open__positions">
          <div>Open Positions:</div>
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

          <div className="open__positions__checkbox">
            <input
              className="open__positions__checkbox"
              type="checkbox"
              name="lb"
              defaultChecked={wantlb === "yes" ? true : false}
              onChange={(e) => posAvailabilitySetter(e)}
            ></input>
            <label for="lb">LB</label>
          </div>

          <div className="open__positions__checkbox">
            <input
              className="open__positions__checkbox"
              type="checkbox"
              name="cdm"
              defaultChecked={wantcdm === "yes" ? true : false}
              onChange={(e) => posAvailabilitySetter(e)}
            ></input>
            <label for="cdm">CDM</label>
          </div>

          <div className="open__positions__checkbox">
            <input
              className="open__positions__checkbox"
              type="checkbox"
              name="cm"
              defaultChecked={wantcm === "yes" ? true : false}
              onChange={(e) => posAvailabilitySetter(e)}
            ></input>
            <label for="cm">CM</label>
          </div>

          <div className="open__positions__checkbox">
            <input
              className="open__positions__checkbox"
              type="checkbox"
              name="cam"
              defaultChecked={wantcam === "yes" ? true : false}
              onChange={(e) => posAvailabilitySetter(e)}
            ></input>
            <label for="cam">CAM</label>
          </div>

          <div className="open__positions__checkbox">
            <input
              className="open__positions__checkbox"
              type="checkbox"
              name="rw"
              defaultChecked={wantrw === "yes" ? true : false}
              onChange={(e) => posAvailabilitySetter(e)}
            ></input>
            <label for="rw">RW</label>
          </div>

          <div className="open__positions__checkbox">
            <input
              className="open__positions__checkbox"
              type="checkbox"
              name="st"
              defaultChecked={wantst === "yes" ? true : false}
              onChange={(e) => posAvailabilitySetter(e)}
            ></input>
            <label for="st">ST</label>
          </div>

          <div className="open__positions__checkbox">
            <input
              className="open__positions__checkbox"
              type="checkbox"
              name="lw"
              defaultChecked={wantlw === "yes" ? true : false}
              onChange={(e) => posAvailabilitySetter(e)}
            ></input>
            <label for="lw">LW</label>
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
        <button className="deleteclub__button" onClick={deleteClub}>
          💀 Delete Club
        </button>
      </div>

      <Navigation />
    </div>
  );
}

export default ManageClub;
