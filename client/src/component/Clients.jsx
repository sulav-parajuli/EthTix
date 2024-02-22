import React, { useEffect, useRef, useState } from "react";

// Import client images
import client1 from "../assets/images/clients/guliyo.png";
import client2 from "../assets/images/clients/garo1.png";
import client3 from "../assets/images/clients/billy.png";
import client4 from "../assets/images/clients/lorem2.png";
import client5 from "../assets/images/clients/logo.png";
import client6 from "../assets/images/clients/naplo2.png";
import client7 from "../assets/images/clients/macithub.png";

const Clients = () => {
  const [isSlickLoaded, setIsSlickLoaded] = useState(false);
  const sliderRef = useRef(null);

  useEffect(() => {
    const slickScript = document.createElement("script");
    slickScript.src =
      "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.js";
    slickScript.onload = () => setIsSlickLoaded(true);
    document.body.appendChild(slickScript);

    return () => {
      document.body.removeChild(slickScript);
    };
  }, []);

  useEffect(() => {
    if (isSlickLoaded && sliderRef.current) {
      $(sliderRef.current).slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1500,
        arrows: false,
        dots: false,
        pauseOnHover: false,
        infinite: true, // Ensure infinite looping of slides
        responsive: [
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 4,
            },
          },
          {
            breakpoint: 520,
            settings: {
              slidesToShow: 3,
            },
          },
        ],
      });
    }
  }, [isSlickLoaded]);

  return (
    <div className="container clients">
      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12">
          <h2>
            <b>Our Clients</b>
          </h2>
          <section ref={sliderRef} className="customer-logos slider">
            <div className="slide">
              <img src={client1} alt="Client 1" />
            </div>
            <div className="slide">
              <img src={client2} alt="Client 2" />
            </div>
            <div className="slide">
              <img src={client3} alt="Client 3" />
            </div>
            <div className="slide">
              <img src={client4} alt="Client 4" />
            </div>
            <div className="slide">
              <img src={client5} alt="Client 5" />
            </div>
            <div className="slide">
              <img src={client6} alt="Client 6" />
            </div>
            <div className="slide">
              <img src={client7} alt="Client 7" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Clients;
