import {withAuth} from "next-auth/middleware";

export default withAuth({
    callbacks: {
        async authorized({req, token}) {
            if (token?.user == null) return false;
            if (req.nextUrl.pathname === "/admin") {
                return (
                    (<any>token.user).role === "ADMIN" ||
                    (<any>token.user).role == "SITEADMIN"
                );
            }
            if (req.nextUrl.pathname === "/siteadmin") {
                return (<any>token.user).role === "SITEADMIN";
            }
            return !!token;
        },
    },
    pages: {
        signIn: "/login",

    },
});

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        {
            source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
            missing: [
                {type: 'header', key: 'next-router-prefetch'},
                {type: 'header', key: 'purpose', value: 'prefetch'},
            ],
        },
    ],
}