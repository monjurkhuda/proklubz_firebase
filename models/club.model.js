const mongoose = require("mongoose");

const Schema = mongoose.Schema;

var player = new Schema(
  {
    playerFbid: String,
  },
  { _id: false }
);

const clubSchema = new Schema(
  {
    clubname: {
      type: String,
      required: true,
      unique: true,
      minlength: 1,
    },
    playstyle: {
      type: String,
      required: true,
    },
    system: {
      type: String,
      required: true,
    },
    timezone: {
      type: String,
      required: true,
    },
    managerfirebaseid: {
      type: String,
      required: true,
      unique: true,
    },
    wantany: {
      type: String,
      default: "yes",
    },
    wantgk: {
      type: String,
      default: "no",
    },
    wantrb: {
      type: String,
      default: "no",
    },
    wantcb: {
      type: String,
      default: "no",
    },
    players: [player],
  },
  {
    timestamps: true,
  }
);

const Club = mongoose.model("Club", clubSchema);

module.exports = Club;
