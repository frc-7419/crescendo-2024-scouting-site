import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useTheme } from "next-themes";

export default function Toast() {
    const { theme, setTheme } = useTheme();
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        if (theme === 'dark') {
            setIsDarkMode(true);
        } else {
            setIsDarkMode(false);
        }
    }, [theme]);

    return (
        <div>
            <Toaster
                toastOptions={{
                    className: '',
                    duration: 5000,
                    style: {
                        background: isDarkMode ? '#334155' : '#fff',
                        color: isDarkMode ? '#fff' : '#000',
                    },
                }}
            />
        </div>
    );
}