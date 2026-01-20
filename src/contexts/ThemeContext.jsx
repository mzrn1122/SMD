import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({});

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    // Force light mode
    useEffect(() => {
        document.documentElement.classList.remove('dark');
        localStorage.removeItem('smd-theme');
    }, []);

    const toggleTheme = () => { }; // No-op

    return (
        <ThemeContext.Provider value={{ theme: 'light', toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
