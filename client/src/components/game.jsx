import React from 'react'
import QuestionAnswer from './questionAnswer.jsx'
import Statistics from './statistics.jsx'
import questionGen from '../../../problemGen.js'
import axios from 'axios'
import _ from 'underscore'

const problemType = {
  '+': 'Addition',
  '-': 'Subtraction',
  '*': 'Multiplication',
  '/': 'Division'
}

class Game extends React.Component {
  constructor(props) {
    super(props) 
    // finaltime is state in game component instead of prop
    this.state = {
      finalTime: 0
    }
    this.finalTimeUpdate = this.finalTimeUpdate.bind(this);
    this.saveNewScore = this.saveNewScore.bind(this);
  }

  finalTimeUpdate(cb) {
    this.setState({
      finalTime: (this.props.timeElapsed / 1000).toFixed(2)
    }, ()=> {
      cb();
    })
  }


   determineNewScore (time, correctAnswers, incorrectAnswers) {

    let answerPoints = correctAnswers * 1800
    let totalScore = answerPoints
  
    if (time < 10) {
      totalScore += 2000
    } else if (time > 10 && time < 20) {
      totalScore += 1800
    } else if (time >= 20 && time < 30) {
      totalScore += 1600
    } else if (time >= 30 && time < 40) {
      totalScore += 1400
    } else if (time >= 40 && time < 50) {
      totalScore += 1200
    } else if (time >= 50 && time < 60) {
      totalScore += 1000
    } else if (time >= 60 && time < 70) {
      totalScore += 800
    } else if (time >= 70 && time < 80) {
      totalScore += 600
    } else if ( time >= 80 && time < 90) {
      totalScore += 400
    } else if ( time >= 90) {
      totalScore += 200
    }
    
    return totalScore
  }
//create a function that sends new post request to server
//check all fields that are required
  saveNewScore () {
    let newScore = this.determineNewScore(
      this.state.finalTime,
      this.props.numberCorrect,
      this.props.numberIncorrect
    )
    axios.post('/newRecord', {
        'time': this.state.finalTime,
        'numberCorrect': this.props.numberCorrect,
        'numberIncorrect': this.props.numberIncorrect,
        'score': newScore,
        'username': this.props.username,
        'operator': this.props.problemType
      })
     
    axios.post('/updateUser', {
      'username': this.props.username,
      'highScore': newScore,
      'bestTime': this.state.finalTime,
      'numberCorrect': this.props.numberCorrect,
      'numberIncorrect': this.props.numberIncorrect,
      'gamesPlayed': this.props.gamesPlayed
    }).then((user) => this.props.updateUserInfo(user))
  }





  render() {



    if (!this.props.choosePathMode) {

      if (this.props.questionsLeft === 0) {
        return (
          <Statistics 
            numberCorrect={this.props.numberCorrect}
            incorrectArray={this.props.incorrectArray}
            correctArray={this.props.correctArray}
            finalTime={this.state.finalTime}
            showChoosePathMode={this.props.showChoosePathMode}
            startNewGame={this.props.startNewGame}
            problemType={this.props.problemType}
          />
        )
      } else {
        return (
          <div>
            <h1>{problemType[this.props.problemType]}</h1>
            <QuestionAnswer 
              questionString={this.props.questionString}
              answers={this.props.answers}
              correctAnswer={this.props.correctAnswer}
              newQuestion={this.props.newQuestion}
              numberCorrectUpdate={this.props.numberCorrectUpdate}
              questionsLeftUpdate={this.props.questionsLeftUpdate}
              incorrectArrayUpdate={this.props.incorrectArrayUpdate}
              correctArrayUpdate={this.props.correctArrayUpdate}
              inProgressBoolUpdate={this.props.inProgressBoolUpdate}
              timeElapsed={this.props.timeElapsed}
              questionsLeft={this.props.questionsLeft}
              numberIncorrectUpdate={this.props.numberIncorrectUpdate}
              finalTimeUpdate={this.finalTimeUpdate}
              saveNewScore={this.saveNewScore}
            />
          </div>
        )
      }
    } else {
      return null;
    }
  }
}

export default Game;
