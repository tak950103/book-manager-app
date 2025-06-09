import {Outlet, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Layout.css";
import axios from "axios";
import title from "../assets/title.png";
import logoutIcon from "../assets/logout.png";
import homeIcom from "../assets/home.png";
import pencilIcon from "../assets/pencil.png";
import bookIcon from "../assets/book.png";
import achieveIcon from "../assets/achievement.png";
import iconStar from "../assets/background/icon_star.png";
import iconBook from "../assets/background/icon_book.png";
import iconBalloon from "../assets/background/icon_balloon.png";
import iconCircle from "../assets/background/icon_circle.png";
import iconCircle2 from "../assets/background/icon_circle2.png";
import iconStar2 from "../assets/background/icon_star2.png";

export default function Layout({ user, onLogout, children, totalRead, onReadCountUpdate }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="layout">
            <header className="topbar">
                {/* 背景アイコンレイヤー */}
                <div className="background-icons">
                    <img src={iconStar} className="bg-icon" style={{ top: "10%", left: "5%" }} />
                    <img src={iconStar} className="bg-icon" style={{ top: "0%", left: "60%" }} />
                    <img src={iconBook} className="bg-icon" style={{ top: "30%", left: "23%" }} />
                    <img src={iconBook} className="bg-icon" style={{ top: "0%", left: "75%" }} />
                    <img src={iconBalloon} className="bg-icon" style={{ top: "35%", left: "70%" }} />
                    <img src={iconBalloon} className="bg-icon" style={{ top: "15%", left: "15%" }} />
                    <img src={iconBalloon} className="bg-icon" style={{ top: "0%", left: "54%" }} />
                    <img src={iconCircle} className="bg-icon" style={{ top: "50%", left: "85%" }} />
                    <img src={iconCircle} className="bg-icon" style={{ top: "-5%", left: "32%" }} />
                    <img src={iconCircle} className="bg-icon" style={{ top: "30%", left: "50%" }} />
                    <img src={iconCircle2} className="bg-icon" style={{ top: "30%", left: "8%" }} />
                    <img src={iconCircle2} className="bg-icon" style={{ top: "10%", left: "34%" }} />
                    <img src={iconCircle2} className="bg-icon" style={{ top: "0%", left: "80%" }} />
                    <img src={iconCircle2} className="bg-icon" style={{ top: "30%", left: "65%" }} />
                    <img src={iconStar2} className="bg-icon" style={{ top: "10%", left: "43%" }} />
                    <img src={iconStar2} className="bg-icon" style={{ top: "-10%", left: "90%" }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem"}}>
                    <button className="toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}
                        style={{
                            background: "none",
                            alignItems: "center",
                            fontSize: "38px",
                            marginLeft: "0.6rem",
                            margin: 0,
                            padding: 0,
                            color: "#996249",
                        }}
                    >
                        ☰
                    </button>
                    <div><img src={title} style={{ height : "85px", alignItems: "center", marginTop: "10px"}}/></div>
                    <div>いままでに よんだほん <strong>{totalRead}</strong>さつ</div>
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginLeft: "auto" }}>
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
                    <NavLink to="/achievement" className="nav-link">
                        <img src={achieveIcon} alt="たっせい" className="nav-icon" />
                        {!isCollapsed && <span>たっせい</span>}
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