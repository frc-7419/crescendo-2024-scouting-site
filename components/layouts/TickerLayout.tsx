import React from "react";
import SideBar from "@/components/menus/side-bar";
import NavBar from "@/components/menus/nav-bar";
import Tickertape from "@/components/tickertape/tickertape";

export default function TickerLayout({
                                         children,
                                     }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Tickertape/>
            <main className="min-h-screen overflow-clip dark:bg-slate-950">
                <SideBar/>
                <NavBar/>
                <div id='dash' className="overflow-scroll pt-6 pr-6 pl-6 flex flex-col">
                    {children}
                </div>
            </main>
        </>
    );
}
