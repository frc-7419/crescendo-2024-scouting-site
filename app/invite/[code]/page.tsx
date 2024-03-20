// DOES NOT WORK

import React from 'react';
import Loading from "@/components/loading/loading";
import {useRouter} from "next/navigation";

import type {Metadata, ResolvingMetadata} from 'next'

type Props = {
    params: { code: string }
}

export async function generateMetadata(
    {params}: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const code = params.code

    return {
        title: "7419 Scouting App",
        openGraph: {
            title: 'Team 7419 has invited you to view their scouting data.',
            description: `${code} is your invite code. Click to join view our data.`,
        },
    }
}

const Invite = ({params}: { params: { code: string } }) => {
    const router = useRouter();
    const code = params.code;

    if (code) {
        router.push(`/login?invite=${code}`);
    }

    return (
        <Loading/>
    );
}

export default Invite;