import React from 'react';
import ls from 'local-storage';

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slide: 1
    };
  }

  previousQuestion(e) {
    e.preventDefault();
  }

  nextQuestion(e) {
    e.preventDefault();
  }

  prepareResult(e) {
    e.preventDefault();
  }

  render() {
    const { slide } = this.state;
    let showPrev = slide > 1 ? true : false;
    let showSubmit = slide === ls.get('quiz_questions_count') ? 'show' : 'hide';

    return(
      showPrev ? (
        <React.Fragment>
          <button onClick={(e) => this.previousQuestion(e)}>Previous Question</button>
          <button className={showSubmit} onClick={(e) => this.prepareResult(e)}>Submit Quiz</button>
        </React.Fragment>
      ) : (
        <button onClick={(e) => this.nextQuestion(e)}>Next Question</button>
      )
    )
  }
}

export default Navigation;