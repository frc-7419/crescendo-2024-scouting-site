import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    async authorized({ req, token }) {
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