'use client'

import React, { useEffect, useState } from 'react';
import jamesPfp from '@/resources/james.webp';
import ThemeToggle from './theme-toggle';
import { signOut, useSession } from 'next-auth/react';
import { Popover, Button, PopoverTrigger, PopoverContent, Listbox, ListboxItem, Avatar } from '@nextui-org/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faDoorOpen, faList } from '@fortawesome/free-solid-svg-icons';
import Dropdown from './dropdownMenu';

export default function NavBar() {
    const { data: session, status } = useSession();
    const [currentTime, setCurrentTime] = useState('');

    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    }, []);

    useEffect(() => {
        if (windowWidth > 1000) {
            const interval = setInterval(() => {
                const date = new Date();
                const time = date.toLocaleTimeString();
                setCurrentTime(time);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, []);

    const PopButton = ({ icon, text }: { icon: JSX.Element, text: string }) => {
        return (
            <div className='flex justify-between items-center'>
                <div className="flex-1 text-right text-l">
                    {text}
                </div>
                <div className="text-l w-[30px]">
                    {icon}
                </div>
            </div>
        )
    }

    return (
        <nav id="nav" className={'flex justify-between items-center gap-4 p-6'}>
            {windowWidth > 1000 ? (<>
                <span id="time" className='text-2xl text-left flex-grow'>{currentTime}</span>
                <ThemeToggle />
                <Popover showArrow placement="bottom-end">
                    <PopoverTrigger>
                        <button className="text-xl text-right flex items-center gap-4 justify-between">
                            <span id='user' className='text-xl text-right'>{session?.user?.name}</span>
                            <Avatar src={jamesPfp.src} alt="User Profile" className="w-10 h-10 rounded-full" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[10rem] text-right text-xl">
                        <Listbox
                            aria-label="Actions"
                        >
                            <ListboxItem key="settings">
                                <PopButton
                                    icon={<FontAwesomeIcon icon={faCog} />}
                                    text="Settings"
                                />
                            </ListboxItem>
                            <ListboxItem key="logout" className="text-danger" color="danger" onClick={() => signOut()}>
                                <PopButton
                                    icon={<FontAwesomeIcon icon={faDoorOpen} />}
                                    text="Logout"
                                />
                            </ListboxItem>
                        </Listbox>
                    </PopoverContent>
                </Popover>
            </>) : (
                <Dropdown />
            )}
        </nav>
    )
}