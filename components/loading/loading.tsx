'use client';

import React, {lazy} from "react";

const Loadinganim = lazy(() => import("@/components/loading/loadinganim"));

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-slate-900">
            <div className="w-40">
                <Loadinganim/>
            </div>
            <div className="text-xl">
                Loading
            </div>
        </div>
    );
};
