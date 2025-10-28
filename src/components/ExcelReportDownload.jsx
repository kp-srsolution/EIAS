// src/components/ExcelReportDownload.jsx
import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ExcelReportDownload = ({ data, binNumber }) => {
  const exportToExcel = () => {
    if (!data || data.length === 0) {
      alert("No data available to export!");
      return;
    }

    // Format the data to include only the required fields
    const formattedData = data.map((item) => ({
      BinNumber: item.qrCodeData || "",
      Status: item.status || "",
      Module: item.module || "",
      Time: item.timestamp
        ? new Date(item.timestamp).toLocaleString()
        : "N/A",
    }));

    // Create a worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    // Generate and trigger download
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    const fileName = `Report_${binNumber || "All"}_${new Date().toISOString().split("T")[0]}.xlsx`;
    saveAs(blob, fileName);
  };

  return (
    <button
      onClick={exportToExcel}
      style={{
        backgroundColor: "#1A486F",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        padding: "10px 20px",
        fontSize: "16px",
        fontWeight: "500",
        cursor: "pointer",
        marginLeft: "15px",
      }}
    >
      📊 Download Excel Report
    </button>
  );
};

export default ExcelReportDownload;
