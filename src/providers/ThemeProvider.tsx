"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>("dark");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Check localStorage first
        const stored = localStorage.getItem("dashboard-theme") as Theme;
        if (stored) {
            setTheme(stored);
        } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
            setTheme("light");
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            localStorage.setItem("dashboard-theme", theme);
            // Update document class for global styling if needed
            document.documentElement.setAttribute("data-theme", theme);
        }
    }, [theme, mounted]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    // Prevent flash of wrong theme
    if (!mounted) {
        return null;
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}

// Theme-aware style utilities
export const themeStyles = {
    dark: {
        bg: "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950",
        card: "border-white/10 bg-white/5 backdrop-blur-sm",
        cardHover: "hover:bg-white/10",
        header: "border-white/10 bg-slate-900/80 backdrop-blur-xl",
        text: "text-white",
        textMuted: "text-slate-400",
        textSubtle: "text-slate-500",
        input: "bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:bg-white/10",
        button: "border-white/10 bg-white/5 text-white hover:bg-white/10",
        tableHeader: "border-white/10 hover:bg-white/5",
        tableRow: "border-white/5 hover:bg-white/5",
        badge: "bg-slate-500/20 text-slate-400",
    },
    light: {
        bg: "bg-gradient-to-br from-slate-50 via-white to-slate-100",
        card: "border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm",
        cardHover: "hover:bg-white hover:shadow-md",
        header: "border-slate-200 bg-white/90 backdrop-blur-xl shadow-sm",
        text: "text-slate-900",
        textMuted: "text-slate-600",
        textSubtle: "text-slate-500",
        input: "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500",
        button: "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
        tableHeader: "border-slate-200 bg-slate-50 hover:bg-slate-50",
        tableRow: "border-slate-100 hover:bg-slate-50",
        badge: "bg-slate-100 text-slate-600",
    },
};

export function getThemeStyles(theme: Theme) {
    return themeStyles[theme];
}
