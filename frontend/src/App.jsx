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

    if (!user) return <Login onLogin={setUser} />;

    return (
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout user={user} onLogout={logout} />}>
          <Route index element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="history" element={<History />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
    );
}

export default App;