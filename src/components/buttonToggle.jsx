"use client";

import React, { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const ButtonToggle = () => {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const saved = localStorage.getItem('theme');
        const current = saved || 'light';
        setTheme(current);
        document.documentElement.classList.toggle('dark', current === 'dark');
    }, []);

    const handleClick = () => {
        const next = theme === "light" ? "dark" : "light";
        setTheme(next);
        document.documentElement.classList.toggle('dark', next === 'dark');
        localStorage.setItem('theme', next);
    };

    const nextTheme = theme === "light" ? "dark" : "light";

    return (
        <button
            id="toggle-theme"
            onClick={handleClick}
            aria-label={`Cambiar a modo ${nextTheme}`}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: 'none',
                background: '#B93A05',
                color: '#fff',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: 9999,
                boxShadow: '0 4px 16px rgba(185, 58, 5, 0.3)',
                transition: 'transform 0.15s ease, background-color 0.3s ease'
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.92)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
            {theme === "light" ? <FaMoon size={22} /> : <FaSun size={22} />}
        </button>
    );
}

export default ButtonToggle;