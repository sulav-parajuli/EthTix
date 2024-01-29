import React, { useState, useEffect } from "react";
import { useAppContext } from "./AppContext";
import { Triangle } from "react-loader-spinner";

const Users = ({ state }) => {
  const { ticketsContract } = state;
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin, accounts } = useAppContext();
  const [organizers, setOrganizers] = useState([]);
  // Exclude the first element (accounts[0]) from the users array to remove your own accounts from users state.
  const users = accounts.slice(1);

  const getOrganizers = async () => {
    if (!ticketsContract) {
      return;
    }
    const organizer = await ticketsContract.getAllOrganizers();
    // console.log(organizer);
    setOrganizers(organizer);
  };

  useEffect(() => {
    try {
      if (isAdmin) {
        getOrganizers();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [ticketsContract]);

  // Replace this data with your actual user data
  const usersData = [
    { name: "Organizer 1", status: "Active" },
    { name: "Organizer 2", status: "Inactive" },
    { name: "User 1", status: "Active" },
    { name: "User 2", status: "Inactive" },
    // Add more users as needed
  ];

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
        <div style={{ marginRight: "5%", marginLeft: "5%" }}>
          {/* Organizers */}
          {isAdmin ? (
            <>
              <div className="mt-4">
                <div className="card-header">
                  <h5>Admins</h5>
                  <hr />
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between">
                    <b>Admins</b>
                    <span>
                      <b>Status</b>
                    </span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    {accounts[0]}
                    <span className="text-success">Active</span>
                  </li>
                </ul>
              </div>
              <div className="mt-4">
                <div className="card-header">
                  <h5>Organizers</h5>
                  <hr />
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between">
                    <b>Organizers</b>
                    <span>
                      <b>Status</b>
                    </span>
                  </li>
                  {organizers.map((user, index) => (
                    <li
                      key={index}
                      className="list-group-item d-flex justify-content-between"
                    >
                      {user}
                      {/* Add more information as needed */}
                      <span className="text-danger">Inactive</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : null}

          {/* Other Users */}
          <div className="mt-4 mr-5 ml-5">
            <div className="card-header">
              <h5>Users</h5>
              <hr />
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex justify-content-between">
                <b>Users</b>
                <span>
                  <b>Status</b>
                </span>
              </li>
              {users.map((user, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between"
                >
                  {user}
                  <span className="text-success">Active</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Users;
