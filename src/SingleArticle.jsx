import React from "react";
import styles from "./css/SingleArticle.module.css";
import { Router, Link, navigate } from "@reach/router";
import { voteOnArticle, postNewComment } from "./utils/patchUtils";
import VoteDisplayOnArticle from "./VoteDisplayOnArticle";
import { fetchArticleByID, fetchArticleWithComments } from "./utils/getUtils";
import CommentGrid from "./CommentGrid";
import CreateComment from "./CreateComment";
import DateFormat from "./DateFormat";

class SingleArticle extends React.Component {
  state = {
    createCommentDisplaying: false,
    newCommentInput: "",
    article: null,
    comments: null,
    isLoading: true,
    votes: 0,
    userSubmitsEmpty: false,
    err: null,
    currentUser: "",
    comment_count: 0
  };

  componentDidMount() {
    return Promise.all([
      localStorage.getItem("currentUser"),
      fetchArticleWithComments(this.props.article_id)
    ])
      .then(resArr => {
        const currentUser = resArr[0];
        const [err, article, comments] = resArr[1];

        if (err) {
          this.setState({ err, currentUser });
        } else
          this.setState({
            article,
            comments,
            isLoading: false,
            votes: article.votes,
            currentUser
          });
      })
      .catch(err => navigate("/error", { state: { err } }));
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.article === null && this.state.article) {
      this.setState(currState => {
        return { comment_count: currState.article.comment_count };
      });
    }
  }

  upwardEmptyCheckReset = () => {
    this.setState({ userSubmitsEmpty: false });
  };

  upwardNewCommentInput = newCommentInput => {
    this.setState({ newCommentInput });
  };

  upwardDeleteComment = comment_id => {
    this.setState(currState => {
      let newCommentArray = currState.comments.filter(
        comment => comment.comment_id !== comment_id
      );

      return {
        comments: newCommentArray,
        comment_count: currState.comment_count - 1
      };
    });
  };

  upwardVoteOnArticle = voteDirection => {
    this.setState(currState => {
      return { votes: currState.votes + voteDirection };
    });
  };

  submitNewComment = event => {
    event.preventDefault();

    if (this.state.newCommentInput === "") {
      this.setState({ userSubmitsEmpty: true });
    } else
      postNewComment(
        this.state.currentUser,
        this.state.article.article_id,
        this.state.newCommentInput
      ).then(newlyComment => {
        this.setState(currState => {
          return {
            newCommentInput: "",
            createCommentDisplaying: false,
            comments: [newlyComment, ...currState.comments],
            comment_count: currState.comment_count + 1
          };
        });
      });
  };

  render() {
    if (this.state.err) {
      navigate("/error", { state: { err: this.state.err } });
    }

    return (
      <>
        {this.state.isLoading ? (
          "loading..."
        ) : (
          <>
            <div className={styles.containerGrid}>
              <div className={styles.centralContainer}>
                <p className={styles.title}>{this.state.article.title}</p>
                <p className={styles.author}>by {this.state.article.author}</p>
              </div>

              <div className={styles.bodyContainer}>
                <p className={styles.bodyText}>{this.state.article.body}</p>
              </div>

              <button
                onClick={() => {
                  this.state.currentUser !== null &&
                  this.state.currentUser !== undefined &&
                  this.state.currentUser !== ""
                    ? this.setState(currState => {
                        return {
                          createCommentDisplaying: !currState.createCommentDisplaying
                        };
                      })
                    : alert("To vote on the latest news, log in or sign up!");
                }}
                className={styles.joinConvoButton}
              >
                {this.state.createCommentDisplaying
                  ? "Maybe later..."
                  : "Join the conversation!"}
              </button>

              <div className={styles.leftHandSideContainer}>
                <VoteDisplayOnArticle
                  article_id={this.state.article.article_id}
                  votes={this.state.votes}
                  upwardVoteOnArticle={this.upwardVoteOnArticle}
                />
              </div>

              <div className={styles.rightHandSideContainer}>
                <p className={styles.topic}>{this.state.article.topic}</p>
                <p className={styles.comments}>
                  <span role="img">💬</span>
                  {this.state.comment_count}
                </p>

                <p className={styles.created_at}>
                  <DateFormat created_at={this.state.article.created_at} />
                </p>
              </div>
              {this.state.createCommentDisplaying && (
                <CreateComment
                  newCommentInput={this.state.newCommentInput}
                  upwardNewCommentInput={this.upwardNewCommentInput}
                  submitNewComment={this.submitNewComment}
                  upwardEmptyCheckReset={this.state.upwardEmptyCheckReset}
                  userSubmitsEmpty={this.state.userSubmitsEmpty}
                />
              )}
            </div>

            <div>
              {this.state.comments.map(comment => (
                <CommentGrid
                  comment={comment}
                  article_id={this.state.article.article_id}
                  upwardDeleteComment={this.upwardDeleteComment}
                />
              ))}
            </div>
          </>
        )}
      </>
    );
  }
}

export default SingleArticle;
