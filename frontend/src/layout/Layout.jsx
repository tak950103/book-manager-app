import {Outlet, NavLink } from "react-router-dom";
import { useState } from "react";
import "./Layout.css";
import logoutIcon from "../assets/logout.png"
import homeIcom from "../assets/home.png"
import pencilIcon from "../assets/pencil.png"
import bookIcon from "../assets/book.png"

export default function Layout({ user, onLogout, children }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="layout">
            <header className="topbar">
                <button className="toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}
                    style={{
                        background: "none",
                        alignSelf: "flex-start",
                        fontSize: "38px",
                        marginLeft: "0.6rem",
                        margin: 0,
                        padding: 0,
                        color: "#996249",
                    }}
                >
                    ☰
                </button>
                <div>いままでに よんだほん ⚪︎⚪︎さつ</div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <div>{user.name} さん</div>
                    <button onClick={onLogout}
                        style={{
                            background: "none",
                            border: "none",
                            marginLeft: "0.3rem",
                            marginTop: "0.1rem",
                            marginBottom: "0.1rem",
                            marginRight: "0.2rem",
                            padding: 0,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "transform 0.2s ease",
                        }}
                    >
                        <img src={logoutIcon} alt="ログアウト"
                            style={{ width: "40px", height: "40px", objectFit: "contain"}} />
                    </button>
                </div>
            </header>

            <div className="body">
                <nav className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
                    <NavLink to="/" className="nav-link">
                        <img src={homeIcom} alt="ホーム" className="nav-icon" />
                        {!isCollapsed && <span>ホーム</span>}
                    </NavLink>
                    <NavLink to="/register" className="nav-link">
                        <img src={pencilIcon} alt="とうろく" className="nav-icon" />
                        {!isCollapsed && <span>とうろく</span>}
                    </NavLink>
                    <NavLink to="/history" className="nav-link">
                        <img src={bookIcon} alt="りれき" className="nav-icon" />
                        {!isCollapsed && <span>りれき</span>}
                    </NavLink>
                </nav>
                <main className="main">
                    <div className="content">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}