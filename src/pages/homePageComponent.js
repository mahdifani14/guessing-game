import React from 'react';
import {Helmet} from 'react-helmet';

const getInitialState = () =>
  ({
    status: 'play',
    nextMove: "Guess a number between 1 and 1000",
    guess: 0,
    try: 0,
    error: null,
    target: null
  });


const head = () => (
  <Helmet>
    <title>Gussing Game</title>
  </Helmet>
);

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = getInitialState();

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.getRandNum = this.getRandNum.bind(this);
  }

  resetGame() {
    if (this.state.status !== 'fail') {
      this.setState(getInitialState());
    }
  }

  componentDidMount() {
    this.getRandNum();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.status === 'win') {
      this.getRandNum();
    }

    if (prevState.status === 'win') {
      this.getRandNum();
    }
  }

  getRandNum() {
    fetch('http://localhost:3003/rand')
      .then(response => response.json())
      .then(data => this.setState({
        target: data.randomNum,
        status: 'play'
      }))
      .catch(() => this.setState({status: 'fail'}));
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
      return;
    }

    if (guess === target) {
      this.setState({status: 'win'});
      return;
    }

    if (guess > target) {
      this.setState({nextMove: 'Too high'});
    } else {
      this.setState({nextMove: 'Too low'});
    }
  }

  render() {
    if (this.state.status === 'win') {
      return (
        <div style={{textAlign: 'center', marginTop: '15%'}}>
          <h1 style={{color: 'green'}}>You Won!</h1>
          <p>Random number: {this.state.target}</p>
          <p>Number of tries: {this.state.try}</p>
          <button onClick={this.resetGame}>Play again</button>
        </div>
      );
    }

    if (this.state.status === 'fail') {
      return (
        <div style={{textAlign: 'center', marginTop: '15%'}}>
          <h1 style={{color: 'red'}}>Game is not available!</h1>
          <button onClick={this.getRandNum}>Try again</button>
        </div>
      );
    }

    return (
      <div style={{textAlign: 'center', marginTop: '15%'}}>
        {head()}
        <h1>Gussing Game</h1>
        <p style={{textAlign: 'left', width: '50%%', display: 'inline-table'}}>
          <b>Instruction:</b><br/>* insert a guess between 1-1000
          <br/>* if the number is higher than target "Too high" will be displayed
          <br/>* if the number is lower than target "Too low" will be displayed
        </p>
        <p>{this.state.nextMove}</p>
        {this.state.error && <p style={{color: 'red'}}>{this.state.error}</p>}
        <input type='text' style={{marginRight: '8px', textAlign: 'center', height: '32px', width: '48px'}}
               placeholder='1-1000' onChange={this.onChange}/>
        <button onClick={this.onSubmit} style={{height: '32px'}}>Check</button>
      </div>
    );
  }
}

export default Home;