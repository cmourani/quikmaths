import React from 'react'

class QuestionAnswer extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			class: ".button"
		}
		this.findCorrect = this.findCorrect.bind(this)
		this.addClass = this.addClass.bind(this)
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

	addClass(targ){
		console.log(targ)
		this.setState({
			class: ".clicked"
		}, () => 
		{
			setTimeout(() => {
				this.setState({
					class: ".button"
				})
			}, 500)})
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
						addClass={this.addClass}
						class={this.state.class}
					/>)}
				</div>
				<Timer timeElapsed={this.props.timeElapsed} />
				<div>Questions Left: {this.props.questionsLeft}</div>
			</div>
		)
	}
}

const Answer = (props) => (
	<button className={props.class} onClick={(e) => {
		props.findCorrect(props.answer, props.question); props.addClass(e.target)
	}}>{props.answer}</button>
)

const Timer = (props) => (
	<span>Time Elapsed: {props.timeElapsed/100}</span>
)

export default QuestionAnswer
