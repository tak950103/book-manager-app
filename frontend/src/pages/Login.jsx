import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { FaUser, FaLock } from 'react-icons/fa';
import title from "../assets/title.png";


export default function Login({onLogin}) {
    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
          const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/login`, {
              login_id: loginId,
              password: password,
          });

          const token = response.data.access_token;
          localStorage.setItem("token", token);
          onLogin(response.data.user);

          navigate("/");
      } catch (err) {
          setError("ログインに失敗しました");
      }
    };

    return (
      <div className="login-container">
        <div><img src={title} style={{ height : "150px", alignItems: "center", marginTop: "10px"}}/></div>
        <div className="login-box">
          <h2>ログイン</h2>
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column"}}>
            <label style={styles.label}><FaUser className="icon"/> ログインID</label>
            <input
              type="text"
              placeholder="ログインID"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              required
            />
            <label style={styles.label}><FaLock className="icon"/> パスワード</label>
            <input
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">ログイン</button>
          </form>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </div>
    );
}

const styles = {
  label: {
    marginBottom: '6px',
    fontWeight: 'bold',
    color: '#676767',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
};