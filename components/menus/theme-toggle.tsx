import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMoon, faSun} from '@fortawesome/free-solid-svg-icons';
import {useTheme} from "next-themes";

export default function ThemeToggle() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const {theme, setTheme} = useTheme();

    useEffect(() => {
        if (theme === 'dark') {
            setIsDarkMode(true);
        }
    }, [theme]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        if (isDarkMode) {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    };

    return (
        <button onClick={toggleDarkMode}>
            <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} size="xl" fixedWidth
                             className='transition ease-in-out hover:-translate-y-1 hover:scale-110 duration-300'/>
        </button>
    );
}