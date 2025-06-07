import { useState } from "react";
import BarcodeScanner from "../components/BarcodeScanner";
import cameraIcon from "../assets/camera.png";
import fingerIcon from "../assets/finger.png";
import NumberKeyboard from "../components/NumberKeyboard"; 
import axios from "axios";
import useSound from "use-sound";
import stampSfx from "../sounds/pon.mp3";
import "./Register.css";

export default function Register({ onReadCountUpdate }) {
    const [isbn, setIsbn] = useState("");
    const [showScanner, setShowScanner] = useState(false);
    const [title, setTitle] = useState("");
    const [coverUrl, setCoverUrl] = useState("");
    const [timeoutId, setTimeoutId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [showKeyboard, setShowKeyboard] = useState(false);
    const [play] = useSound(stampSfx);

    const handleIsbnChange = (value) => {
        setIsbn(value);
        setTitle("");
        setCoverUrl("");
        setMessage("");

        // 前のタイマーをクリア
        if (timeoutId) clearTimeout(timeoutId);

        // 13桁になったらAPIリクエスト
        if (value.length === 13) {
            setShowKeyboard(false);
            const newTimeout = setTimeout(() => {
                fetchBookInfo(value);
            }, 300);
            setTimeoutId(newTimeout);
        }
    };

    // 書影とタイトルを取得
    const fetchBookInfo = async (isbn13) => {
        setIsLoading(true);
        setMessage("");
        setTitle("");
        setCoverUrl("");

        try {
            const res = await fetch(`https://api.openbd.jp/v1/get?isbn=${isbn13}`);
            const data = await res.json();

            // openBDからデータ取得できた場合
            if (data && data[0]) {
                const summary = data[0].summary;

                // タイトルがあれば設定
                if (summary?.title) {
                    setTitle(summary.title);
                } else {
                    setTitle("タイトルがみつかりません。");
                }

                // 書影があれば設定、なければNDLで再取得
                if (summary?.cover) {
                    setCoverUrl(summary.cover);
                } else {
                    setCoverUrl(`https://ndlsearch.ndl.go.jp/thumbnail/${isbn13}.jpg`);
                }
            } else {
                // openBDでヒットしなかった場合は、タイトルは空で書影はNDLで取得
                setMessage("ほんがみつかりません。");
                setCoverUrl(`https://ndlsearch.ndl.go.jp/thumbnail/${isbn13}.jpg`);
            }
        } catch (error) {
            console.error("検索APIエラー:", error);
            setMessage("エラーがはっせいしました。");
        } finally {
            setIsLoading(false);
        }
    }

    const handleRegister = async () => {
    if (isbn.length !== 13) {
        setMessage("ISBNは13けたでなければなりません。");
        return;
    }
        setIsLoading(true);
        try {
            const response = await axios.post(
                "https://192.168.0.10/api/books",
                {
                    isbn,
                    title,
                    image_url: coverUrl,
                },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            play();
            onReadCountUpdate();

            setIsbn("");
            setTitle("");
            setCoverUrl("");

            setTimeout(() => {
                alert("とうろくしました！");
            }, 100); 
        } catch (error) {
            console.error("登録エラー:", error);
            alert("とうろくできませんでした。");

            // Laravel からのエラー内容を抽出して message に表示
            if (error.response) {
                // バリデーションエラーや認証エラー
                if (error.response.status === 422) {
                    const errors = error.response.data.errors;
                    const messages = Object.values(errors)
                        .flat()
                        .join("\n");
                    setMessage("バリデーションエラー:\n" + messages);
                } else if (error.response.status === 401) {
                    setMessage("ログインしていません。再ログインしてください。");
                } else if (error.response.data?.message) {
                    setMessage("エラー: " + error.response.data.message);
                } else {
                    setMessage("不明なエラーが発生しました。（status " + error.response.status + "）");
                }
            } else if (error.request) {
                // サーバーから応答がない
                setMessage("サーバーから応答がありません。ネットワークを確認してください。");
            } else {
                // axios自体のエラー
                setMessage("エラーが発生しました: " + error.message);
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div style={{maxWidth: "450px"}}>
            {/* ISBN入力欄 */}
            <div style={{ display: "flex", alignItems: "center" }}>
                <input
                    type="text"
                    value={isbn}
                    readOnly
                    onFocus={() => setShowKeyboard(true)}
                    onChange={(e) => handleIsbnChange(e.target.value)}
                    style={{ 
                        flex: 1,
                        marginLeft: "1rem",
                        fontSize: 18,
                        height: 70,
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

            {/* ローディング表示 */}
            {isLoading && (
                <p style={{ marginLeft: "1rem", color: "#555", fontSize: "1.2rem" }}>
                    読み込み中...
                </p>
            )}

            {/* メッセージ表示 */}
            {message && (
                <div style={{
                    position: "fixed",
                    top: "30%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "#fff0f0",
                    border: "2px solid #ff8888",
                    borderRadius: "12px",
                    padding: "1.5rem 2rem",
                    zIndex: 9999,
                    fontSize: "1.2rem",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    textAlign: "center",
                    color: "#c00",
                    whiteSpace: "pre-line",
                    minWidth: "250px"
                }}>
                    {message}
                    <div style={{ marginTop: "1rem" }}>
                        <button
                            onClick={() => setMessage("")}
                            style={{
                                backgroundColor: "#ffaaaa",
                                border: "none",
                                padding: "0.5rem 1.2rem",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontSize: "1rem"
                            }}
                        >
                        とじる
                        </button>
                    </div>
                </div>
            )}
            
            {/* 書影枠 */}
            <div style={{
                border: "2px solid #996249",
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
                        onError={() => {
                            setCoverUrl(""); // エラー時、画像を消す
                            setMessage((prev) => prev + "\nひょうしがみつかりません。");
                        }}
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
            
            <div className="finger-icon-wrapper">
                <button
                    onClick={handleRegister}
                    disabled={isLoading}
                    className={isbn.length === 13 && title !== "" && !isLoading ? "press-pulse" : ""}
                    style={{
                        backgroundColor: isLoading ? "#ccc" : "#996249", 
                        color: "white",
                        padding: "1rem 2rem",
                        fontSize: "1.2rem",
                        border: "none",
                        borderRadius: "12px",
                        marginTop: "1rem",
                        marginLeft: "10rem",
                        cursor: isLoading ? "not-allowed" : "pointer",
                        boxShadow: isLoading ? "none" : "0 6px 0 #7a4e31, 0 2px 12px rgba(0, 0, 0, 0.3)"
                    }}
                >
                    {isLoading ? "とうろくちゅう..." : "とうろく"}
                </button>

                {isbn.length === 13 && title !== "" && !isLoading && (
                    <img
                        src={fingerIcon}
                        alt="おしてね"
                        className="finger-icon"
                    />
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

            {/* 数字キーボード */}
            {showKeyboard && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                        zIndex: 1000,
                    }}
                    onClick={() => setShowKeyboard(false)} // 背景タップで閉じる
                >
                    <div
                        onClick={(e) => e.stopPropagation()} // テンキー自体のクリックは伝播しない
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            backgroundColor: "#fef9e7",
                            borderRadius: "16px",
                            padding: "1rem",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                            maxWidth: "120vw",
                        }}
                    >
                        <NumberKeyboard
                            onInput={(digit) => {
                                const newIsbn = isbn + digit;
                                if (newIsbn.length <= 13) {
                                    handleIsbnChange(newIsbn);
                                }
                            }}
                            onDelete={() =>{
                                const newIsbn = isbn.slice(0, -1);
                                handleIsbnChange(newIsbn);
                            }}
                            onClear={() =>{
                                handleIsbnChange("");
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
    
  }