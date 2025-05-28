import React from "react";

export default function NumberKeyboard ({ onInput, onDelete, onClear}) {
    const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0.5rem",
            padding: "1rem",
            borderRadius: "12px",
        }}>
            {keys.map((key) => (
                <button
                    key={key}
                    onClick={() => onInput(key)}
                    style={{
                        fontSize: "2rem",
                        padding: "1.2rem",
                        paddingLeft: "2rem",
                        paddingRight: "2rem",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        backgroundColor: "#fce9a6",
                        color: "#996249",
                        cursor: "pointer"
                    }}
                >
                    {key}
                </button>
            ))}

            {/* 空のスペース */}
            <div></div>

            {/* 0 */}
            <button
                onClick={() => onInput("0")}
                style={{
                    fontSize: "2rem",
                    padding: "1rem",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    backgroundColor: "#fce9a6",
                    color: "#996249",
                    cursor: "pointer",
                }}
            >
                0
            </button>

            <button
                onClick={onDelete}
                style={{
                    gridColumn: "span 1",
                    fontSize: "2rem",
                    padding: "1rem",
                    borderRadius: "8px",
                    backgroundColor: "#ffd7d7",
                    cursor: "pointer"
                }}
            >
                ⌫
            </button>

            <div></div>
            <button
                onClick={onClear}
                style={{
                    gridColumn: "span 2",
                    fontSize: "2rem",
                    padding: "1rem",
                    borderRadius: "8px",
                    backgroundColor: "#ffd7d7",
                    cursor: "pointer"
                }}
            >
                AC
            </button>
        </div>
    );
}