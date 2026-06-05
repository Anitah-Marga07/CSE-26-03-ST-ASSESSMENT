const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Video title is required"],
  },
  description: {
    type: String,
    trim: true,
  },
  quality: {
    type: String,
    trim: true,
    enum: ["1080p", "720p", "480p", "360p"],
    default: "360p",
  },
  publishingDate: {
    type: Date,
  },
  video: {
    type: String,
    required: [true, "Video file is required"],
  },
  thumbnail: {
    type: String,
  },
  uploadDate: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Upload", uploadSchema);
