// components/UserProfile.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const UserProfile = () => {
  const [userData, setUserData] = useState({});
  const [adminApprovalStatus, setAdminApprovalStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(
          "http://localhost:5000/user-profile"
        );
        const adminResponse = await axios.get(
          "http://localhost:5000/admin-approval"
        );

        setUserData(userResponse.data);
        setAdminApprovalStatus(adminResponse.data.isApproved);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Error fetching user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); // Run only once on component mount

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="container mt-5">
      <h1 className="title">User Profile</h1>
      <div className="content">
        {Object.keys(userData).length === 0 ? (
          <p>No information available. Please submit the form.</p>
        ) : (
          <>
            <p>
              <strong>Username:</strong> {userData.username}
            </p>
            <p>
              <strong>Ration Card Number:</strong> {userData.rationCardNumber}
            </p>
            <p>
              <strong>Name:</strong> {userData.name}
            </p>
            <p>
              <strong>Date of Birth:</strong>{" "}
              {new Date(userData.dob).toLocaleDateString()}
            </p>
            <p>
              <strong>Gender:</strong> {userData.gender}
            </p>
            <p>
              <strong>Mobile Number:</strong> {userData.mobileNumber}
            </p>
            <p>
              <strong>Year:</strong> {userData.year}
            </p>
            <p>
              <strong>Income:</strong> {userData.income}
            </p>
            <p>
              <strong>Admin Approval Status:</strong>{" "}
              {adminApprovalStatus ? "Approved" : "Pending"}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
