import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Game from './components/game.jsx';
import NavTopBar from './components/navTopBar.jsx';
import NavSideBar from './components/navSideBar.jsx';
import InfoSideBar from './components/infoSideBar.jsx';
import LeaderBoard from './components/leaderBoard.jsx';
import UserInfo from './components/userInfo.jsx';
import Login from './components/login.jsx';
import SignUp from './components/signUp.jsx';
import questionGen from '../../problemGen.js';
import _ from 'underscore';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      problemType: '+',
      timeElapsed: 0,
      startTime: 0,
      numberCorrect: 0,
      numberIncorrect: 0,
      questionsLeft: 0,
      inProgressBool: false,
      correctArray: [],
      incorrectArray: [],
      //state for newQuestion
      questionString: [],
      answers: [],
      correctAnswer: undefined,
      // states for userinfo
      username: null,
      userId: null,
      createdAt: null,
      gamesPlayed: null,
      totalCorrect: null,
      totalIncorrect: null,
      highScore: null,
      bestTime: null,
      // array of leaderboard records
      recordsList: [],
      // render login page conditionally
      isLoggedIn: false,
      // render game or chooseyourpath conditionally
      choosePathMode: true,
      isSignedUp: true,
      totalUserCorrect: null,
      totalUserIncorrect: null,
      mounted: false
    }
    this.AppStyle = {
      fontFamily: 'Poppins',
      display: 'grid',
      gridTemplateColumns: '2fr 5fr',
      gridColumnGap: '2.5%'
    }
    this.NavTopBarStyle = {

    }
    this.GameStyle = {

    }

    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.goToSignUp = this.goToSignUp.bind(this);
    this.goToLogin = this.goToLogin.bind(this)
    this.startNewGame = this.startNewGame.bind(this)
    this.inProgressBoolUpdate = this.inProgressBoolUpdate.bind(this)
    this.questionsLeftUpdate = this.questionsLeftUpdate.bind(this)
    this.getUserInfo = this.getUserInfo.bind(this)
    this.getLeaderBoard = this.getLeaderBoard.bind(this)
    this.numberCorrectUpdate = this.numberCorrectUpdate.bind(this)
    this.numberIncorrectUpdate = this.numberIncorrectUpdate.bind(this)
    this.resetCounts = this.resetCounts.bind(this)
    this.questionsLeftUpdate = this.questionsLeftUpdate.bind(this)
    this.inProgressBoolUpdate = this.inProgressBoolUpdate.bind(this)
    this.correctArrayUpdate = this.correctArrayUpdate.bind(this)
    this.incorrectArrayUpdate = this.incorrectArrayUpdate.bind(this)
    this.showChoosePathMode = this.showChoosePathMode.bind(this)
    this.startNewGame = this.startNewGame.bind(this)
    this.logout = this.logout.bind(this)
    this.updateUserInfo = this.updateUserInfo.bind(this)
    this.newQuestion = this.newQuestion.bind(this);
  }

  componentDidMount(){
    this.getIndex()
  }

  newQuestion() {
    let infoObject = questionGen(this.state.problemType, 3, 1);
    this.setState({
      questionString: `${infoObject.question[1]} ${infoObject.question[0]} ${infoObject.question[2]}`.includes('--') ? infoObject.question[1] + ' + ' + infoObject.question[2].substring(1) : `${infoObject.question[1]} ${infoObject.question[0]} ${infoObject.question[2]}`,
      answers: _.shuffle(infoObject.choices),
      correctAnswer: infoObject.correctAnswer
    })
  }

  getIndex(){
    axios.get('/git')
         .then((result) => {
           if (result.data !== false){
            this.setState({
              isLoggedIn: true, 
              username: result.data.user,
              mounted: true
            }, () => {
              this.getUserInfo();
            })
           } else {
            this.setState({
              mounted: true
            })
           } 
         })
  }

  startTimer() {

    setTimeout(() => {
      if (this.state.inProgressBool) {
        this.setState({
          timeElapsed: Date.now() - this.state.startTime
        })
        this.startTimer()
      }
    }, 1)
  }

  inProgressBoolUpdate() {
    // use to start and stop games
    this.setState({
      inProgressBool: !this.state.inProgressBool,
    }, () => {
      if (this.state.inProgressBool) {
        this.startTimer()
      } else {
        this.setState({
          timeElapsed: 0
        })
      }
    })
  }

  numberCorrectUpdate() {
    this.setState({
      numberCorrect: this.state.numberCorrect + 1
    })
  }

  numberIncorrectUpdate() {
    this.setState({
      numberIncorrect: this.state.numberIncorrect + 1
    })
  }

  resetCounts() {
    this.setState({
      numberIncorrect: 0,
      numberCorrect: 0,
      correctArray: [],
      incorrectArray: []
    })
  }

  questionsLeftUpdate(cb) {
    this.setState({
      questionsLeft: this.state.questionsLeft - 1
    }, ()=> {
      // run callback (i.e. save data) after question count updated
      cb(this.state.questionsLeft)
    })
  }

  setNumberOfQuestions(numQuestions = 10) {
    // numQuestions can be passed in from navsidebar or defaults to 10
    this.setState({
      questionLeft: numQuestions
    })
  }

  correctArrayUpdate(question) {
    this.state.correctArray.push(question);
  }

  incorrectArrayUpdate(question) {
    this.state.incorrectArray.push(question);
  }

  showChoosePathMode() {
    this.setState({
      choosePathMode: true
    })
  }

  startNewGame(operator) {
    this.setState({
      questionsLeft: 10, 
      problemType: operator,
      choosePathMode: false,
      startTime: Date.now()
    }, () => {
      this.newQuestion(operator);
      this.resetCounts()
      this.inProgressBoolUpdate()
    })
  }

  getUserInfo() {
    axios.post('/user', {
      username: this.state.username
    })
    .then((response)=> {
      console.log(response);
      this.setState({
        username: response.data[0].username,
        createdAt: response.data[0].createdAt,
        gamesPlayed: response.data[0].gamesPlayed,
        totalCorrect: response.data[0].totalCorrect,
        totalIncorrect: response.data[0].totalIncorrect,
        highScore: response.data[0].highScore,
        bestTime: response.data[0].bestTime,
      })
    })
    .catch((error)=> {
      console.log(error);
    });
  }

  updateUserInfo(object) {
    this.setState({
      highScore: object.data.highScore,
      bestTime: object.data.bestTime,
      totalUserIncorrect: object.data.totalIncorrect,
      totalUserCorrect: object.data.totalCorrect,
      gamesPlayed: object.data.gamesPlayed

    }, () => console.log('totalUserCorrect', this.state.totalUserCorrect) )
  }
  
  getLeaderBoard() {
    axios.post('/allRecords', {
        operator: this.props.problemType,
        ascending: false
    })
    .then((response)=> {
      this.setState({
        recordsList: response.data
      })
    })
    .catch((error)=> {
      console.log(error);
    });
  }

  handleSignUp(obj){
    axios.post('/signup', obj)
         .then((result) => {
            if(result.data === false) {
               alert('username already exists');
            } else {
               this.setState({"isLoggedIn" : true, 
                              "username" : result.data}) 
            }
          })
  }

  handleLogin(obj) {
    axios.post('/login', obj)
         .then((result) => {
            if (result.data === false) {
              alert('Please try again or Create New Account');
            } else {
              this.setState({"isSignedUp": true, 
                            "isLoggedIn": true, 
                            "username": result.data}, () => this.getUserInfo())
            }
         })
  }

  goToSignUp(){
    this.setState({
      isSignedUp : false
    })
  }

  goToLogin(){
    this.setState({
      isSignedUp : true
    })
  }

  logout(){
    console.log('loggin out')
    axios.get('/logout')
         .then(() => {
          this.setState({
            isLoggedIn: false, 
            isSignedUp: true
          }, () => {
            this.getIndex()
          })
         })
  }


  render() {

    if (this.state.mounted){
    if (this.state.isLoggedIn === false && this.state.isSignedUp === true) {
      return (
        <Login handleLogin={this.handleLogin} goToSignUp={this.goToSignUp}/>
      )
    } else if (this.state.isLoggedIn === false && this.state.isSignedUp === false) {
      return (
        <SignUp handleSignUp={this.handleSignUp} goToLogin={this.goToLogin}/>
      )
    } else {
       return (
          <div style={this.AppStyle}>
            <NavTopBar
              getUserInfo={this.getUserInfo}
              getLeaderBoard={this.getLeaderBoard}
              username={this.state.username}
              createdAt={this.state.createdAt}
              gamesPlayed={this.state.gamesPlayed}
              totalCorrect={this.state.totalCorrect}
              totalIncorrect={this.state.totalIncorrect}
              highScore={this.state.highScore}
              bestTime={this.state.bestTime}
              recordsList={this.state.recordsList}
              totalUserCorrect={this.state.totalUserCorrect}
              totalUserIncorrect={this.state.totalUserIncorrect}
              logout={this.logout}
            />
            <NavSideBar
              style={this.NavSideBarStyle}
              inProgressBool = {this.state.inProgressBool}
              startNewGame= {this.startNewGame}
              inProgressBoolUpdate = {this.inProgressBoolUpdate}
              questionsLeftUpdate = {this.questionsLeftUpdate}
              choosePathMode = {this.state.choosePathMode}
            />
            <Game
              style={this.GameStyle}
              problemType = {this.state.problemType}
              timeElapsed = {this.state.timeElapsed}
              numberCorrect = {this.state.numberCorrect}
              numberIncorrect = {this.state.numberIncorrect}
              questionsLeft = {this.state.questionsLeft}
              inProgressBool = {this.state.inProgressBool}
              correctArray = {this.state.correctArray}
              incorrectArray = {this.state.incorrectArray}
              userId = {this.state.userId}
              username = {this.state.username}
              numberCorrectUpdate = {this.numberCorrectUpdate}
              numberIncorrectUpdate = {this.numberIncorrectUpdate}
              resetCounts = {this.resetCounts}
              questionsLeftUpdate = {this.questionsLeftUpdate}
              inProgressBoolUpdate = {this.inProgressBoolUpdate}
              correctArrayUpdate = {this.correctArrayUpdate}
              incorrectArrayUpdate = {this.incorrectArrayUpdate}
              choosePathMode = {this.state.choosePathMode}
              showChoosePathMode = {this.showChoosePathMode}
              startNewGame= {this.startNewGame}
              updateUserInfo = {this.updateUserInfo}
              newQuestion = {this.newQuestion}
              questionString = {this.state.questionString}
              answers = {this.state.answers}
              correctAnswer = {this.state.correctAnswer}
            />
          </div>
       )
    }
  } else {
    return (<span></span>)
  }
  }
}

ReactDOM.render(<App />, document.getElementById('mount'));

export default App;
