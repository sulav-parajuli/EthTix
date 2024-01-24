import React, { useState } from "react";
import { useAppContext } from "./AppContext";
import { Triangle } from "react-loader-spinner";

const Dashboard = ({ state }) => {
  const { ticketsContract } = state;
  const [isLoading, setIsLoading] = useState(true);
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
            height: "100vh", // 100% of the viewport height
          }}
          wrapperClass=""
        />
      ) : (
        <div>
          <h1>Dashboard</h1>
        </div>
      )}
    </>
  );
};

export default Dashboard;
