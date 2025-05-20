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

    // ログイン状態チェック
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
            withCredentials: true
        })
            .then((res) => setUser(res.data))
            .catch(() => {
                localStorage.removeItem("token");
                setUser(null);
            });
    }, []);

    const logout = () => {
      localStorage.removeItem("token");
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