// src/components/LoadingScreen.js
import React from "react";
import "../CSS/style.css"
import logo from "../logo.png";


export default function LoadingScreen() {
  return (
    <div className="loading-container">
      <div className="loading-box">
        <img
          src={logo}
          alt="Dashboard"
          style={{ width: "auto", height: "150px" }}
        />
        <h1 className="loading-title">Application is initiating...</h1>
        <p className="loading-text">Please wait while the application prepares.</p>
      </div>
    </div>
  );
}