// HomePage.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HomePage = () => {
  const [formData, setFormData] = useState({
    rationCardNumber: "",
    name: "",
    dob: "",
    gender: "",
    mobileNumber: "",
    year: "",
    income: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a request to send the form data to the server
      const response = await axios.post(
        "http://localhost:5000/submit-form",
        formData
      );

      console.log("Form submitted successfully!", response.data);

      // Navigate to the user profile page after successful form submission
      navigate("/profile", {
        state: { user: formData, isAdminApproved: false },
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  const handleLogout = () => {
    sessionStorage.removeItem("userToken");

    // Navigate to the homepage after "logging out"
    navigate("/");
  };

  return (
    <div className="container mt-5">
      <h1 className="title">Family Application Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">Ration Card Number</label>
          <div className="control">
            <input
              type="text"
              className="input"
              name="rationCardNumber"
              value={formData.rationCardNumber}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Name</label>
          <div className="control">
            <input
              type="text"
              className="input"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Date of Birth</label>
          <div className="control">
            <input
              type="date"
              className="input"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Gender</label>
          <div className="control">
            <input
              type="text"
              className="input"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Mobile Number</label>
          <div className="control">
            <input
              type="tel"
              className="input"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Year</label>
          <div className="control">
            <input
              type="text"
              className="input"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Income</label>
          <div className="control">
            <input
              type="text"
              className="input"
              name="income"
              value={formData.income}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="field">
          <div className="control">
            <button type="submit" className="button is-primary">
              Submit
            </button>
          </div>
        </div>
      </form>
      <div className="mt-3">
        <button onClick={handleLogout} className="button is-danger">
          Logout
        </button>
      </div>
    </div>
  );
};

export default HomePage;
