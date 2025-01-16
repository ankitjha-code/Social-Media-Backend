import { Router } from "express";
import {
  submitUserSubmission,
  getUserSubmissions,
} from "../controllers/userSubmissions.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { upload } from "../config/multer.js";

const submissionRouter = Router();

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ message: "File too large. Max size is 5MB" });
    }
    return res.status(400).json({ message: err.message });
  }
  next(err);
};

submissionRouter.post(
  "/add",
  (req, res, next) => {
    upload.array("images", 100)(req, res, (err) => {
      if (err) return handleMulterError(err, req, res, next);
      next();
    });
  },
  submitUserSubmission
);

submissionRouter.get("/get", auth, getUserSubmissions);

export default submissionRouter;
