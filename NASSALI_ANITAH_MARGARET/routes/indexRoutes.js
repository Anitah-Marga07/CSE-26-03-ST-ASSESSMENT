const express = require("express");
const router = express.Router();
const multer = require("multer");

const Upload = require("../models/Upload");

// Video configurations
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Landing route
router.get("/", (req, res) => {
  res.render("index");
});

// Vid-list routes
router.get("/videos", async (req, res) => {
  try {
    const videos = await Upload.find()
      .sort({ uploadDate: -1 })
      .select("title description quality publishingDate thumbnail video");
    
    res.render("vidList", { 
      videos,
      success_msg: req.flash("success"),
      error_msg: req.flash("error")
    });
  } catch (error) {
    console.error("Error loading videos:", error);
    req.flash("error", "Failed to load video list.");
    res.render("vidList", { videos: [], error_msg: req.flash("error") });
  }
});

router.get("/upload", (req, res) => {
  res.render("upload", {
    success_msg: req.flash("success")[0] || "",
    error_msg: req.flash("error")[0] || "",
  });
});

router.post("/upload", upload.fields([{ name: "video" }, { name: "thumbnail" }]), async (req, res) => {
  try {
    const { title, description, quality, publishingDate } = req.body;
    
    const videoFile = req.files["video"] ? req.files["video"][0].path.replace('public/', '') : null;
    const thumbnailFile = req.files["thumbnail"] ? req.files["thumbnail"][0].path.replace('public/', '') : null;

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
    
    return res.redirect("/upload"); 
  } catch (error) {
    console.error("Error saving video:", error);
    req.flash("error", "Server processing error: " + error.message);
    return res.redirect("/upload");
  }
});

module.exports = router;