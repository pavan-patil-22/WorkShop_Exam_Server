// controllers/examAttemptController.js
import Exam from "../models/exam.js";
import ExamAttempt from "../models/examAttempt.js";

export async function submitExam(req, res) {
  try {
    const { examId, studentId, answers } = req.body; 
    // answers = [{ questionId, chosenAnswer }] where chosenAnswer is a STRING

    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ error: "Exam not found" });

    let score = 0;
    const processedAnswers = answers.map((ans) => {
      const question = exam.questions.id(ans.questionId);

      const isCorrect = question.answer === ans.chosenAnswer;
      if (isCorrect) score++;

      return {
        questionId: ans.questionId,
        chosenAnswer: ans.chosenAnswer,
        correctAnswer: question.answer,
        isCorrect,
      };
    });

    const totalQuestions = exam.questions.length;
    const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

    const attempt = new ExamAttempt({
      exam: examId,
      student: studentId,
      answers: processedAnswers,
      score,
      totalQuestions,
      percentage,
    });

    await attempt.save();
    console.log("the data is here",attempt)
    res.status(201).json({ message: "Exam submitted", attempt });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


// Get student exam history
export async function getStudentHistory(req, res) {
  try {
    let attempts = await ExamAttempt.find({ student: req.params.studentId })
      .populate("exam", "examNumber visibility questions examTitle")
      .sort({ createdAt: -1 });

    // Attach question text to each answer
    attempts = attempts.map(attempt => {
      const examQuestions = attempt.exam.questions || [];
      const answersWithText = attempt.answers.map(ans => {
        const q = examQuestions.find(q => q._id.toString() === ans.questionId.toString());
        return {
          ...ans.toObject(),
          questionText: q ? q.questionText : "Question not found"
        };
      });
      return {
        ...attempt.toObject(),
        answers: answersWithText,
        exam: {
          examNumber: attempt.exam.examNumber,
          examTitle: attempt.exam.examTitle,
          visibility: attempt.exam.visibility,
        }
      };
    });

    res.json(attempts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get all attempts of an exam (for admin)
export async function getExamAttempts(req, res) {
  try {
    const attempts = await ExamAttempt.find({ exam: req.params.examId })
      .populate("student", "name email usn")
      .sort({ createdAt: -1 });
    res.json(attempts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
