import {Outlet, Link } from "react-router-dom";
import "./Layout.css";

export default function Layout({ user, onLogout }) {
    return (
        <div className="layout">
            <nav className="sidebar">
                <p></p>
                <Link to="/">ホーム</Link>
                <Link to="/register">とうろく</Link>
                <Link to="/history">りれき</Link>
            </nav>
            <main className="main">
                <header className="topbar">
                    <div>いままでに よんだほん ⚪︎⚪︎さつ</div>
                    <div>{user.name} さん</div>
                    <button onClick={onLogout}>ログアウト</button>
                </header>
                <div className="content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}