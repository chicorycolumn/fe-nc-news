import React from "react";
import ncnewslogo from "./logoncnews.png";
import styles from "./css/Navbar.module.css";

const currentUser = "jessjelly";

const Navbar = () => {
  const successfulLogIn = () => {
    alert("You have logged in as jessjelly");
    //WHERE SHOULD THIS SET STATE, THE VARIABLE (GLOBAL?) OF CURRENTUSER?s
  };

  return (
    <div className={styles.navGrid}>
      <img className={styles.ncLogo} src={ncnewslogo} alt="logo" />
      <div className={styles.buttonLeftContainer}>
        <button className={styles.buttonLeft}>Users</button>
        <button className={styles.buttonLeft}>Topics</button>
        <button className={styles.buttonLeft}>Write!</button>
      </div>
      <div className={styles.searchbarContainer}>
        <input
          className={styles.searchBar}
          type="text"
          placeholder="Browse away!"
        />
      </div>
      <div className={styles.loginHolder}>
        {currentUser !== null &&
        currentUser !== undefined &&
        currentUser !== "" ? (
          <p className={styles.loggedInUser}>{currentUser}</p>
        ) : (
          <button className={styles.buttonRight} onClick={successfulLogIn}>
            Log In
          </button>
        )}
        <button className={styles.buttonRight}>Sign up</button>
      </div>
    </div>
  );
};

export default Navbar;
