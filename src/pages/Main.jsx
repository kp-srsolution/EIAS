import React, { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import logo from "../logo.png";
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import BatchPredictionIcon from '@mui/icons-material/BatchPrediction';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { Link, useNavigate } from "react-router-dom";


const Main = () => {
    const [QRCode, setQRCode] = useState(null);        // store decoded QR text
    const [decodedBarcodes, setDecodedBarcodes] = useState([]);
    const [isQRCodeDetected, setIsQRCodeDetected] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pins, setPins] = useState(null);
    const [isWebCamEnable, setIsWebCamEnable] = useState(false);
    const [QRImgSrc, setQRImgSrc] = useState(null);
    const [model, setModel] = useState("select");

    const navigate = useNavigate();

    const webcamRef = useRef(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/log/Logs");
                console.log(res.data);
                
            } catch (e) {
                console.error(e);
            }
        }
        fetch();
    }, [])

    const videoConstraints = {
        width: 768,
        height: 432,
        facingMode: "environment",
    };

    const resetCaptureQR = () => {
        setQRImgSrc(null);
        setQRCode(null);
        setIsQRCodeDetected(false);
        setPins(null);
    }

    // Capture and detect QR
    const captureAndDetectQR = useCallback(async () => {
        if (!webcamRef.current) return;
        resetCaptureQR();

        const screenshot = webcamRef.current.getScreenshot();
        setQRImgSrc(screenshot);
        setDecodedBarcodes([]);
        setLoading(true);

        try {
            const base64Data = screenshot.split(",")[1];
            const res = await axios.post("http://localhost:5001/read-qr/", {
                ImageBase64: base64Data
            }, {
                headers: { "Content-Type": "application/json" }
            });

            console.log("QR Decode:", res.data);
            const decoded = res.data.decoded || [];
            setDecodedBarcodes(decoded);

            if (decoded.length > 0 && decoded[0].data !== "") {
                setQRCode(decoded[0]);
                setIsQRCodeDetected(true);
                // alert(`QR Detected: ${decoded[0].data}`);
            }
        } catch (error) {
            console.error("Error decoding QR:", error);
            alert("QR decoding failed!");
        } finally {
            setLoading(false);
        }
    }, [webcamRef]);

    const changeModel = async (val) => {
        if (val !== model && val !== "select") {
            setModel(val);
            setQRCode(null);
            setPins(null);
        }
    }

    const handleCameraChange = async (value) => {
        if (model === "select") {
            alert("Please select module, then try to enable the camera.");
            return;
        }
        setIsWebCamEnable(value);
    }

    // Capture and detect pin (send QR value + image)
    const captureAndDetectPin = useCallback(async () => {
        if (!webcamRef.current || QRCode == null) {
            alert("Please scan QR first!");
            return;
        }

        const screenshot = webcamRef.current.getScreenshot();
        setPins(null);
        setLoading(true);

        try {
            const base64Data = screenshot.split(",")[1];
            let response = "";
            if (model === "8-pin") {
                response = await axios.post(
                    "http://localhost:5001/detect-8pins",
                    { ImageBase64: base64Data, QRCode: QRCode.data },   // include QR name
                    { headers: { "Content-Type": "application/json" } }
                );
            } else if(model === "4-pin") {
                response = await axios.post(
                    "http://localhost:5001/detect-4pins",
                    { ImageBase64: base64Data, QRCode: QRCode.data },   // include QR name
                    { headers: { "Content-Type": "application/json" } }
                );
            } else if(model === "3-pin") {
                response = await axios.post(
                    "http://localhost:5001/detect-3pins",
                    { ImageBase64: base64Data, QRCode: QRCode.data },   // include QR name
                    { headers: { "Content-Type": "application/json" } }
                );
            } else if(model === "2-pin") {
                response = await axios.post(
                    "http://localhost:5001/detect-2pins",
                    { ImageBase64: base64Data, QRCode: QRCode.data },   // include QR name
                    { headers: { "Content-Type": "application/json" } }
                );
            }

            console.log("Pin Detection:", response.data);
            setPins(response.data);
            // alert(`Image saved as: ${QRCode}.jpg`);
        } catch (error) {
            console.error("Error sending image to backend:", error);
            alert("Pin detection failed!");
        } finally {
            setLoading(false);
        }
    }, [webcamRef, QRCode]);

    return (
        <>

            <nav
                className="admin-nav-bar"
                style={{ position: "fixed", left: 0, top: 0, zIndex: "100" }}
            >
                <div className="admin-nav-content-container" style={{ width: "1000px" }}>
                    <div className="admin-nav-logo-container" style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "#1A486F",
                        fontWeight: "700",
                        fontSize: "25px",
                        gap: "8px"
                    }}>
                        <img
                            src={logo}
                            alt="Dashboard"
                            style={{ width: "auto", height: "40px" }}
                        />
                    </div>
                    <div className="admin-nav-option-container">
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                color: "red",
                                cursor: "pointer",
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
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                color: "Blue",
                                cursor: "pointer",
                                fontSize: "18px",
                                fontWeight: "600",
                            }}
                            onClick={() => {
                                navigate("/report");
                            }}
                        >
                            Download Report
                        </div>
                    </div>
                </div>
            </nav>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    minHeight: "70vh",
                    height: "auto",
                    marginTop: "85px",
                    gap: "20px",
                }}
            >
                {isWebCamEnable ?
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        width={videoConstraints.width}
                        height={videoConstraints.height}
                        videoConstraints={videoConstraints}
                        style={{
                            border: "2px solid #3d3d3d",
                        }}
                    /> : <div style={{
                        width: "768px",
                        height: "432px",
                        backgroundColor: "#3d3d3d",
                        color: "#efefef65",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        border: "2px solid #3d3d3d"
                    }}>
                        <VideocamOffIcon style={{
                            fontSize: "56px",
                        }} />
                    </div>}
                <table className="custom-table">
                    <thead>
                        <tr style={{color: "white"}}>
                            <th style={{
                                color: "white",
                                borderRight: "1px solid #efefef"
                            }}>Barcode Result</th>
                            <th style={{
                                color: "white"
                            }}>Detection Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{
                                borderRight: "1px solid #efefef",
                                width: "40%",
                            }}>{
                                    QRCode !== null && QRCode.full_data !== "" ? QRCode.full_data : "Not yet captured"
                                }</td>
                            <td>{
                                pins !== null ?
                                    model === "8-pin" ? <>
                                        {
                                            pins.pins > 8 || pins.pins < 8 || pins.pin_bent > 0 ? <b style={{
                                                color: "red",
                                                // color: "#E57373",
                                            }}>{" "}NG Due To {pins.pin_bent > 0 ? "Bent Pins" : "Missing Pins"}</b> : <b style={{
                                                color: "green",
                                                // color: "#6bff6b",
                                            }}>{" "}OKAY</b>
                                        }
                                    </> : model === "4-pin" ? <>
                                        {
                                            pins.pins > 4 || pins.pins < 4 || pins.pin_bent > 0 ||  !pins.status ? <b style={{
                                                color: "red",
                                                // color: "#E57373",
                                            }}>{" "}NG { !pins.status ? " Due To Upside Down connector" : ""}</b> : <b style={{
                                                color: "green",
                                                // color: "#6bff6b",
                                            }}>{" "}OKAY</b>
                                        }
                                    </> : model === "3-pin" ? <>
                                        {
                                            pins.pins > 2 || pins.pins < 2 || pins.pin_female != 1 ? <b style={{
                                                color: "red",
                                                // color: "#E57373",
                                            }}>{" "}NG Due To {"Missing Pins"}</b> : <b style={{
                                                color: "green",
                                                // color: "#6bff6b",
                                            }}>{" "}OKAY</b>
                                        }
                                    </> : <>
                                        {
                                            pins.pins > 2 || pins.pins < 2 ? <b style={{
                                                color: "red",
                                                // color: "#E57373",
                                            }}>{" "}NG</b> : <b style={{
                                                color: "green",
                                                // color: "#6bff6b",
                                            }}>{" "}OKAY</b>
                                        }
                                    </>
                                    : "Not yet captured"
                            }</td>
                        </tr>
                    </tbody>
                </table>
                {isWebCamEnable ?
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "5px",
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "flex-start",
                        }}>
                            <label style={{ fontSize: "13px" }}>Select Module:</label>
                            <select
                                className="input"
                                value={model}
                                onChange={(e) => changeModel(e.target.value)}
                                style={{ width: "200px" }}
                            >
                                <option value="select">Select Module</option>
                                <option value="8-pin">8-pin Module</option>
                                <option value="4-pin">4-pin Module</option>
                                <option value="3-pin">3-pin Module</option>
                                <option value="2-pin">2-pin Module</option>
                            </select>
                        </div>
                        <ArrowRightAltIcon />
                        <button className="input capture-input disble-capture-input first-capture-input" onClick={() => { handleCameraChange(false); }}>
                            <VideocamOffIcon /> Disable Camera
                        </button>
                        <ArrowRightAltIcon />
                        {
                            QRCode == null || QRCode.data === "" ?
                                <button className="input capture-input second-capture-input new-button" onClick={captureAndDetectQR}>
                                    <QrCodeScannerIcon /> Scan Barcode
                                </button> :
                                <button className="input capture-input reset-capture-input second-capture-input" onClick={captureAndDetectQR}>
                                    <QrCodeScannerIcon /> Scan Barcode
                                </button>
                        }
                        <ArrowRightAltIcon />

                        {QRCode != null && QRCode.data !== "" ?
                            <button
                                className="input capture-input third-capture-input new-button"
                                disabled={!isQRCodeDetected}
                                onClick={captureAndDetectPin}
                            >
                                <BatchPredictionIcon />Capture Image
                            </button>
                            :
                            <button
                                className="input capture-input diable-capture-input-class third-capture-input"
                                disabled={!isQRCodeDetected}
                            >
                                <BatchPredictionIcon />Capture Image
                            </button>
                        }
                    </div> : <div style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "5px",
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "flex-start",
                        }}>
                            <label style={{ fontSize: "13px" }}>Select Module:</label>
                            <select
                                className="input"
                                value={model}
                                onChange={(e) => changeModel(e.target.value)}
                                style={{ width: "200px" }}
                            >
                                <option value="select">Select Module</option>
                                <option value="8-pin">8-pin Module</option>
                                <option value="4-pin">4-pin Module</option>
                                <option value="3-pin">3-pin Module</option>
                                <option value="2-pin">2-pin Module</option>
                            </select>
                        </div>
                        <ArrowRightAltIcon />
                        <button className="input capture-input enable-capture-input first-capture-input" onClick={() => handleCameraChange(true)}>
                            <VideocamIcon /> Enable Camera
                        </button>
                        <ArrowRightAltIcon />
                        {
                            QRCode == null || QRCode.data === "" ?
                                <button className="input capture-input diable-capture-input-class second-capture-input">
                                    <QrCodeScannerIcon /> Scan Barcode
                                </button> :
                                <button className="input capture-input diable-capture-input-class second-capture-input">
                                    <QrCodeScannerIcon /> Scan Barcode
                                </button>
                        }
                        <ArrowRightAltIcon />

                        <button
                            className="input capture-input diable-capture-input-class third-capture-input"
                            disabled={!isQRCodeDetected}
                        >
                            <BatchPredictionIcon />Capture Image
                        </button>
                    </div>}

                {/* display QR code image */}
                {/* {QRImgSrc && QRCode != "" ? (<div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", }} > <img src={QRImgSrc} alt="Captured" style={{ width: "100%", maxWidth: "520px" }} /> </div>) : undefined} */}
            </div>
        </>
    );
};

export default Main;
