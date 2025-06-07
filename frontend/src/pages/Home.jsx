import bunnyIcon from "../assets/stamp-bunny.png";
import butterflyIcon from "../assets/stamp-butterfly.png";
import catIcon from "../assets/stamp-cat.png";
import dolphinIcon from "../assets/stamp-dolphin.png";
import flowerIcon from "../assets/stamp-flower.png";
import earthIcon from "../assets/stamp-earth.png";
import "./Home.css";
import { useEffect, useState } from "react";

export default function Home( { totalRead, user }) {
    const [shakeIndices, setShakeIndices] = useState([]);
    const [initialAnimatedIndices, setInitialAnimatedIndices] = useState([]);
    const [popped, setPopped] = useState(false);

    useEffect(() => {
      if (totalRead > 0){
        setInitialAnimatedIndices(Array.from({ length: totalRead }, (_, i) => i));
      }
    },[totalRead]);

    useEffect(() => {
      if (initialAnimatedIndices.length > 0 && !popped) {
        setTimeout(() => {
          setInitialAnimatedIndices([]);
          setPopped(true);
        }, 3000);
      }
    }, [initialAnimatedIndices, popped]);

    useEffect(() => {
      if (!popped) return;
      const shakeTimer = setInterval(() => {
        const count = Math.floor(Math.random() * 3) + 1;
        const candidates = Array.from({ length: totalRead }, (_, i) => i);
        const shuffled = candidates.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, count);

        selected.forEach((index, i) => {
          const delay = i * 200;

          setTimeout(() => {
            setShakeIndices(prev => [...prev, index]);

            setTimeout(() => {
              setShakeIndices(prev => prev.filter(i => i !== index));
            }, 800);
          }, delay);
        });
      }, 1000 + Math.random() * 1000); // 1~2秒おきにshake

      return () => clearInterval(shakeTimer);
    }, [totalRead, popped]);

    // 0冊の場合、スタンプラリー非表示
    if (totalRead === 0) {
      return (
        <div style={{ height: "80vh", display: "flex", justifyContent: "center", alignItems: "center"}}>
          <h2 style={{ fontSize: "2rem", color: "#996249" }}>ようこそ、 {user.name}さん</h2>
        </div>
      );
    }

    const currentPage = Math.floor((totalRead - 1) / 30);
    const start = currentPage * 30 + 1;

    const stampImages = [
      bunnyIcon,
      butterflyIcon,
      catIcon,
      dolphinIcon,
      flowerIcon,
      earthIcon,
    ];

    return (
      <div style={{ padding: "1rem", maxWidth: "900px", margin: "auto" }}>
        <div className="stamp-frame"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "1rem",
            backgroundColor: "#fffbea",
            padding: "0.4rem 1rem",
            borderRadius: "12px",
          }}
        >
          {Array.from({ length: 30 }, (_, i) => {
            const number = start + i;
            const isStamped = number <= totalRead;
            const shouldShake = shakeIndices.includes(i);

            const row = Math.floor(i/5);
            const icon = stampImages[row % stampImages.length];

            return (
              <div
                key={number}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 0 4px rgba(0,0,0,0.4)",
                  padding: "0.2rem",
                  aspectRatio: "1/1",
                }}
              >
                <div
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                    marginBottom: "0.3rem",
                    color: "#996249",
                  }}
                >
                  {number}
                </div>
                {isStamped ? (
                  <img
                    src={icon}
                    alt="スタンプ"
                    className={`stamp-img ${initialAnimatedIndices.includes(i) ? "pop" : "" } ${shouldShake ? "shake" : ""}`}
                    style={
                      initialAnimatedIndices.includes(i)
                        ? { animationDelay: `${i * 0.1}s` }
                        : {}
                    }
                  />
                ): (
                  <div
                    style={{
                      width: "60%",
                      height: "60%",
                      border: "2px dashed #ccc",
                      borderRadius: "12px",
                    }}
                  />
                )}
                </div>
            );
          })}
        </div>
      </div>
    );
  }

  