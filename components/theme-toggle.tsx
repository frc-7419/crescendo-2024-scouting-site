import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from "next-themes";

export default function ThemeToggle() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        if (theme === 'dark') {
            setIsDarkMode(true);
        }
    }, [theme]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        if(isDarkMode){
            setTheme('light');
        }else{
            setTheme('dark');
        }
    };

    return (
        <button onClick={toggleDarkMode}>
            <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} size="xl" fixedWidth/>
        </button>
    );
}