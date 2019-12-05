import React from 'react';
import QuizLayout from './components/quiz-layout';
import './App.css';

function App() {
  return (
    <React.Fragment>
      <h1>Quiz on Important Facts</h1>
      <div className="quiz-container">
        <QuizLayout></QuizLayout>
      </div>
      <button id="previous">Previous Question</button>
      <button id="next">Next Question</button>
      <button id="submit">Submit Quiz</button>
      <div id="results"></div>
    </React.Fragment>
  );
}

export default App;
