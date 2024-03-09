'use client';

import {useSession} from "next-auth/react";
import {useRouter} from 'next/navigation';
import React, {useEffect} from "react";
import Loadinganim from "@/components/loading/loadinganim";

const UserValidation = () => {
    const {data: session} = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session?.user?.role) {
            console.debug(session?.user?.role);

            if (session?.user?.role === "ADMIN" || session?.user?.role === "SITEADMIN") {
                router.push("/dashboard/admin");
            } else {
                router.push("/dashboard/user");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 gap-4">
            <div className="w-40">
                <Loadinganim/>
            </div>
            <div className="text-xl ">
                Verifying User
            </div>
        </div>
    );
};

export default UserValidation;