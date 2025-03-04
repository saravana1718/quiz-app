import { baseUrl, post } from "@utils/coreApiServices";
import React, { useEffect, useState } from "react";

interface Question {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  difficulty: string;
}

const QuizApp: React.FC<{ fileName: string; subject: string }> = ({
  fileName,
  subject,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const getQuizData = async () => {
    const res = await post(
      `${baseUrl}api/v1/quiz/`,
      {
        filenames: [fileName],
        subject: subject,
      },
      { AUTHORIZATION: `Bearer ${token}` }
    );

    setQuestions(res?.data?.question_list);
  };
  useEffect(() => {
    getQuizData();
  }, []);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [markedQuestions, setMarkedQuestions] = useState<number[]>([]);
  const [answers, setAnswers] = useState<(string | null)[]>(
    Array(questions.length).fill(null)
  );

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(answers[currentQuestion + 1]);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(answers[currentQuestion - 1]);
    }
  };

  const handleSelectOption = (option: string) => {
    setSelectedOption(option);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = option;
    setAnswers(newAnswers);
  };

  const handleMarkForReview = () => {
    if (!markedQuestions.includes(currentQuestion)) {
      setMarkedQuestions([...markedQuestions, currentQuestion]);
    }
  };
  const token = localStorage.getItem("accessToken");

  return (
    <>
      {questions?.length ? (
        <div className="quiz-container">
          <h2 className="quiz-title">Reproductive System Quiz</h2>
          <div className="question-section">
            <p className="question">{questions[currentQuestion].question}</p>
            <ul className="options-list">
              {questions[currentQuestion].options.map((option, index) => (
                <li
                  key={index}
                  className={`option ${
                    selectedOption === option ? "selected" : ""
                  }`}
                  onClick={() => handleSelectOption(option)}
                >
                  {option}
                </li>
              ))}
            </ul>
          </div>

          <div className="quiz-footer">
            <button onClick={handlePrevious} disabled={currentQuestion === 0}>
              Previous
            </button>
            <button onClick={handleMarkForReview} className="mark-button">
              Mark for Review
            </button>
            <button
              onClick={handleNext}
              disabled={currentQuestion === questions.length - 1}
            >
              Next
            </button>
          </div>

          <div className="explanation-section">
            <strong>Explanation:</strong>{" "}
            {questions[currentQuestion].explanation}
          </div>
          <div className="difficulty-label">
            <strong>Difficulty:</strong> {questions[currentQuestion].difficulty}
          </div>

          <div className="question-palette">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`palette-item ${
                  index === currentQuestion ? "current" : ""
                }
              ${markedQuestions.includes(index) ? "marked" : ""}
              ${answers[index] !== null ? "answered" : ""}`}
                onClick={() => setCurrentQuestion(index)}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default QuizApp;
