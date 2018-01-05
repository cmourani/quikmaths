import React from 'react'

class QuestionAnswer extends React.Component {
	constructor(props){
		super(props)
		this.findCorrect = this.findCorrect.bind(this)
	}

	findCorrect(answer, question){
		this.props.questionsLeftUpdate((questionsLeft) => {
			if (answer === this.props.correctAnswer){
				this.props.correctArrayUpdate(question)
				this.props.numberCorrectUpdate()
			} else {
				this.props.incorrectArrayUpdate(question)
				this.props.numberIncorrectUpdate()
			}
			console.log(questionsLeft)
			if (questionsLeft === 0){
				this.props.finalTimeUpdate(() => {
					this.props.saveNewScore()
				})
				this.props.inProgressBoolUpdate()
			} else {
				this.props.newQuestion()
			}
		})
	}

	render(){
		return(
			<div>
				<div>{this.props.questionString}</div>
				<div>{this.props.answers.map((answer, id) => 
					<Answer 
						question={this.props.questionString} 
						answer={answer} 
						key={id} 
						findCorrect={this.findCorrect}
					/>)}
				</div>
				<Timer timeElapsed={this.props.timeElapsed} />
				<div>Questions Left: {this.props.questionsLeft}</div>
			</div>
		)
	}
}

const Answer = (props) => (
	<button style={{cursor: pointer}} onClick={() => {
		props.findCorrect(props.answer, props.question)}}>{props.answer}</button>
)

const Timer = (props) => (
	<span>Time Elapsed: {props.timeElapsed/100}</span>
)

export default QuestionAnswer
