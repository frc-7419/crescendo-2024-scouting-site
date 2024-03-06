export default function enforceAdmin(session: any, router: any) {
    if (session?.user?.role) {
        if (!(session?.user?.role === "ADMIN" || session?.user?.role === "SITEADMIN")) {
            router.push("/dashboard/user")
        }
    }
}