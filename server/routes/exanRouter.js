// routes/examRoutes.js
import { Router } from "express";
const router = Router();
import { createExam, getExams, getExamById, updateExam, deleteExam, getExamsforadmin } from "../controllers/examController.js";

router.post("/", createExam);
router.get("/", getExams);
router.get("/examsforadmin",getExamsforadmin);
router.get("/:id", getExamById);
router.put("/:id", updateExam);
router.delete("/:id", deleteExam);

export default router;