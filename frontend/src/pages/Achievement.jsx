import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Achievement.css";
import { BarChart, Bar , XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Heart from "../assets/heart.png";

export default function Achievement() {
    const [monthlyData, setMonthlyData] = useState([]);
    const [mostReadBook, setMostReadBook] = useState(null);
    const [favoriteCount, setFavoriteCount] = useState(0);

    useEffect(() => {
        fetchMonthlyData();
        fetchMostReadBook();
        fetchFavoriteCount();
    }, []);

    const fetchMonthlyData = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user-books/monthly-read-count`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            // 12ヶ月を現在から遡る
            const now = new Date();
            const fullData = [];
            for (let i = 11; i >= 0; i--) {
                const date = new Date(now);
                date.setMonth(date.getMonth() - i);

                const key = date.toISOString().slice(0, 7);
                fullData.push({
                    month: `${date.getMonth() + 1}月`,
                    count: res.data[key] || 0,
                });
            }
            setMonthlyData(fullData);
        } catch (error) {
            console.error("Error fetching monthly read data:", error);
        }
    };

    const fetchMostReadBook = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user-books/most-read`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setMostReadBook(res.data);
        } catch (error) {
            console.error("Error fetching most read book:", error);
        }
    };

    const fetchFavoriteCount = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user-books/favorite-count`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setFavoriteCount(res.data.count);
        } catch (error) {
            console.error("Error fetching favorite count:", error);
        }
    };

    return (
        <div className="achievement-container">
            <div className="summary-card" style={{ marginBottom: "10px"}}>
                <div className="chart-section">
                    <h3>とうろくした ほんのかず</h3>
                    <div className="chart-section">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5}}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" style={{ fontSize: "1.2rem"}}/>
                                <YAxis allowDecimals={false} style={{ fontSize: "1.2rem"}}/>
                                <Tooltip />
                                <Bar dataKey="count" fill="#996249" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="summary-section">
                <div className="summary-card">
                    <h3>いちばん よんだほん</h3>
                    {mostReadBook ? (
                        <div>
                            <img src={mostReadBook.image_url} alt="書影" className="book-image" />
                            <p>{mostReadBook.title}</p>
                            <p>{mostReadBook.read_count}回</p>
                        </div>
                    ) : (
                        <p>データがありません</p>
                    )}
                </div>

                <div className="summary-card">
                    <h3>おきにいりのほん</h3>
                    <img src={Heart} alt="ハート" className="heart-img" />
                    <p>ぜんぶで</p>
                    <p>{favoriteCount} さつ</p>
                </div>
            </div>
        </div>
    );
}