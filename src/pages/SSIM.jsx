
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

const SSIM = () => {
    const [QRCode, setQRCode] = useState({ data: "da", full_data: "asa" });        // store decoded QR text
    const [decodedBarcodes, setDecodedBarcodes] = useState([]);
    const [isQRCodeDetected, setIsQRCodeDetected] = useState(true);
    const [loading, setLoading] = useState(false);
    const [pins, setPins] = useState(null);
    const [isWebCamEnable, setIsWebCamEnable] = useState(false);
    const [QRImgSrc, setQRImgSrc] = useState(null);
    const [file1, setFile1] = useState(null);
    const [file2, setFile2] = useState(null);
    // const [file2, setFile2] = useState(null);
    const [preview1, setPreview1] = useState(null);
    const [preview2, setPreview2] = useState(null);
    const [result, setResult] = useState(null);
    const [blur, setBlur] = useState(null);
    // const [loading, setLoading] = useState(false);

    const webcamRef = useRef(null);

    const videoConstraints = {
        width: 768,
        height: 432,
        facingMode: "environment",
    }

    function roundToDecimal(num, precision) {
        const factor = Math.pow(10, precision);
        return Math.round(num * factor) / factor;
    }

    // Capture and detect pin (send QR value + image)
    const captureAndDetectPin = useCallback(async () => {
        if (!file1) return alert('Please choose both images');
        setLoading(true);
        // const screenshot = webcamRef.current.getScreenshot();
        // const img2 = screenshot.split(",")[1];
        // setIsWebCamEnable(false);
        // setPreview2(screenshot);
        const form = new FormData();
        form.append('ref', file1);
        form.append('test', file2)

        try {
            const res = await axios.post('http://localhost:8000/compare', form, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setResult(res.data);
            console.log(res.data);

        } catch (e) {
            console.error(e);

        } finally {
            setLoading(false);
        }

        // try {
        //     const base64Data = screenshot.split(",")[1];

        //     const response = await axios.post(
        //         "http://localhost:5001/predict-base64/",
        //         { ImageBase64: base64Data, QRCode: QRCode.data },   // include QR name
        //         { headers: { "Content-Type": "application/json" } }
        //     );

        //     console.log("Pin Detection:", response.data);
        //     setPins(response.data);
        //     // alert(`Image saved as: ${QRCode}.jpg`);
        // } catch (error) {
        //     console.error("Error sending image to backend:", error);
        //     alert("Pin detection failed!");
        // } finally {
        //     setLoading(false);
        // }
    }, [webcamRef]);
    // }, [preview2]);

    useEffect(() => {
        // const detectTheBlur = async () => {
        //     if(file1 == null) {
        //         console.log("return");

        //         return;
        //     }
        //     setLoading(true);
        //     // const screenshot = webcamRef.current.getScreenshot();
        //     // const img2 = screenshot.split(",")[1];
        //     // setIsWebCamEnable(false);
        //     // setPreview2(screenshot);
        //     // const form = new FormData();
        //     // form.append('ref', file1);
        //     // form.append('test', file2);
        //     const rois = `[
        //         [326, 255, 434, 328],
        //         [552, 265, 614, 327],
        //         [667, 265, 721, 330],
        //         [860, 263, 983, 331],
        //         [853, 367, 978, 435],
        //         [675, 382, 716, 438],
        //         [557, 374, 612, 431],
        //         [323, 372, 412, 429]
        //       ]`;
        //     const form = new FormData();
        //     form.append('file', file1);
        //     form.append('rois', rois);

        //     try {
        //         const res = await axios.post('http://localhost:8000/upload-reference/', form, {
        //             headers: { 'Content-Type': 'multipart/form-data' },
        //         });
        //         setBlur(res.data);
        //         console.log(res.data);

        //     } catch (e) {
        //         console.error(e);

        //     } finally {
        //         setLoading(false);
        //     }
        // }
        const captureAndCheckSimi = async () => {
            // if (!file1 || !file2) return alert('Please choose both images');
            setLoading(true);
            // const screenshot = webcamRef.current.getScreenshot();
            // const img2 = screenshot.split(",")[1];
            // setIsWebCamEnable(false);
            // setPreview2(screenshot);
            // const form = new FormData();
            // form.append('ref', file1);
            // form.append('test', file2);
            const form = new FormData();
            form.append('file', file2);

            try {
                const res = await axios.post('http://localhost:8000/process-image', form, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                // setResult(res.data);
                setBlur(res.data);
                console.log(res.data);

            } catch (e) {
                console.error(e);

            } finally {
                setLoading(false);
            }
        }
        if (file2 != null) {
            captureAndCheckSimi();
            console.log(file2);
        } else {
            console.log("hello");

        }
    }, [file2])

    useEffect(() => {
        const detectTheBlur = async () => {
            if(file1 == null) {
                console.log("return");

                return;
            }
            setLoading(true);
            // const screenshot = webcamRef.current.getScreenshot();
            // const img2 = screenshot.split(",")[1];
            // setIsWebCamEnable(false);
            // setPreview2(screenshot);
            // const form = new FormData();
            // form.append('ref', file1);
            // form.append('test', file2);
            const rois = `[
                [326, 255, 434, 328],
                [552, 265, 614, 327],
                [667, 265, 721, 330],
                [860, 263, 983, 331],
                [853, 367, 978, 435],
                [675, 382, 716, 438],
                [557, 374, 612, 431],
                [323, 372, 412, 429]
              ]`;
            const form = new FormData();
            form.append('file', file1);
            form.append('rois', rois);

            try {
                const res = await axios.post('http://localhost:8000/upload-reference/', form, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                setBlur(res.data);
                console.log(res.data);

            } catch (e) {
                console.error(e);

            } finally {
                setLoading(false);
            }
        }
        if (!file1) {
            detectTheBlur();
        }
    }, [file1])

    const handleFile = (e) => {
        const f = e.target.files[0];
        setFile1(f);
        if (f) setPreview1(URL.createObjectURL(f));
    };
    const handleFile2 = (e) => {
        const f = e.target.files[0];
        setFile2(f);
        if (f) setPreview2(URL.createObjectURL(f));
        // if(f) captureAndCheckSimi();
    };

    // const submit = async () => {
    //     if (!file1) return alert('Please choose both images');
    //     setLoading(true);
    //     const form = new FormData();
    //     form.append('image1', file1);
    //     try {
    //         const res = await axios.post('http://localhost:8000/compare', form, {
    //             headers: { 'Content-Type': 'multipart/form-data' },
    //         });
    //         setResult(res.data);
    //     } catch (err) {
    //         console.error(err);
    //         alert(err?.response?.data?.detail || 'Request failed');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

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
                    <div className="admin-nav-option-container" />
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
                {/* {isWebCamEnable ?
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
                    </div>} */}
                {/* {isWebCamEnable ?
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "5px",
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <button className="input capture-input disble-capture-input first-capture-input" onClick={() => { setIsWebCamEnable(false); }}>
                            <VideocamOffIcon /> Disable Camera
                        </button>
                        <ArrowRightAltIcon />

                        {QRCode != null && QRCode.data !== "" ?
                            <button
                                className="input capture-input third-capture-input"
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
                        <button className="input capture-input enable-capture-input first-capture-input" onClick={() => setIsWebCamEnable(true)}>
                            <VideocamIcon /> Enable Camera
                        </button>
                        <ArrowRightAltIcon />

                        <button
                            className="input capture-input diable-capture-input-class third-capture-input"
                            disabled={!isQRCodeDetected}
                        >
                            <BatchPredictionIcon />Capture Image
                        </button>
                    </div>} */}
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: "110px"
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "10px",
                        width: "615px"
                    }}>
                        <input type="file" accept="image/*" onChange={(e) => handleFile(e)} />
                        {preview1 && <img src={preview1} alt="preview1" style={{ width: "95%", marginTop: 8 }} />}

                    </div>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "10px",
                        width: "215px"
                    }}>
                        {/* <b>Similarity: {result != null  && result.ssim != null ? result.ssim > 50 ? <b style={{ color: "green" }}>{result.ssim}%</b> : result.ssim > 25 ? <b style={{ color: "#dfa800" }}>{result.ssim}%</b> : <b style={{ color: "red" }}>{result.ssim}%</b> : undefined}</b> */}
                        {/* {
                            blur != null && blur.combined_quality != null ? `Blur Score: ${blur.combined_quality}` : `Blur Score`
                        } */}
                        <b>Similarity: {" "}
                            {
                                blur != null && blur.combined_quality != null ? blur.combined_quality > 50 ? <b style={{ color: "green" }}>{blur.combined_quality}%</b> : blur.combined_quality > 25 ? <b style={{ color: "#dfa800" }}>{blur.combined_quality}%</b> : <b style={{ color: "red" }}>{blur.combined_quality}%</b> : undefined
                            }
                        </b>
                    </div>
                    {/* <div style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "10px",
                        width: "415px"
                    }}>
                        Captured Image:
                        {preview2 && <img src={preview2} alt="preview1" style={{ width: 400, marginTop: 8 }} />}
                    </div> */}
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "10px",
                        width: "615px"
                    }}>
                        <input type="file" accept="image/*" onChange={(e) => handleFile2(e)} />
                        {preview2 && <img src={preview2} alt="preview1" style={{ width: "95%", marginTop: 8 }} />}
                    </div>
                </div>


                {/* display QR code image */}
                {/* {QRImgSrc && QRCode != "" ? (<div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", }} > <img src={QRImgSrc} alt="Captured" style={{ width: "100%", maxWidth: "520px" }} /> </div>) : undefined} */}
            </div>
        </>
    );
};

export default SSIM;



// import React, { useState } from 'react';
// import axios from 'axios';


// export default function SSIM() {
//     const [file1, setFile1] = useState(null);
//     const [file2, setFile2] = useState(null);
//     const [preview1, setPreview1] = useState(null);
//     const [preview2, setPreview2] = useState(null);
//     const [result, setResult] = useState(null);
//     const [loading, setLoading] = useState(false);

//     const handleFile = (e, setter, setPreview) => {
//         const f = e.target.files[0];
//         setter(f);
//         if (f) setPreview(URL.createObjectURL(f));
//     };


//     const submit = async () => {
//         if (!file1 || !file2) return alert('Please choose both images');
//         setLoading(true);
//         const form = new FormData();
//         form.append('image1', file1);
//         form.append('image2', file2);
//         try {
//             const res = await axios.post('http://localhost:8000/compare', form, {
//                 headers: { 'Content-Type': 'multipart/form-data' },
//             });
//             setResult(res.data);
//         } catch (err) {
//             console.error(err);
//             alert(err?.response?.data?.detail || 'Request failed');
//         } finally {
//             setLoading(false);
//         }
//     };


//     return (
//         <div style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
//             <h1>SSIM Image Similarity</h1>


//             <div style={{ display: 'flex', gap: 24 }}>
//                 <div>
//                     <input type="file" accept="image/*" onChange={(e) => handleFile(e, setFile1, setPreview1)} />
//                     {preview1 && <img src={preview1} alt="preview1" style={{ width: 200, marginTop: 8 }} />}
//                 </div>


//                 <div>
//                     <input type="file" accept="image/*" onChange={(e) => handleFile(e, setFile2, setPreview2)} />
//                     {preview2 && <img src={preview2} alt="preview2" style={{ width: 200, marginTop: 8 }} />}
//                 </div>
//             </div>


//             <div style={{ marginTop: 18 }}>
//                 <button onClick={submit} disabled={loading}>
//                     {loading ? 'Comparing...' : 'Compare'}
//                 </button>
//             </div>


//             {result && (
//                 <div style={{ marginTop: 18 }}>
//                     <h3>SSIM score: {result.ssim.toFixed(4)}</h3>
//                     <div>
//                         <h4>Diff image</h4>
//                         <img src={result.diff_image} alt="diff" style={{ maxWidth: '100%' }} />
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }