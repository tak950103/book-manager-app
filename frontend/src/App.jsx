import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Layout from "./layout/Layout";
import axios from "axios";

import Home from "./pages/Home";
import Register from "./pages/Register";
import History from "./pages/History";

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [totalRead, setTotalRead] = useState(0);

    // ログイン状態チェック
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
          setLoading(false);
          return;
      }

      axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/me`, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      })
      .then((res) => {
          setUser(res.data);
          setLoading(false);
      })
      .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
          setLoading(false);
      });
    }, []);

    const logout = async () => {
      try {
          await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/logout`, {}, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
          });
      } catch (e) {
          console.error("ログアウト失敗:", e);
      }

      setUser(null);
    };

    const fetchReadCount = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user-books/total-read-count`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTotalRead(res.data.total);
      } catch (e) {
        console.error("読書冊数取得エラー:", e);
      }
    };

    useEffect(() => {
      if (user) fetchReadCount();
    }, [user]);

    if (loading) return <div>よみこみちゅう・・・</div>;

    return (
      <BrowserRouter>
        <Routes>
          {!user && (
            <Route path="*" element={<Login onLogin={setUser} />} />
          )}

          {user && (
            <Route path="/" element={
              <Layout 
                user={user} 
                onLogout={logout}
                totalRead={totalRead}
                onReadCountUpdate={fetchReadCount} 
              />
            }>
              <Route index element={<Home totalRead={totalRead} user={user}/>} />
              <Route path="register" element={<Register onReadCountUpdate={fetchReadCount}/>} />
              <Route path="history" element={<History />} />
            </Route>
          )}
          <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
        </Routes>
      </BrowserRouter>
    );
}

export default App;