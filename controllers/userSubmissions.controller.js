import Submission from "../models/userSubmissions.model.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "submissions" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

export const submitUserSubmission = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "Please upload at least one image" });
    }

    if (!req.body.name || !req.body.socialHandle) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const uploadPromises = req.files.map((file) =>
      uploadToCloudinary(file.buffer).catch((error) => {
        console.error("Cloudinary upload error:", error);
        throw new Error("Failed to upload image to cloud storage");
      })
    );

    const uploadResults = await Promise.all(uploadPromises);
    const imageUrls = uploadResults.map((result) => result.secure_url);

    const submission = new Submission({
      name: req.body.name,
      socialHandle: req.body.socialHandle,
      images: imageUrls,
    });

    await submission.save();
    res.status(201).json(submission);
  } catch (error) {
    console.error("Submission error:", error);
    res.status(400).json({
      message: error.message || "Failed to process submission",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

export const getUserSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
