// @flow

import React from "react"

import "font-awesome/css/font-awesome.min.css"

import style from "../assets/styles/footer.module.scss"

const Footer = () => {
  return (
    <footer>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary footer-links py-0">
        <ul className={["navbar-nav mr-auto", style.links].join(" ")}>
          <li className="nav-item">
            <span className="navbar-text mr-3">
              Copyright &#169; {new Date().getFullYear()}
            </span>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              href="http://reach-api.nrnb-docker.ucsd.edu/"
              target="_blank"
            >
              API
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Tutorial
            </a>
          </li>
        </ul>
        <ul className="navbar-nav justify-content-end">
          <li className="nav-item align-top">
            <a
              className={["nav-link", style.github].join(" ")}
              href="https://github.com/cannin/ihop-reach"
              target="_blank"
            >
              Contribute on &nbsp;
              <i className="fa fa-github" />
            </a>
          </li>
        </ul>
      </nav>
    </footer>
  )
}

export default Footer
