"use client";

import { useEffect, useState } from "react";

export default function DarkMode() {
    const [isDark, setIsDark] = useState(false);
    
    useEffect(() => {
        const isDarkTheme =
            localStorage.theme === "dark" ||
            (!("theme" in localStorage) &&
                window.matchMedia("(prefers-color-scheme: dark)").matches);

        setIsDark(isDarkTheme);
        document.documentElement.classList.toggle("dark", isDarkTheme);
    }, []);

    const toggleTheme = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);
        document.documentElement.classList.toggle("dark", newIsDark);
        localStorage.theme = newIsDark ? "dark" : "light";
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-xl dark:bg-gray-800 bg-amber-200 fixed bottom-[10%] right-3 border text-sm transition-all hover:bg-gray-200 dark:hover:bg-gray-700"
        >
            {isDark ? "🌙" : "☀️"}
        </button>
    );
}
