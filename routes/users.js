const router = require("express").Router();
const User = require("../models/user.model");

router.route("/").get((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const username = req.body.username;
  const primaryposition = req.body.primaryposition;
  const primarypositionrating = Number(req.body.primarypositionrating);
  const playstyle = req.body.playstyle;
  const system = req.body.system;
  const timezone = req.body.timezone;
  const clubid = req.body.clubid;
  const firebaseid = req.body.firebaseid;
  const redditusername = req.body.redditusername;

  const newUser = new User({
    username,
    primaryposition,
    primarypositionrating,
    playstyle,
    system,
    timezone,
    clubid,
    firebaseid,
    redditusername,
  });

  newUser
    .save()
    .then(() => res.json("User added!"))
    .catch((err) => {
      console.log(err);
    });
});

router.route("/:id").get((req, res) => {
  User.findById(req.params.id)
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").delete((req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then((users) => res.json("User deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/firebaseid/:firebaseid").get((req, res) => {
  User.find({ firebaseid: req.params.firebaseid })
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/update/:firebaseid").post((req, res) => {
  User.findOne({ firebaseid: req.params.firebaseid })
    .then((user) => {
      user.username = req.body.username;
      user.primaryposition = req.body.primaryposition;
      user.primarypositionrating = Number(req.body.primarypositionrating);
      user.playstyle = req.body.playstyle;
      user.system = req.body.system;
      user.timezone = req.body.timezone;
      user.redditusername = req.body.redditusername;

      console.log(user);

      user
        .save()
        .then(() => res.json("User updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/updateclubid/:userfirebaseid").post((req, res) => {
  User.findOne({ firebaseid: req.params.userfirebaseid })
    .then((user) => {
      user.clubid = req.body.clubid;

      user
        .save()
        .then(() => res.json("User clubid changed!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router
  .route("/searchuser/:system/:primaryposition/:timezone")
  .get((req, res) => {
    User.find({
      system: req.params.system,
      primaryposition: req.params.primaryposition,
      timezone: req.params.timezone,
    })
      .then((users) => res.json(users))
      .catch((err) => res.status(400).json("Error: " + err));
  });

router.route("/searchuserbyname/:username").get((req, res) => {
  User.find({
    username: req.params.username,
  })
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/notification/:receiverfbid").post((req, res) => {
  User.findOne({ firebaseid: req.params.receiverfbid }).then((user) => {
    console.log(user);
    console.log(req.body);

    const notificationFromFirebaseId = req.body.notificationFromFirebaseId;
    const notificationType = req.body.notificationType;

    user.notifications.addToSet({
      notificationFromFirebaseId: notificationFromFirebaseId,
      notificationType: notificationType,
    });

    user
      .save()
      .then(() => res.json("Sent invite to user!"))
      .catch((err) => res.status(400).json("Error: " + err));
  });
});

router.route("/clearnotifications/:receiverfbid").post((req, res) => {
  User.findOne({ firebaseid: req.params.receiverfbid }).then((user) => {
    user.notifications = [];

    user
      .save()
      .then(() => res.json("Notifications Removed!"))
      .catch((err) => res.status(400).json("Error: " + err));
  });
});

router.route("/clearonenotification/:receiverfbid").post((req, res) => {
  User.findOne({ firebaseid: req.params.receiverfbid }).then((user) => {
    const notificationFromFirebaseId = req.body.notificationFromFirebaseId;
    const notificationType = req.body.notificationType;

    user.notifications.pull({
      notificationFromFirebaseId: notificationFromFirebaseId,
      notificationType: notificationType,
    });

    user
      .save()
      .then(() => res.json("Notifications Removed!"))
      .catch((err) => res.status(400).json("Error: " + err));
  });
});

router.route("/changeplayerclubid/:firebaseid").post((req, res) => {
  User.findOne({ firebaseid: req.params.firebaseid })
    .then((user) => {
      console.log(user);
      console.log(req.body);
      user.clubid = req.body.myclubid;

      user
        .save()
        .then(() => res.json("User has new clubid!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
