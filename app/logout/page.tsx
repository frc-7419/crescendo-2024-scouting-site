'use client';

import {signOut, useSession} from "next-auth/react";
import React, {useEffect} from "react";
import Loadinganim from "@/components/loading/loadinganim";

const UserValidation = () => {
    const {data: session} = useSession({
        required: true
    });

    useEffect(() => {
        signOut()
    }, [session]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 gap-4">
            <div className="w-40">
                <Loadinganim/>
            </div>
            <div className="text-xl ">
                Logging Out
            </div>
        </div>
    );
};

export default UserValidation;