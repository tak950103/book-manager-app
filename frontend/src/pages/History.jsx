import { useEffect, useState } from "react";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function History() {
  const [books, setBooks] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user-books?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(res => {
      setBooks(res.data.data);
      setLastPage(res.data.last_page);
    })
    .catch(err => {
      console.error("読書履歴取得エラー:", err);
      setMessage("データの取得に失敗しました。再ログインしてください。");
    });
  }, [page]);

  const toggleFavorite = async (id) => {
    const token = localStorage.getItem("token");

    // フロントで即時反映
    setBooks(prev =>
        prev.map(book =>
            book.id === id ? { ...book, is_favorite: !book.is_favorite } : book
        )
      );
      
      // サーバーにも反映
      try {
        await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/api/user-books/${id}/favorite`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (e) {
        console.error("お気に入り切り替え失敗:", e);
        setMessage("お気に入りの変更に失敗しました。");
      }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const days = ["日", "月", "火", "水", "木", "金", "土"];
    return `${d.getMonth() + 1}/${d.getDate()}(${days[d.getDay()]})`;
  };
  
  return (
    <div style={{ padding: "1rem", maxWidth: "800px", margin: "auto", fontSize: "18px"}}>
      <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#fef9e7", borderRadius: "12px", overflow: "hidden" }}>
        <thead>
          <tr style={{ backgroundColor: "#ffd9c2", textAlign: "left" }}>
            <th style={{ padding: "0.8rem" , width: "150px"}}>とうろくび</th>
            <th style={{ padding: "0.8rem" }}>タイトル</th>
            <th style={{ padding: "0.8rem" , width: "130px"}}>かいすう</th>
            <th style={{ padding: "0.8rem" , width: "130px"}}>おきにいり</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id} style={{ borderBottom: "1px solid #CCC" }}>
              <td style={{
                padding: "0.8rem",
                whiteSpace: "nowrap",
              }}>
                <span style={{
                  backgroundColor: "#ffd9c2",
                  color: "#996249",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "0.9rem"
                }}>
                  {formatDate(book.created_at)}
                </span>
              </td>
              <td 
                style={{ padding: "0.8rem", color: "#996249", cursor: "pointer" }}
                onClick={() => setSelectedImage(book.image_url)}
              >
                {book.title}
              </td>
              <td style={{ padding: "0.8rem" }}>{book.read_count}かい</td>
              <td style={{ padding: "0.8rem" }}>
                <button
                  onClick={() => toggleFavorite(book.id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: book.is_favorite ? "#e74c3c" : "#aaa",
                    fontSize: "1.4rem"
                  }}
                >
                  {book.is_favorite ? <FaHeart /> : <FaRegHeart />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "1rem", textAlign: "center"}}>
        <button
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page === 1}
          style={{
            marginRight: "1rem",
            padding: "1rem",
            fontSize: "1rem",
            backgroundColor: "#ffd9c2",
            border: "1px solid #996249",
            borderRadius: "8px",
            cursor: page === 1 ? "default" : "pointer",
          }}
        >
          ← まえ
        </button>
        <span style={{ fontWeight: "bold" }}>{page} / {lastPage}</span>
        <button
          onClick={() => setPage(p => Math.min(p + 1, lastPage))}
          disabled={page === lastPage}
          style={{
            marginLeft: "1rem",
            padding: "1rem",
            fontSize: "1rem",
            backgroundColor: "#ffd9c2",
            border: "1px solid #996249",
            borderRadius: "8px",
            cursor: page === lastPage ? "default" : "pointer",
          }}
        >
          つぎ →
        </button>        
      </div>

      {/* モーダル：画像表示 */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999
          }}
        >
          <img
            src={selectedImage}
            alt= "書影"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "80%",
              maxHeight: "80%",
              borderRadius: "12px",
              boxShadow: "0 0 12px rgba(0,0,0,0.5)",
              backgroundColor: "white"
            }}
          />
        </div>
      )}
    </div>
  );
}