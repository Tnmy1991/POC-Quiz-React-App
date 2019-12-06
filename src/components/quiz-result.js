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
            <li>
              {item.status ? (
                <React.Fragment>
                  +{item.point}
                  <span class="details">Correct</span>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  +0
                  <span class="details">Correct answer is {item.correct_ans}</span>
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