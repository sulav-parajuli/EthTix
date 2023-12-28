import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import aakriti from "../assets/images/team/aakriti.png";
// import karuna from "../assets/images/team/karuna.png";
import karuna from "../assets/images/abstract.png";
import sulav from "../assets/images/team/sulav.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faXTwitter,
  faLinkedin,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

const About = () => {
  return (
    <div className="mcontainer">
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div className="text-center">
              <h2 className="display-6">About EthTix</h2>
              <p className="lead">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Et nam
                quo nihil quis necessitatibus cupiditate quaerat mollitia
                deserunt architecto debitis voluptates rerum odit similique,
                optio temporibus dignissimos itaque dolor doloremque.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container" data-aos="fade-up">
        <div className="text-center">
          <h2 className="display-6">Meet the Team</h2>
          <p className="lead">Our talented and dedicated team</p>
        </div>

        <div className="row">
          {[
            {
              name: "Aakriti Bhusal",
              role: "Full Stack Developer",
              imgSrc: aakriti,
            },
            {
              name: "Karuna Acharya",
              role: "Full Stack Developer",
              imgSrc: karuna,
            },
            {
              name: "Sulav Parajuli",
              role: "Full Stack Developer",
              imgSrc: sulav,
            },
          ].map((member, index) => (
            <div key={index} className="col-4 mb-4">
              <div className="container">
                <div className="row justify-space-between py-2">
                  <div className="col-6 mx-auto">
                    <div className="card shadow-lg mt-4">
                      <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                        <a
                          className="d-block blur-shadow-image"
                          data-aos="zoom-in"
                          data-aos-delay={100 * (index + 1)}
                        >
                          <img
                            src={member.imgSrc}
                            alt={member.name}
                            className="img-fluid shadow border-radius-lg"
                          />
                        </a>
                      </div>
                      <div className="card-body">
                        <h4 className="card-title">{member.name}</h4>
                        <p className="card-text">{member.role}</p>
                        <div className="social">
                          <a href="#" className="me-2">
                            <FontAwesomeIcon icon={faFacebook} />
                          </a>
                          <a href="#" className="me-2">
                            <FontAwesomeIcon icon={faXTwitter} />
                          </a>
                          <a href="#" className="me-2">
                            <FontAwesomeIcon icon={faInstagram} />
                          </a>
                          <a href="#" className="me-2">
                            <FontAwesomeIcon icon={faLinkedin} />
                          </a>
                          <a href="#" className="me-2">
                            <FontAwesomeIcon icon={faGlobe} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
