const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//Added { _id: false } because otherwise addToSet to array
//was not ensuring unique entries, since the _id was unique everytime
var notification = new Schema(
  {
    notificationFromFirebaseId: String,
    notificationType: String,
  },
  { _id: false }
);

// notification.index(
//   { notificationFromFirebaseId: 1, notificationType: 1 },
//   { unique: true }
// );

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 1,
    },
    primaryposition: {
      type: String,
      default: 70,
    },
    primarypositionrating: {
      type: Number,
      required: true,
    },
    playstyle: {
      type: String,
      default: "",
    },
    system: {
      type: String,
      required: true,
    },
    timezone: {
      type: String,
      required: true,
    },
    clubid: {
      type: String,
    },
    firebaseid: {
      type: String,
      unique: true,
    },
    redditusername: {
      type: String,
    },
    notifications: [notification],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
