import React from 'react';
import ls from 'local-storage';

class QuizResult extends React.Component{
  render() {
    let title = ls.get('quiz_submission_title');
    let data  = ls.get('quiz_submission_data');

    return(
      <React.Fragment>
        <h1>{title}</h1>
        <ol>
          {data.map((item) => (
            <li key={item._id}>
              {item.status ? (
                <React.Fragment>
                  +{item.point}
                  <span className="details">Correct</span>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  +0
                  <span className="details">Correct answer is {item.correct_ans}</span>
                </React.Fragment>
              )}
            </li>
          ))}
        </ol>
      </React.Fragment>
    )
  }
}

export default QuizResult;