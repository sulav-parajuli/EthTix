import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "./AppContext";
import { Triangle } from "react-loader-spinner";
import { Chart } from "chart.js/auto";

const Dashboard = ({ state }) => {
  const { ticketsContract } = state;
  const [isLoading, setIsLoading] = useState(true);
  const chartRef = useRef(null);

  // Placeholder data for statistics
  const eventCreated = 50;
  const userRegistered = 200;
  const ticketSold = 100;
  const totalTickets = 500;

  useEffect(() => {
    // Ensure that the chartRef.current is available before attempting to getContext
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            {
              label: "Ticket Sales",
              data: [12, 19, 3, 5, 2, 3],
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 2,
              fill: false,
            },
          ],
        },
        options: {
          scales: {
            x: {
              type: "linear",
              position: "bottom",
            },
            y: {
              min: 0,
            },
          },
        },
      });
    }
  }, []);

  useEffect(() => {
    // Simulate loading delay
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
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
            height: "100vh",
          }}
          wrapperClass=""
        />
      ) : (
        <>
          {/* Statistics Row */}
          <div className="row">
            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{eventCreated}</h5>
                  <p className="card-text">Events Created</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{userRegistered}</h5>
                  <p className="card-text">User Registered</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{ticketSold}</h5>
                  <p className="card-text">Ticket Sold</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{totalTickets}</h5>
                  <p className="card-text">Total Tickets</p>
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Section */}
          <div className="row mt-4">
            <div className="col-md-8">
              {/* Placeholder for Analytics Carousel */}
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Analytics</h5>
                  <canvas
                    id="ticketSalesChart"
                    width="400"
                    height="200"
                    ref={chartRef}
                  ></canvas>
                  {/* Add your carousel component here */}
                </div>
              </div>
            </div>
            <div className="col-md-4">
              {/* Placeholder for Events List */}
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Events List</h5>
                  {/* Add your events list component here */}
                </div>
              </div>
              {/* Placeholder for Ticket Sold Data */}
              <div className="card mt-4">
                <div className="card-body">
                  <h5 className="card-title">Ticket Sold Data</h5>
                  {/* Add your ticket sold data component here */}
                </div>
              </div>
            </div>
          </div>

          {/* Currency Converter Section */}
          <div className="row mt-4">
            <div className="col-md-6">
              {/* Placeholder for Currency Converter */}
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Currency Converter</h5>
                  {/* Add your currency converter component here */}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;
