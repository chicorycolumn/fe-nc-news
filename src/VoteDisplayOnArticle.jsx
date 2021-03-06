import React, { Component } from "react";
import { voteOnArticle } from "./utils/patchUtils";
import styles from "./css/ArticlePreview.module.css";
import { queryUserVoteOnArticle } from "./utils/getUtils";
import { formatVotes } from "./utils/formatVotes";

class VoteDisplayOnArticle extends Component {
  state = {
    castedVote: 0,
    error: false,
    currentUser: "",
  };

  componentDidMount() {
    const currentUser = localStorage.getItem("currentUser");
    return Promise.all([this.setState({ currentUser })]).then((res) => {
      if (this.state.currentUser) {
        queryUserVoteOnArticle(
          this.state.currentUser,
          this.props.article_id
        ).then((article_votes_junction) => {
          if (article_votes_junction.length === 0) {
            this.setState({
              castedVote: 0,
            });
          } else
            this.setState({
              castedVote: article_votes_junction[0]["inc_votes"],
            });
        });
      }
    });
  }

  handleVote = (voteDirection) => {
    if (
      !(
        this.state.currentUser !== null &&
        this.state.currentUser !== undefined &&
        this.state.currentUser !== ""
      )
    ) {
      alert("To vote on the latest news, log in or sign up!");
    } else {
      const { article_id } = this.props;
      const { currentUser } = this.state;

      if (voteDirection !== this.state.castedVote) {
        voteOnArticle(currentUser, article_id, voteDirection);

        this.props.upwardVoteOnArticle(voteDirection);
        this.setState((currState) => {
          return {
            castedVote: currState.castedVote + voteDirection,
            error: false,
          };
        });
      }
    }
  };

  render() {
    return (
      <div className={styles.votes}>
        <button
          className={styles.voteEmoji}
          onClick={() => {
            if (this.state.castedVote !== 1) {
              this.handleVote(1);
            }
          }}
        >
          {this.state.castedVote.toString() === "1" ? "▲" : "▵"}
        </button>
        <div
          className={`${
            this.props.votes > 999 || this.props.votes < -999
              ? styles.hoverable
              : styles.notHoverable
          }`}
        >
          <p className={styles.voteCount}>{formatVotes(this.props.votes)}</p>
          <span className={styles.hoverText}>{this.props.votes} votes</span>
        </div>
        <button
          className={styles.voteEmoji}
          onClick={() => {
            if (this.state.castedVote !== -1) {
              this.handleVote(-1);
            }
          }}
        >
          {this.state.castedVote.toString() === "-1" ? "▼" : "▿"}
        </button>
      </div>
    );
  }
}

export default VoteDisplayOnArticle;
