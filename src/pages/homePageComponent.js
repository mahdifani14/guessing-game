import React from 'react';
import { Helmet } from 'react-helmet';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.resetGame = this.resetGame.bind(this);
  }

  getInitialState() {
    return {
       status: 'start',
       nextMove: "Guess a number between 1 and 1000",
       guess: 0,
       try: 0,
       error: null,
       target: null
     };
   }

   resetGame() {
    this.setState(this.getInitialState());
  }

  componentDidMount() {
    this.getRandNum();
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.status === 'win'){
        this.getRandNum();
    }
  }

  getRandNum() {
    fetch('http://localhost:3003/rand')
      .then(response => response.json())
      .then(data => this.setState({ target: data.randomNum }));
  }

  head() {
    return (
      <Helmet>
        <title>Gussing Game</title>
      </Helmet>
    );
  }

  onChange(event) {
    const newValue = Number.parseInt(event.target.value, 10);

    if (!newValue) {
      this.setState({
        error: 'Value must be a number!'
      });
    } else {
      this.setState({
        error: null
      });

      this.setState({
        guess: Number.parseInt(event.target.value, 10)
      });
    }
  }

  onSubmit(event) {
    event.preventDefault();

    const {
      target,
      guess
    } = this.state;

    this.setState({
      try: this.state.try + 1
    });

    if (this.state.guess > 1000 || this.state.guess < 1) {
      this.setState({
        error: 'Value must be between 1 and 1000!'
      });
    }

    if (guess === target) {
      this.setState({status: 'win'});
    } else {
      if (guess > target) {
        this.setState({nextMove: 'Too high'});
      } else {
        this.setState({nextMove: 'Too low'});
      }
    }
  }

  render(){
    if (this.state.status === 'win') {
      return (
        <div style={{textAlign: 'center'}}>
          <h1 style={{color: 'green'}}>You Won!</h1>
          <p>Random number: {this.state.target}</p>
          <p>Number of tries: {this.state.try}</p>
          <button onClick={this.resetGame}>Play again</button>
        </div>
      );
    }

    return(
      <div style={{textAlign: 'center'}}>
        {this.head()}
        <h1>Gussing Game</h1>
        {this.state.error &&
          <p style={{color: 'red'}}>{this.state.error}</p>}
        <p>{this.state.nextMove}</p>
        <input type='text' placeholder='14' onChange={this.onChange} style={{marginRight: '8px'}} />
        <button onClick={this.onSubmit}>Check your guess</button>
      </div>
    );
  }
}

export default Home;