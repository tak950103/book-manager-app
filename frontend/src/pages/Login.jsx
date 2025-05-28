import { useState } from "react";
import axios from "axios";

export default function Login({onLogin}) {
    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

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
      } catch (err) {
          setError("ログインに失敗しました");
      }
    };

    return (
        <div>
      <h2>ログイン</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="ログインID"
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">ログイン</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
    );
}