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
    <footer className="footer-container footer">
      <div className="footer-content">
        <div className="footer-row">
          <div className="footer-logo">
            <img src={etherTixLogo} />
            {/* <div className="ethtix">EthTix</div> */}
          </div>
        </div>
        <hr className="footer-separator" />
        <div className="footer-row">
          <div className="footer-links">
            <ul>
              <ol>
                Useful Links
                <li>
                  <a href="/#home">Home</a>
                </li>
                <li>
                  <a href="/about">About</a>
                </li>
                <li>
                  <a href="/events">Events</a>
                </li>
                <li>
                  <a href="/mytickets">My Tickets</a>
                </li>
              </ol>
              <ol>
                Services
                <li>
                  <a href="/#hostevent">Host Event</a>
                </li>
                <li>
                  <a href="/dashboard">Open Dashboard</a>
                </li>
                <li>
                  <a href="/dashboard">Tools</a>
                </li>
                <li>
                  <a href="/#features">Features</a>
                </li>
              </ol>
              <ol>
                Learn
                <li>
                  <a href="/#faq">FAQs</a>
                </li>
                <li>
                  <a href="/#whyethtix">Why EthTix</a>
                </li>
                <li>
                  <a href="/about/#meettheteam">Our Teams</a>
                </li>
                <li>
                  <a href="#">Help & Support</a>
                </li>
              </ol>
              <ol>
                Explore
                <li>
                  <a href="/terms">Terms & Condition</a>
                </li>
                <li>
                  <a href="/privacy">Privacy Policy</a>
                </li>
                <li>
                  <a href="/#howtouse">How to use</a>
                </li>
                <li>
                  <a href="/organizerterms">Organizers Terms</a>
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
