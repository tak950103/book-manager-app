import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useRef } from "react";

export default function BarcodeScanner({ onDetected, onClose }) {
    const scannerRef = useRef(null); // scannerの再生成防止
    const readerRef = useRef(null);

    useEffect(() => {
        const startScanner = () => {
            if (!readerRef.current) {
                console.error("reader element not found");
                return;
            }

            readerRef.current.innerHTML = "";

            if (scannerRef.current) {
                scannerRef.current.clear().then (() => {
                    scannerRef.current = null;
                    initializeScanner();
                }).catch(err => {
                    console.error("Error clearing scanner before init:", err);
                    initializeScanner();
                });
            } else {
                initializeScanner();
            }
        };
        
        const initializeScanner = () => {
            scannerRef.current = new Html5QrcodeScanner("reader", {
                fps: 30,
                qrbox: 300
            }, {
                strings: {
                    scanButtonStartScanningText: "スキャンを開始",
                    scanButtonStopScanningText: "スキャンを停止",
                    scanningStatusScanning: "スキャン中...",
                    scanningStatusIdle: "カメラ待機中...",
                    cameraPermissionRequestMessage: "カメラの使用を許可してください。",
                    cameraPermissionDenied: "カメラの使用が許可されませんでした。",
                }
            });

            scannerRef.current.render(
                (decodedText) => {
                    onDetected(decodedText);
                    scannerRef.current.clear().then(() => {
                        scannerRef.current = null;
                        readerRef.current.innerHTML = "";
                        onClose();
                    });
                },
                (error) => {
                    console.warn("読み取り失敗:", error);
                }
            );
        };

        const timeout = setTimeout(startScanner, 100);

        return () => {
            clearTimeout(timeout);
            if (scannerRef.current) {
                scannerRef.current.clear().then(() => {
                    scannerRef.current = null;
                    if (readerRef.current) readerRef.current.innerHTML = "";
                }).catch(err => {
                    console.error("scanner clear error:", err);
                });
            }
        };
    }, []);

    return (
        <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)", display: "flex",
            alignItems: "center", justifyContent: "center", zIndex: 9999
        }}>
            <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "8px", textAlign: "center" }}>
                <div id="reader" ref={readerRef} style={{ width: "300px", height: "300px" }} />
                <button 
                    onClick={() => {
                        if (scannerRef.current) {
                            scannerRef.current.clear().then(() => {
                                scannerRef.current = null;
                                readerRef.current.innerHTML = "";
                                onClose();
                            }).catch((err) => {
                                console.error("cancel clear error:", err);
                                onClose();
                            });
                        } else {
                            onClose();
                        }
                    }} 
                    style={{ marginTop: "10px", width: "100%" }}>
                        キャンセル</button>
            </div>
        </div>
    );
}