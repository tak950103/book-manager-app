import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

export default function BarcodeScanner({ onDetected, onClose }) {
    useEffect(() => {
        const scanner = new Html5QrcodeScanner("reader", {
            fps: 10,
            qrbox: 250
        });

        scanner.render(
            (decodedText) => {
                onDetected(decodedText);
                scanner.clear(); // 読み取り後に停止
                onClose();
            },
            (error) => {

            }
        );

        return () => scanner.clear();
    }, []);

    return (
        <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)", display: "flex",
            alignItems: "center", justifyContent: "center", zIndex: 9999
        }}>
            <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "8px" }}>
                <div id="reader" style={{ width: "300px", height: "300px" }} />
                <button onClick={onClose} style={{ marginTop: "10px" }}>キャンセル</button>
            </div>
        </div>
    );
}