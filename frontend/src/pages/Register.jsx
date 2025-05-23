import { useState } from "react";
import BarcodeScanner from "../components/BarcodeScanner";
import cameraIcon from "../assets/camera.png"

export default function Register() {
    const [isbn, setIsbn] = useState("");
    const [showScanner, setShowScanner] = useState(false);
    const [title, setTitle] = useState("");
    const [coverUrl, setCoverUrl] = useState("");
    const [timeoutId, setTimeoutId] = useState(null);

    const handleIsbnChange = (value) => {
        setIsbn(value);
        setTitle("");
        setCoverUrl("");

        // 前のタイマーをクリア
        if (timeoutId) clearTimeout(timeoutId);

        // 13桁になったらAPIリクエスト
        if (value.length === 13) {
            const newTimeout = setTimeout(() => {
                fetchBookInfo(value);
            }, 300);
            setTimeoutId(newTimeout);
        }
    };

    // 書影とタイトルを取得
    const fetchBookInfo = async (isbn13) => {
        // 書影のURL表示
        setCoverUrl (`https://ndlsearch.ndl.go.jp/thumbnail/${isbn13}.jpg`);
        
        try {
            const res = await fetch(`https://ndlsearch.ndl.go.jp/api/opensearch?isbn=${isbn13}`);
            const xmlText = await res.text();

            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, "application/xml");

            const dcTitle = xmlDoc.querySelector("item > dc\\:title, item > title");

            if (dcTitle) {
                setTitle(dcTitle.textContent);
            } else {
                setTitle("");
            }
        } catch (error) {
            console.error("検索APIエラー:", error);
            setTitle("");
        }
    }

    return (
        <div style={{maxWidth: "450px"}}>
            <h2 style={{ fontSize: "var(--font-size-md)", marginBottom: "0.7rem"}}>ほんのとうろく</h2>
            
            {/* ISBN入力欄 */}
            <div style={{ display: "flex", alignItems: "center" }}>
                <input
                    type="text"
                    value={isbn}
                    onChange={(e) => handleIsbnChange(e.target.value)}
                    style={{ 
                        flex: 1,
                        marginLeft: "1rem",
                    }}
                    placeholder="ISBNをにゅうりょく"
                />
                <button onClick={() => setShowScanner(true)}
                    style={{
                        background: "none",
                        border: "none",
                        marginLeft: "0.3rem",
                        padding: 0,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: "-12px"
                    }}
                >
                    <img src={cameraIcon} alt="カメラ" 
                    style={{ width: "60px", height: "60px", objectFit: "contain"}} />
                </button>
            </div>

            {/* タイトル入力欄 */}
            <div style={{ display: "flex", alignItems: "center" }}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ 
                        flex: 1,
                        marginLeft: "1rem",
                        fontSize: 18,
                        height: 70,
                    }}
                    placeholder="タイトルをにゅうりょく"
                />
            </div>

            {/* 書影枠 */}
            <div style={{
                border: "2px solid #ffd966",
                borderRadius: "16px",
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                maxWidth: "450px",
                maxHeight: "400px",
                backgroundColor: "#fff",
                marginLeft: "1rem"
            }}>
                {coverUrl ? (
                    <img
                        src={coverUrl}
                        alt="書影"
                        style={{
                            width: "auto",
                            maxHeight: "340px",
                            objectFit: "contain",
                            borderRadius: "4px"
                        }}
                    />
                ) : (
                    <div style={{
                        fontSize: "1.2rem",
                        color: "#888"
                    }}>
                        ひょうし
                    </div>
                )}
            </div>

            {/* スキャナー */}
            {showScanner && (
                <BarcodeScanner
                    onDetected={(code) => {
                        setIsbn(code);
                        handleIsbnChange(code);
                    }}
                    onClose={() => setShowScanner(false)}
                />
            )}
        </div>
    );
    
  }