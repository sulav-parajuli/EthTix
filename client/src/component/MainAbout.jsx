import React from "react";
import { Link } from "react-router-dom";

const MainAbout = () => {
  return (
    <div className="aboutcontainer">
      <div
        className="text-container"
        style={{
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <div
          style={{
            padding: "20px",
          }}
        >
          <p className="main-text">About EthTix</p>
          <hr />
          <p
            className="sub-text"
            style={{
              paddingBottom: "20px",
            }}
          >
            EthTix is the Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Architecto ut praesentium quidem perferendis veritatis
            aliquam, eius quos natus animi. Excepturi assumenda fugiat itaque
            provident quaerat commodi. Omnis et magni ad? Lorem ipsum dolor sit
            amet, consectetur adipisicing elit. Corrupti pariatur nesciunt nam
            nemo eligendi laboriosam ex, tempora nobis minus laudantium
            temporibus mollitia ratione sunt? Accusamus quia dolorum delectus
            facilis corrupti.
            <br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam,
            labore quos laudantium voluptatem quidem accusamus totam voluptate
            modi aspernatur, vel dignissimos? Laudantium fuga architecto non
            tempore, sequi deleniti commodi sit.
          </p>
          <Link to="/about" className="main-button">
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainAbout;
