'use client'

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import { faCalendarDays, faGauge, faHandPaper, faPoll } from '@fortawesome/free-solid-svg-icons';

export default function SideBar() {
    const pathname = usePathname();
    const MenuItem = ({ icon, name, route }: { icon: React.JSX.Element, name: string, route: string }) => {
        // Highlight menu item based on currently displayed route
        const colorClass = pathname === route ? "text-white" : "text-white/50 hover:text-white";

        return (
            <Link
                href={route}
                className={`flex items-center gap-4 my-auto text-md py-5 ${colorClass}`}
                >
                    <div className="text-3xl w-[30px]">
                        {icon}
                    </div>
                    <div className="text-left text-2xl">
                        {name}
                    </div>
            </Link>
        )
    }
    
    return (
        <div id='sidebar' className='flex flex-col bg-slate-900 p-6'>
            <p className='text-2xl text-left'>7419</p>
            <div className="flex flex-col mt-8">
                    <MenuItem
                        name="Dashboard"
                        route="/dashboard"
                        icon={<FontAwesomeIcon icon={faGauge} />}
                    />
                    <MenuItem
                        name="Schedule"
                        route="/schedule"
                        icon={<FontAwesomeIcon icon={faCalendarDays} />}
                    />
                    <MenuItem
                        name="Scouting"
                        route="/scout"
                        icon={<FontAwesomeIcon icon={faPoll} />}
                    />
                </div>
        </div>
    )
}