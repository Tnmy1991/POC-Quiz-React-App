import React from 'react';
import ls from 'local-storage'

class QuizLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      isLoader: true
    };
  }

  componentDidMount() {
    fetch("http://app-d6fd8297-67ce-4828-9612-73df119b5713.cleverapps.io/v1/init", {
      method: 'get',
      headers: {
        "authorization": "Bearer sVXHngaShoUE9r9eg3VxLcS5xsau8"
      }
    }).then(res => res.json()).then(
      (result) => {
        ls.set('quiz_question', result);
        this.setState({
          isLoaded: true,
          isLoader: false
        });
      },
      (error) => {
        this.setState({
          isLoaded: false,
          isLoader: false
        });
      }
    );
  }

  render() {
		const { isLoaded, isLoader } = this.state;

    return(
      <h1>Loading...</h1>
    );
  }
}

export default QuizLayout;