// models/exam.js
import { Schema, model } from "mongoose";

const questionSchema = new Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: {
    type: [String], // Array of 4 strings
    validate: {
      validator: function (val) {
        return val.length === 4;
      },
      message: "Each question must have exactly 4 options",
    },
    required: true,
  },
  answer: {
    type: String, // ✅ store actual correct option text
    required: true,
  },
});

const examSchema = new Schema(
  {
    examTitle: {
      type: String,
      required: true,
    },
    examNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    visibility: {
      type: String,
      enum: ["public", "private", "draft"],
      default: "draft",
    },
    questions: [questionSchema],
  },
  { timestamps: true }
);

export default model("Exam", examSchema);
