import express from "express";
import {
  submitExam,
  getStudentHistory,
  getExamAttempts,
} from "../controllers/examAttemptController.js";

const examAttemptRouter = express.Router();

// Student submits exam
examAttemptRouter.post("/submit", submitExam);

// Student’s own history
examAttemptRouter  .get("/student/:studentId", getStudentHistory);

// Admin: get all attempts for a specific exam
examAttemptRouter.get("/exam/:examId", getExamAttempts);

export default examAttemptRouter;
