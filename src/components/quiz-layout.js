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
    this.myRef = React.createRef();
  }

  componentDidMount() {
    axios.get('http://app-d6fd8297-67ce-4828-9612-73df119b5713.cleverapps.io/v1/init')
    .then(res => {
      this.setState({
        questions: res.data
      });
      ls.remove('quiz_answer');
      ls.set('quiz_questions_count', (res.data.length - 1));
    }).catch(function (error) {
      console.log(error);
    });
  }

  toggleSlide(index) {
    let elements = this.myRef.current;
    if (elements instanceof HTMLElement) {
      const childs = elements.querySelectorAll('.slide');
      elements.querySelector('.active-slide').classList.remove('active-slide');
      childs.forEach((elem, key) => {
        if( key === index) {
          elem.classList.add('active-slide');
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
      ls.remove('quiz_answer');
      ls.remove('quiz_questions_count');
      ls.set('quiz_submission_title', res.data.msg);
      ls.set('quiz_submission_data', res.data.data);
      this.setState({
        result: true
      })
    }).catch(function (error) {
      console.log(error);
    });
  }

  render() {
    const { slide, questions, result } = this.state;
    let showPrev = slide > 0 ? 'show' : 'hide';
    let showNext = slide < ls.get('quiz_questions_count') ? 'show' : 'hide';
    let showSubmit = slide === ls.get('quiz_questions_count') ? 'show' : 'hide';

    return(
      !result ? (
        <React.Fragment>
          <div ref={this.myRef} className="quiz-container">
            {questions.map((question, index) => (
              <div key={question._id} className={ index === 0 ? "slide active-slide" : "slide" }>
                <div className="question"> {question.question} </div>
                <div className="answers">
                  {question.options.map(option => (
                    <button onClick={(e) => this.receiveAns(question._id, option.key, e)} key={option.key}>{option.key}: {option.label}</button>
                  ))}
                </div>
              </div>
              
            ))}
          </div>
          <button className={showPrev} onClick={(e) => this.previousQuestion(e)}>Previous Question</button>
          <button className={showNext} onClick={(e) => this.nextQuestion(e)}>Next Question</button>
          <button className={showSubmit} onClick={(e) => this.prepareResult(e)}>Submit Quiz</button>
        </React.Fragment>
      ) : (
        <QuizResult></QuizResult>
      )
    )
  }
}

export default QuizLayout;