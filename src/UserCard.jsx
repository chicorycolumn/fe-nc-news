import React from "react";
import styles from "./css/UserCard.module.css";
import { Router, Link, navigate } from "@reach/router";
import { fetchArticles } from "./utils/getUtils";

class UserCard extends React.Component {
  state = {
    articleCounts: null,
    isLoading: true,
    err: null
  };

  componentDidMount() {
    fetchArticles({ author: this.props.user.username }).then(articles => {
      this.setState({ articleCounts: articles.length });
    });
  }

  render() {
    if (this.state.err) {
      navigate("/error", { state: { err: this.state.err } });
    }

    const cardContents = (
      <div className={styles.userCard}>
        <h1 className={styles.slug}>{this.props.user.username}</h1>

        <p className={styles.description}>
          {this.state.articleCounts} articles
        </p>
      </div>
    );

    return this.state.articleCounts ? (
      <Link
        style={{ textDecoration: "none" }}
        to={`/articles?author=${this.props.user.username}`}
      >
        {cardContents}
      </Link>
    ) : (
      cardContents
    );
  }
}

export default UserCard;