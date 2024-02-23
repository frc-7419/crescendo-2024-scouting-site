'use client';

import { Spinner } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";

const UserValidation = () => {
    const { data: session } = useSession();
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
        <div className="flex items-center justify-center min-h-screen bg-slate-900 gap-4">
            <div className="text-xl ">
                Verifying User
            </div>
            <Spinner color="default" />
        </div>
    );
};

export default UserValidation;