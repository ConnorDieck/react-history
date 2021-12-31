import React from "react";
import axios from "axios";
import ClassJoke from "./ClassJoke";
import "./JokeList.css";

// Q: Updating upon save refresh causes app not to work. Refreshing the page solves this

class ClassJokeList extends React.Component {
	/* state is defined in the constructor */
	constructor(props) {
		super(props);
		this.state = { jokes: [] };

		this.numJokesToGet = this.props.numJokesToGet ? this.props.numJokesToGet : 10;

		this.generateNewJokes = this.generateNewJokes.bind(this);
		this.vote = this.vote.bind(this);
	}

	/* get jokes if there are no jokes */
	/* useEffect's purpose is filled by component lifecycle methods */

	componentDidMount() {
		if (this.state.jokes.length === 0) this.getJokes();
	}

	componentDidUpdate(prevProps, prevState) {
		this.getJokes();
		// console.log(`Previous state: ${prevState.jokes}, Current state: ${this.state.jokes}`);
		// console.log(`Previous props: ${prevProps.numJokesToGet}, Current props: ${this.props.numJokesToGet}`);
		// Condition in getJokes prevents an infinite loop here
	}

	/* define getJokes outside so component lifecycle methods can have access */

	async getJokes() {
		let j = [ ...this.state.jokes ];
		let seenJokes = new Set();
		try {
			while (j.length < this.numJokesToGet) {
				let res = await axios.get("https://icanhazdadjoke.com", {
					headers : { Accept: "application/json" }
				});
				let { status, ...jokeObj } = res.data;

				if (!seenJokes.has(jokeObj.id)) {
					seenJokes.add(jokeObj.id);
					j.push({ ...jokeObj, votes: 0 });
				} else {
					console.error("duplicate found!!");
				}
			}

			if (JSON.stringify(j) !== JSON.stringify(this.state.jokes)) this.setState({ jokes: j });
		} catch (e) {
			console.log(e);
		}
	}

	// /* empty joke list and then call getJokes */

	generateNewJokes() {
		this.setState({ jokes: [] });
	}

	/* change vote for this id by delta (+1 or -1) */

	vote(id, delta) {
		const votedJokes = this.state.jokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j));

		this.setState({ jokes: votedJokes });
	}

	// /* render: either loading spinner or list of sorted jokes. */
	// // when using sort, just run the code until it works the way you want and keep that code

	render() {
		if (this.state.jokes.length) {
			let sortedJokes = [ ...this.state.jokes ].sort((a, b) => b.votes - a.votes);

			return (
				<div className="JokeList">
					<button className="JokeList-getmore" onClick={this.generateNewJokes}>
						Get New Jokes
					</button>

					{sortedJokes.map(j => (
						<ClassJoke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={this.vote} />
					))}
				</div>
			);
		}

		return null;
	}
}

export default ClassJokeList;
