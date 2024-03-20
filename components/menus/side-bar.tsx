'use client'

import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import {usePathname} from 'next/navigation'
import {
    faArrowLeft,
    faArrowTrendUp,
    faCalendarDays,
    faChessBoard,
    faDatabase,
    faGauge,
    faHandPaper,
    faMapPin,
    faPeopleGroup,
    faPerson,
    faPoll
} from '@fortawesome/free-solid-svg-icons';
import {useSession} from 'next-auth/react';

function SideBar() {
    const pathname = usePathname();
    const {data: session} = useSession();

    const MenuItem = React.memo(function MenuItem({icon, name, route}: {
        icon: React.JSX.Element,
        name: string,
        route: string
    }) {
        // Highlight menu item based on currently displayed route
        const colorClass = pathname.startsWith(route) ? "dark:text-white" : "dark:text-white/50 text-black/50 hover:text-gray-800 dark:hover:text-white";

        return (
            <Link
                href={route}
                className={`transition-colors flex items-center gap-4 my-auto text-md py-5 ${colorClass} animate-fade-down animate-once`}
            >
                <div className="text-3xl w-[30px]">
                    {icon}
                </div>
                <div className="text-left text-2xl">
                    {name}
                </div>
            </Link>
        );
    });
    MenuItem.displayName = 'MenuItem';

    if (pathname.startsWith('/data')) {
        return (
            <div id='sidebar' className='flex flex-col dark:bg-slate-900 bg-slate-100 p-6'>
                <p className='text-2xl text-left'>7419</p>
                <div className="flex flex-col mt-8">
                    <Link href={"/dashboard"} className={'text-sm'}>
                        <FontAwesomeIcon icon={faArrowLeft}/>
                    </Link>
                    <MenuItem
                        name="Basic Data"
                        route="/data/basic"
                        icon={<FontAwesomeIcon icon={faDatabase}/>}
                    />
                    <MenuItem
                        name="Leaderboard"
                        route="/data/leaderboard"
                        icon={<FontAwesomeIcon icon={faArrowTrendUp}/>}
                    />
                    <MenuItem
                        name="Distribution"
                        route="/data/distribution"
                        icon={<FontAwesomeIcon icon={faPeopleGroup}/>}
                    />
                    <MenuItem
                        name="Match"
                        route="/data/match"
                        icon={<FontAwesomeIcon icon={faChessBoard}/>}
                    />
                    {(session?.user?.role !== "TEAM") ? (
                        <MenuItem
                        name="Picklist"
                        route="/data/picklist"
                        icon={<FontAwesomeIcon icon={faMapPin}/>}
                    />
                    ) : null}
                </div>
            </div>
        )
    }

    return (
        <div id='sidebar' className='flex flex-col dark:bg-slate-900 bg-slate-100 p-6'>
            <p className='text-2xl text-left'>7419</p>
            <div className="flex flex-col mt-8">
                <MenuItem
                    name="Dashboard"
                    route="/dashboard"
                    icon={<FontAwesomeIcon icon={faGauge}/>}
                />
                <MenuItem
                    name="Schedule"
                    route="/schedule"
                    icon={<FontAwesomeIcon icon={faCalendarDays}/>}
                />
                <MenuItem
                    name="Scouting"
                    route="/scouting"
                    icon={<FontAwesomeIcon icon={faPoll}/>}
                />
                {(session?.user?.role === "ADMIN" || session?.user?.role === "SITEADMIN") ? (
                    <>
                        <MenuItem
                            name="Scouters"
                            route="/scouters"
                            icon={<FontAwesomeIcon icon={faPerson}/>}
                        />
                        <MenuItem
                            name="Data"
                            route="/data"
                            icon={<FontAwesomeIcon icon={faDatabase}/>}
                        />
                    </>
                ) : null}
                <MenuItem
                    name="Blue Alliance"
                    route="/BlueAlliance"
                    icon={<FontAwesomeIcon icon={faHandPaper}/>}
                />
            </div>
        </div>
    );
}

export default React.memo(SideBar);