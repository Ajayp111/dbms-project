// AdminPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminPage = () => {
  const [familyData, setFamilyData] = useState([]);

  useEffect(() => {
    // Fetch family data from the server
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/family-data");
        setFamilyData(response.data);
      } catch (error) {
        console.error("Error fetching family data:", error);
      }
    };

    fetchData();
  }, []); // Run only once on component mount

  const handleApproval = async (familyId, isApproved) => {
    try {
      // Send approval status to the server
      const response = await axios.put(
        `http://localhost:5000/approve/${familyId}`,
        { isApproved }
      );

      // Update the local familyData state
      setFamilyData((prevData) =>
        prevData.map((family) =>
          family._id === familyId ? { ...family, isApproved } : family
        )
      );

      console.log("Approval status updated successfully!", response.data);
    } catch (error) {
      console.error("Error updating approval status:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="title">Admin Page</h1>
      <table className="table is-fullwidth">
        <thead>
          <tr>
            <th>Ration Card Number</th>
            <th>Name</th>
            <th>Date of Birth</th>
            <th>Gender</th>
            <th>Mobile Number</th>
            <th>Year</th>
            <th>Income</th>
            <th>Approval Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {familyData.map((family) => (
            <tr key={family._id}>
              <td>{family.rationCardNumber}</td>
              <td>{family.name}</td>
              <td>{family.dob}</td>
              <td>{family.gender}</td>
              <td>{family.mobileNumber}</td>
              <td>{family.year}</td>
              <td>{family.income}</td>
              <td>{family.isApproved ? "Approved" : "Pending"}</td>
              <td>
                <button
                  onClick={() => handleApproval(family._id, true)}
                  className="button is-success mr-2"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleApproval(family._id, false)}
                  className="button is-danger"
                >
                  Disapprove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
