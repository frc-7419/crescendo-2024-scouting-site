"use client";

import React, {useEffect} from 'react';
import {useRouter} from "next/navigation";
import Loading from "@/components/loading/loading";

const RedirectAgent = ({code}: { code: string }) => {
    const router = useRouter();

    useEffect(() => {
        if (code) {
            router.push(`/login?invite=${code}`);
        }
    }, [code, router]);

    return <Loading/>;
};

export default RedirectAgent;
