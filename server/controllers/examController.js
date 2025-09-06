// controllers/examController.js
import Exam from "../models/exam.js";

// Create a new exam
export async function createExam(req, res) {
  try {
    if (!req.body.examTitle) {
      return res.status(400).json({ error: "Exam title is required" });
    }
    const exam = new Exam(req.body);
    await exam.save();
    res.status(201).json({ message: "Exam created successfully", exam });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Get all exams
export async function getExams(req, res) {
  try {
    const exams = await Exam.find({visibility:"public"});
    res.json(exams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get a single exam by ID
export async function getExamById(req, res) {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ error: "Exam not found" });
    res.json(exam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Update an exam
export async function updateExam(req, res) {
  try {
    console.log("welcome to exam update")
    
    if (!req.body.examTitle) {
      return res.status(400).json({ error: "Exam title is required" });
    }
    console.log("i am here",req.params.id,"i am also here",req.body)
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!exam) return res.status(404).json({ error: "Exam not found" });
    res.json({ message: "Exam updated successfully", exam });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Delete an exam
export async function deleteExam(req, res) {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) return res.status(404).json({ error: "Exam not found" });
    res.json({ message: "Exam deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


export async function getExamsforadmin(req, res) {
  try {
    console.log("welcome to exam for admin")
    const exams = await Exam.find();
    res.json(exams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}