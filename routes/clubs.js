const router = require("express").Router();
const Club = require("../models/club.model");

router.route("/").get((req, res) => {
  Club.find()
    .then((clubs) => res.json(clubs))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const clubname = req.body.clubname;
  const playstyle = req.body.playstyle;
  const system = req.body.system;
  const timezone = req.body.timezone;
  const managerfirebaseid = req.body.managerfirebaseid;

  const newClub = new Club({
    clubname,
    playstyle,
    system,
    timezone,
    managerfirebaseid,
  });

  newClub
    .save()
    .then(() => res.json("Club added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
  Club.findById(req.params.id)
    .then((clubs) => res.json(clubs))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").delete((req, res) => {
  Club.findByIdAndDelete(req.params.id)
    .then((clubs) => res.json("Club deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/managerfirebaseid/:firebaseid").get((req, res) => {
  Club.find({ managerfirebaseid: req.params.firebaseid })
    .then((clubs) => res.json(clubs))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/clubid/:clubid").get((req, res) => {
  Club.find({ _id: req.params.clubid })
    .then((clubs) => res.json(clubs))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/searchclub/:system/:timezone").get((req, res) => {
  console.log(req.params);
  Club.find({
    system: req.params.system,
    timezone: req.params.timezone,
  })
    .then((clubs) => res.json(clubs))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/searchclubbyname/:clubname").get((req, res) => {
  Club.find({
    clubname: req.params.clubname,
  })
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/addplayer/:managerfbid").post((req, res) => {
  Club.findOne({ managerfirebaseid: req.params.managerfbid }).then((club) => {
    console.log(club);
    console.log(req.body);

    const playerFbid = req.body.playerFbid;

    club.players.addToSet({
      playerFbid: playerFbid,
    });

    club
      .save()
      .then(() => res.json("Sent invite to user!"))
      .catch((err) => res.status(400).json("Error: " + err));
  });
});

router.route("/removeplayer/:clubid").post((req, res) => {
  Club.findOne({ _id: req.params.clubid }).then((club) => {
    const playerFbid = req.body.playerFbid;

    club.players.pull({
      playerFbid: playerFbid,
    });

    club
      .save()
      .then(() => res.json("Sent invite to user!"))
      .catch((err) => res.status(400).json("Error: " + err));
  });
});

router.route("/update/:managerfirebaseid").post((req, res) => {
  Club.findOne({ managerfirebaseid: req.params.managerfirebaseid })
    .then((club) => {
      club.system = req.body.system;
      club.clubname = req.body.clubname;
      club.timezone = req.body.timezone;
      club.playstyle = req.body.playstyle;
      club.wantany = req.body.wantany;
      club.wantgk = req.body.wantgk;
      club.wantrb = req.body.wantrb;
      club.wantcb = req.body.wantcb;

      console.log(club);

      club
        .save()
        .then(() => res.json("Club updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/managerfirebaseid/:managerfirebaseid").get((req, res) => {
  Club.find({ managerfirebaseid: req.params.managerfirebaseid })
    .then((clubs) => res.json(clubs))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/changemanager/:managerfirebaseid").post((req, res) => {
  Club.findOne({ managerfirebaseid: req.params.managerfirebaseid })
    .then((club) => {
      club.managerfirebaseid = req.body.playerFbid;

      club
        .save()
        .then(() => res.json("Club has new manager!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
