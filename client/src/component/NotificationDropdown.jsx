import React, { useState, useEffect } from "react";
import { useAppContext } from "./AppContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const NotificationDropdown = () => {
  const { notifications, setNotifications } = useAppContext();
  const [selectedNotificationIndex, setSelectedNotificationIndex] = useState(
    []
  );
  const [selectAll, setSelectAll] = useState(true);

  const fetchNotifications = () => {
    try {
      const storedNotifications = localStorage.getItem("notifications");

      if (storedNotifications) {
        const parsedNotifications = JSON.parse(storedNotifications);
        setNotifications(parsedNotifications);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleDeleteNotification = (indicesToDelete) => {
    const updatedNotifications = notifications.filter(
      (_, index) => !indicesToDelete.includes(index)
    );
    setNotifications(updatedNotifications);
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
    setSelectedNotificationIndex([]);
  };

  const handleSelectNotification = (index) => {
    const isSelected = selectedNotificationIndex.includes(index);
    if (isSelected) {
      setSelectedNotificationIndex((prevSelected) =>
        prevSelected.filter((selectedIndex) => selectedIndex !== index)
      );
    } else {
      setSelectedNotificationIndex((prevSelected) => [...prevSelected, index]);
    }
  };

  const handleSelectAll = () => {
    const allIndices = notifications.map((_, index) => index);
    const allSelected = selectedNotificationIndex.length === allIndices.length;

    if (allSelected) {
      setSelectAll(true);
      setSelectedNotificationIndex([]);
    } else {
      setSelectedNotificationIndex(allIndices);
      setSelectAll(false);
    }
  };

  return (
    <div className={"userdropdown"}>
      <div className="event-blocks">
        {notifications.length === 0 ? (
          <p>No notifications found.</p>
        ) : (
          <div className="row">
            <div
              className="insection d-flex justify-content-between align-items-center card-body"
              style={{ padding: "5px" }}
            >
              <label>
                <input
                  type="checkbox"
                  checked={
                    selectedNotificationIndex.length === notifications.length
                  }
                  onChange={handleSelectAll}
                />
                &nbsp; Select All
              </label>
              {selectAll ? (
                <p
                  style={{ margin: "0px" }}
                  onClick={() =>
                    handleDeleteNotification(
                      Array.from(
                        { length: notifications.length },
                        (_, index) => index
                      )
                    )
                  }
                >
                  Remove All
                </p>
              ) : (
                <p
                  style={{ margin: "0px" }}
                  onClick={() =>
                    handleDeleteNotification(selectedNotificationIndex)
                  }
                >
                  Delete Selected
                </p>
              )}
            </div>
            <hr style={{ margin: "0px" }} />
            {notifications.map((notification, index) => (
              <div
                key={index}
                className="col-12 mb-4"
                style={{ padding: "0px" }}
              >
                <div
                  className="insection d-flex justify-content-between align-items-center card-body"
                  style={{ padding: "5px" }}
                  onClick={() => handleSelectNotification(index)}
                >
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedNotificationIndex.includes(index)}
                      onChange={() => handleSelectNotification(index)}
                    />
                  </label>
                  &nbsp;
                  <p style={{ margin: "0px" }}>
                    {notification.notificationName}
                  </p>
                  <FontAwesomeIcon
                    icon={faTrash}
                    onClick={() => handleDeleteNotification([index])}
                    style={{ alignSelf: "center" }}
                  />
                </div>
                <hr style={{ margin: "0px" }} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
