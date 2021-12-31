import React from "react";
import "./Joke.css";

class ClassJoke extends React.Component {
	constructor(props) {
		super(props);

		this.upVote = this.upVote.bind(this);
		this.downVote = this.downVote.bind(this);
	}

	// Arrow functions change context of "this", so we're using normal function declarations here
	upVote() {
		this.props.vote(this.props.id, +1);
	}
	downVote() {
		this.props.vote(this.props.id, -1);
	}

	render() {
		return (
			<div className="Joke">
				<div className="Joke-votearea">
					<button onClick={this.upVote}>
						<i className="fas fa-thumbs-up" />
					</button>

					<button onClick={this.downVote}>
						<i className="fas fa-thumbs-down" />
					</button>

					{this.props.votes}
				</div>

				<div className="Joke-text">{this.props.text}</div>
			</div>
		);
	}
}

export default ClassJoke;
