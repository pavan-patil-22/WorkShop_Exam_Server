import mongoose from "mongoose";

const studentAnswerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId, // reference to question inside exam
    required: true,
  },
  chosenAnswer: {
    type: String, // index (0–3) chosen by student
    
  },
  correctAnswer: {
    type: String, // also store correct one for reference
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
});

const examAttemptSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // assuming you already have User model
      required: true,
    },
    answers: [studentAnswerSchema],
    score: {
      type: Number,
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ExamAttempt", examAttemptSchema);
