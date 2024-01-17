import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "../assets/css/Main.css";
import ethtix from "../assets/images/abstract.png";
import { retrieveFromIPFS } from "../utils/ipfsUtils";
import { useAppContext } from "./AppContext";
import { Triangle } from "react-loader-spinner";
//Import fontawesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

const Reports = ({ state }) => {
  const { formatTime } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const { ticketsContract } = state;

  return (
    <div>
      {isLoading ? (
        <Triangle
          visible={true}
          height="80"
          width="80"
          color="#008eb0"
          ariaLabel="triangle-loading"
          wrapperStyle={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh", // 100% of the viewport height
          }}
          wrapperClass=""
        />
      ) : (
        <>
          <div className="event-blocks">
            {events.length === 0 ? (
              <p>No any reports found..</p>
            ) : (
              <div className="row">
                {events.map((event, index) => (
                  <div
                    key={index}
                    className="col-12 mb-4 card"
                    style={{ padding: "0px" }}
                  >
                    <div
                      className="card-body"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <h4 style={{ margin: "0px" }}>
                        {event.eventName.toString()}{" "}
                      </h4>
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        onClick={() => handleSelectEvent(index)}
                        style={{ alignSelf: "center" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
