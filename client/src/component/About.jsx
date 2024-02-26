import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import aakriti from "../assets/images/team/aakriti.png";
import karuna from "../assets/images/team/karuna.png";
import sulav from "../assets/images/team/sulav.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faXTwitter,
  faLinkedin,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import {
  faGlobe,
  faPhone,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

const About = () => {
  return (
    <div className="mcontainer">
      <div className="container aboutsection my-5">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="text-center">
              <h2 className="display-6" id="ethtix">
                About EthTix
              </h2>
              <p className="lead px-3 px-md-0">
                EthTix is a decentralized application (dApp) that allows event
                organizers to create, manage, and sell event tickets on the
                Ethereum blockchain. EthTix leverages the Ethereum blockchain to
                provide a secure, transparent, and trustless platform for event
                ticketing. The Ethereum blockchain ensures that event tickets
                are secure, cannot be counterfeited, and are easily
                transferable. EthTix also provides a user-friendly interface for
                event organizers to create and manage events, and for event
                attendees to purchase and transfer tickets.
                <br class="d-md-block" />
                EthTix is a fully decentralized application (dApp) that is built
                on the Ethereum blockchain. Lorem ipsum, dolor sit amet
                consectetur adipisicing elit. Recusandae ipsam tenetur eius?
                Maiores a corrupti quaerat vel dignissimos velit facere,
                assumenda fuga laudantium beatae blanditiis error, fugit
                quibusdam dolor! Ipsum?
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container" data-aos="fade-up">
        <div className="text-center">
          <h2 className="display-6" id="meettheteam">
            Meet the Team
          </h2>
          <p className="lead">
            Our talented and dedicated team driving the revolution in
            decentralized ticketing.
          </p>
        </div>

        <div className="row">
          {[
            {
              name: "Aakriti Bhusal",
              role: "Full Stack Developer",
              imgSrc: aakriti,
              phone: "tel:9819193208",
              email: "mailto:aakritibhusal234@gmail.com",
              facebook:
                "https://www.facebook.com/profile.php?id=100088076535127",
              twitter: "https://twitter.com/aak_ritie",
              instagram: "https://www.instagram.com/aak_ritie/",
              linkedin: "https://www.linkedin.com/in/aakriti-bhusal-39b8912a4/",
              website: "https://aakritibhusal.com.np",
            },
            {
              name: "Karuna Acharya",
              role: "Full Stack Developer",
              imgSrc: karuna,
              phone: "tel:9805851061",
              email: "mailto:acharyakaru2000@gmail.com",
              facebook:
                "https://www.facebook.com/profile.php?id=100069974996059&mibextid=ZbWKwL",
              twitter:
                "https://twitter.com/KarunaAcharya20?fbclid=IwAR2pvk3s2-dNWPFXDoalcucrbslX3q7axkz4j4aVg-8SDubUhDbqpMC3v4c",
              instagram:
                "https://www.instagram.com/karu_ach?igsh=Yjk4cHQyenlpcXhl&fbclid=IwAR2sbFJXPjOL3GnFGj3GhO5ctwAw34ssjhZYMR_H1--9n1jYRqI6DVDzkis",
              linkedin:
                "https://www.linkedin.com/in/karuna-acharya-2b8686288/?fbclid=IwAR0OIg-eo1U3D_V-7ZtKF7pODd8XvwuI7qcdaHOMuB4zuNMLVEMrFZaguy0",
              website: "https://karunaacharya.com.np/",
            },
            {
              name: "Sulav Parajuli",
              role: "Full Stack Developer",
              imgSrc: sulav,
              phone: "tel:9816106956",
              email: "mailto:sulavparajuli82@gmail.com",
              facebook: "https://www.facebook.com/sulav.parajuli.5/",
              twitter: "https://twitter.com/SulavParajul1",
              instagram: "https://www.instagram.com/_sulav_parajuli/",
              linkedin: "https://www.linkedin.com/in/sulavparajuli/",
              website: "https://sulav-parajuli.com.np/",
            },
          ].map((member, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="container">
                <div className="row justify-content-between py-2">
                  <div className="col-12">
                    <div
                      className="card shadow-lg mt-4 position-relative"
                      data-aos="fade-up"
                      data-aos-delay={100 * (index + 1)}
                    >
                      <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                        <div
                          className="d-block blur-shadow-image"
                          data-aos="zoom-in"
                          data-aos-delay={100 * (index + 1)}
                        >
                          <img
                            src={member.imgSrc}
                            alt={member.name}
                            className="img-fluid shadow border-radius-lg"
                          />
                          <div className="sociall">
                            <a href={member.phone} className="me-2">
                              <FontAwesomeIcon icon={faPhone} />
                            </a>
                            <a href={member.email} className="me-2">
                              <FontAwesomeIcon icon={faEnvelope} />
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="card-body">
                        <h4 className="card-title">{member.name}</h4>
                        <p className="card-text">{member.role}</p>
                        <div className="social">
                          <a href={member.facebook} className="me-2">
                            <FontAwesomeIcon icon={faFacebook} />
                          </a>
                          <a href={member.twitter} className="me-2">
                            <FontAwesomeIcon icon={faXTwitter} />
                          </a>
                          <a href={member.instagram} className="me-2">
                            <FontAwesomeIcon icon={faInstagram} />
                          </a>
                          <a href={member.linkedin} className="me-2">
                            <FontAwesomeIcon icon={faLinkedin} />
                          </a>
                          <a href={member.website} className="me-2">
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
