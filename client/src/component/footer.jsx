import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import etherTixLogo from "../assets/images/logo/etherTixlogo4.png";
import {
  faFacebook,
  faXTwitter,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import "./css/footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-row">
          <div className="footer-logo">
            <img src={etherTixLogo} />
          </div>
        </div>
        <div className="footer-row">
          <div className="footer-links">
            <ul>
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#">Events</a>
              </li>
              <li>
                <a href="#">Contact Us</a>
              </li>
            </ul>
          </div>
        </div>
        <hr className="footer-separator" />
        <div className="footer-row">
          <div className="footer-social">
            <p>Follow Us:</p>
            <div className="social-icons">
              <a href="#" className="icon-facebook">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="#" className="icon-twitter">
                <FontAwesomeIcon icon={faXTwitter} />
              </a>
              <a href="#" className="icon-linkedin">
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-copyright">
        <hr className="footer-separator" />
        &copy; 2023 EtherTix. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
