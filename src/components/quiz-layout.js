import React from 'react';
import axios from 'axios';
import ls from 'local-storage';
import QuizResult from './quiz-result';

class QuizLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slide: 0,
      questions: [],
      result: false
    };
    this.quizContainerRef = React.createRef();
    this.quizNavigationRef = React.createRef();

    ls.remove('quiz_answer');
    ls.remove('quiz_submission_data');
    ls.remove('quiz_submission_title');
  }

  componentDidMount() {
    axios.get('http://app-d6fd8297-67ce-4828-9612-73df119b5713.cleverapps.io/v1/init')
    .then(res => {
      this.setState({
        questions: res.data
      });
      ls.set('quiz_questions_count', (res.data.length - 1));
      this.toggleSlide(0);
    }).catch(function (error) {
      console.log(error);
    });
  }

  toggleSlide(index) {
    let elements = this.quizContainerRef.current;
    if (elements instanceof HTMLElement) {
      const childs = elements.querySelectorAll('.slide');
      if( elements.querySelector('.active-slide') )
        elements.querySelector('.active-slide').classList.remove('active-slide');
      childs.forEach((elem, key) => {
        if( key === index) {
          elem.classList.add('active-slide');
          let time_limit = elem.getAttribute("data-countdown");
          let progressBar = elements.querySelector('#remaining-counter-bar-'+index);
          this.progress(time_limit, time_limit, progressBar, index);
        }
      });
      this.setState({
        slide: index
      });
    }
  }

  receiveAns( question_id, option_key, e) {
    e.preventDefault();
    let saveData = ls.get('quiz_answer');
    if(saveData) {
      saveData[question_id] = option_key;
    } else {
      let data = {};
      data[question_id] = option_key;
      saveData = data;
    }
    ls.set('quiz_answer', saveData);
  }

  previousQuestion(e) {
    e.preventDefault();
    let index = this.state.slide - 1;
    this.toggleSlide(index);
  }

  nextQuestion(e) {
    e.preventDefault();
    let index = this.state.slide + 1;
    this.toggleSlide(index);
  }

  prepareResult(e) {
    e.preventDefault();
    axios({
      method: 'post',
      url: 'http://app-d6fd8297-67ce-4828-9612-73df119b5713.cleverapps.io/v1/submission',
      data: {
        answer: ls.get('quiz_answer')
      }
    }).then(res => {
      ls.set('quiz_submission_title', res.data.msg);
      ls.set('quiz_submission_data', res.data.data);
      this.setState({
        result: true
      })
    }).catch(function (error) {
      console.log(error);
    });
  }

  progress(timeleft, timetotal, element, index) {
    let ref = this;
    var progressBarWidth = timeleft * element.offsetWidth / timetotal;
    element.querySelector('div').style.width = progressBarWidth + 'px';
    if(timeleft > 0) {
      setTimeout(function() {
        ref.progress(timeleft - 1, timetotal, element, index);
      }, 1000);
    } else if(timeleft === 0) {
      let elements = this.quizNavigationRef.current;
      if(index === 4)
        elements.querySelector("#submission-button").click();
      else
        elements.querySelector("#next-nav-button").click();
    }
  }

  render() {
    const { slide, questions, result } = this.state;
    let showPrev = slide > 0 ? 'show' : 'hide';
    let showNext = slide < ls.get('quiz_questions_count') ? 'show' : 'hide';
    let showSubmit = slide === ls.get('quiz_questions_count') ? 'show' : 'hide';

    return(
      !result ? (
        <React.Fragment>
          <div ref={this.quizContainerRef} className="quiz-container">
            {questions.map((question, index) => (
              <div key={question._id} data-countdown={question.time_limit} className="slide">
                <div id={'remaining-counter-bar-'+index} className="progressBar">
                  <div className="bar"></div>
                </div>
                <div className="question"> {question.question} </div>
                <div className="answers">
                  {question.options.map(option => (
                    <button onClick={(e) => this.receiveAns(question._id, option.key, e)} key={option.key}>{option.key}: {option.label}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div ref={this.quizNavigationRef} className="quiz-navigation">
            <button id="previous-nav-button" className={showPrev} onClick={(e) => this.previousQuestion(e)}>Previous Question</button>
            <button id="next-nav-button" className={showNext} onClick={(e) => this.nextQuestion(e)}>Next Question</button>
            <button id="submission-button" className={showSubmit} onClick={(e) => this.prepareResult(e)}>Submit Quiz</button>
          </div>
        </React.Fragment>
      ) : (
        <QuizResult></QuizResult>
      )
    )
  }
}

export default QuizLayout;