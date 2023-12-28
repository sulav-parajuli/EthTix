import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import etherTixLogo from "../assets/images/logo/etherTixlogooff1.png";
import {
  faFacebook,
  faXTwitter,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import "../assets/css/footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-row">
          <div className="footer-logo">
            <img src={etherTixLogo} />
            {/* <div className="ethtix">EthTix</div> */}
          </div>
        </div>
        <hr className="footer-separator" />
        <div className="footer-row row ">
          <div className="footer-links">
            <ul>
              <ol>
                Useful Links
                <li>
                  <a href="#">Home</a>
                </li>
                <li>
                  <a href="#">About</a>
                </li>
                <li>
                  <a href="#">Events</a>
                </li>
              </ol>
              <ol>
                Services
                <li>
                  <a href="#">Host Event</a>
                </li>
                <li>
                  <a href="#">Open Dashboard</a>
                </li>
                <li>
                  <a href="#">Tools</a>
                </li>
              </ol>
              <ol>
                Learn
                <li>
                  <a href="#">FAQs</a>
                </li>
                <li>
                  <a href="#">Why EthTix</a>
                </li>
                <li>
                  <a href="#">Marketing</a>
                </li>
              </ol>
              <ol>
                Explore
                <li>
                  <a href="#">Terms & Condition</a>
                </li>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
                <li>
                  <a href="#">Security</a>
                </li>
              </ol>
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
        &copy; 2023 EthTix. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
