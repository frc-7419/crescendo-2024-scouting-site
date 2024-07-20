import React from 'react';
import RedirectAgent from "@/components/util/redirectAgent";

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

const InvitePage = ({params}: { params: { code: string } }) => {
    const code = params.code;

    return <RedirectAgent code={code}/>;
};

export default InvitePage;