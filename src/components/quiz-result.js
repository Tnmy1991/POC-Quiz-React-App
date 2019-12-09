import React from 'react';
import ls from 'local-storage';

class QuizResult extends React.Component{
  restartQuiz() {
    window.location.reload(false);
  }

  render() {
    let title = ls.get('quiz_submission_title');
    let data  = ls.get('quiz_submission_data');

    return(
      <React.Fragment>
        <ol>
          {data.map((item) => (
            <li key={item._id}>
              {item.status ? (
                <React.Fragment>
                  +{item.point}
                  <p className="details">
                    <strong>{item.question}</strong>
                    <strong><i>Correct Ans. {item.correct_ans}</i></strong>
                  </p>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  +0
                  <p className="details">
                    <strong>{item.question}</strong>
                    <strong><i>Correct Ans. {item.correct_ans}</i></strong>
                  </p>
                </React.Fragment>
              )}
            </li>
          ))}
        </ol>
        <h1 className="result">{title}</h1>
        <div className="quiz-navigation">
          <button onClick={(e) => this.restartQuiz(e)}>Restart Quiz</button>
        </div>
      </React.Fragment>
    )
  }
}

export default QuizResult;