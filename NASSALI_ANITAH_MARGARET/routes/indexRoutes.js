const express = require("express");
const router = express.Router();
const multer = require("multer");

const Upload = require("../models/Upload");

// video configurations
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// landing route
router.get("/", (req, res) => {
  res.render("index");
});

// vid-list routes
router.get("/videos", async (req, res) => {
  try {
    const videos = await Upload.find()
      .sort({ uploadDate: -1 })
      .select("title description quality publishingDate thumbnail video");
    res.render("vidList", { videos });
  } catch (error) {
    console.error("Error loading videos:", error);
    req.flash("error", "Failed to load video list.");
    res.render("vidList", { videos: [] });
  }
});

router.get("/upload", (req, res) => {
  res.render("upload");
});

router.post("/upload", upload.fields([{ name: "video" }, { name: "thumbnail" }]), async (req, res) => {
  try {
    const { title, description, quality, publishingDate } = req.body;
    const videoFile = req.files["video"] ? req.files["video"][0].path : null;
    const thumbnailFile = req.files["thumbnail"] ? req.files["thumbnail"][0].path : null;

    const newUpload = new Upload({
      title,
      description,
      quality,
      publishingDate,
      video: videoFile,
      thumbnail: thumbnailFile,
    });

    await newUpload.save();

    req.flash("success", "Video has been uploaded successfully!");
    return res.redirect("/videos");
  } catch (error) {
    console.error("Error saving video:", error);
    req.flash("error", "Server processing error: " + error.message);
    return res.redirect("/upload");
  }
});

//this exposes the contents of this file to other files in the folder
module.exports = router;
