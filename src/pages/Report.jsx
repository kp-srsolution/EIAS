import React, { useState } from "react";
import DataReportDownload from "../components/DataReportDownload";
import ExcelReportDownload from "../components/ExcelReportDownload"; // ✅ new import
import navLogo from "../logo.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Report = () => {
  const [binNumber, setBinNumber] = useState("");
  const [results, setResults] = useState(null);
  const [logo, setLogo] = useState("http://localhost:3000/images/Exide-Energy.jpg");
  const navigate = useNavigate();

  const toBase64 = (filePath) => {
    return new Promise((resolve, reject) => {
      fetch(filePath)
        .then((res) => res.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
        .catch(reject);
    });
  };

  const handleSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/log/Logs/search/${binNumber}`);
      setResults(res.data);
    } catch (e) {
      console.error(e);
    }

    if (logo) {
      try {
        const logoBase64 = await toBase64(logo);
        setLogo(logoBase64);
      } catch (err) {
        console.error("Error converting logo:", err);
      }
    }
  };

  return (
    <>
      {/* ✅ Navbar */}
      <nav className="admin-nav-bar" style={{ position: "fixed", left: 0, top: 0, zIndex: "100" }}>
        <div className="admin-nav-content-container" style={{ width: "1000px" }}>
          <div
            className="admin-nav-logo-container"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              color: "#1A486F",
              fontWeight: "700",
              fontSize: "25px",
              gap: "8px",
            }}
          >
            <img src={navLogo} alt="Dashboard" style={{ width: "auto", height: "40px" }} />
          </div>
          <div className="admin-nav-option-container">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "20px",
                fontWeight: "800",
                color: "#1A486F",
              }}
            >
              Endoscopic Image Acquisition System
            </div>
          </div>
          <div className="admin-nav-option-container">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#1A486F",
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: "600",
              }}
              onClick={() => {
                navigate("/");
              }}
            >
              Dashboard
            </div>
          </div>
        </div>
      </nav>

      {/* ✅ Main Section */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          minHeight: "70vh",
          marginTop: "85px",
          gap: "20px",
        }}
      >
        <h2>Bin Report Search</h2>

        <div className="search-container">
          <input
            type="text"
            placeholder="Enter Bin Number"
            value={binNumber}
            style={{ width: "300px" }}
            onChange={(e) => {
              setBinNumber(e.target.value);
              setResults(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        {results && results.length > 0 ? (
          <div className="results-section">
            <h3>Search Results</h3>

            <table className="results-table">
              <thead>
                <tr>
                  <th>Bin Number</th>
                  <th>Status</th>
                  <th>Module</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {results.map((item) => (
                  <tr key={item.id}>
                    <td>{item.qrCodeData}</td>
                    <td>{item.status}</td>
                    <td>{item.module}</td>
                    <td>{new Date(item.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              {/* ✅ Existing PDF Report */}
              <DataReportDownload
                parameter={{ id: Date.now(), options: results }}
                user={{ name: "Test User" }}
                module={{ name: "Module1" }}
                data={results}
                logo={logo}
              />

              {/* ✅ New Excel Report */}
              <ExcelReportDownload data={results} binNumber={binNumber} />
            </div>
          </div>
        ) : (
          binNumber && results && results.length === 0 && (
            <p className="no-record">No record found for Bin Number: {binNumber}</p>
          )
        )}
      </div>
    </>
  );
};

export default Report;
