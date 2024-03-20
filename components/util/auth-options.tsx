import bcrypt from "bcrypt";
import {AuthOptions, Session, User} from "next-auth";
import {JWT} from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            id: "user-login",
            name: "Credentials",
            credentials: {
                email: {label: "Email", type: "text"},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials, req) {
                const {email, password} = credentials as {
                    email: string;
                    password: string;
                };
                const user = await prisma.user.findUnique({
                    where: {
                        email: email,
                    },
                    cacheStrategy: {
                        ttl: 360,
                        swr: 120,
                    },
                });

                if (!user || !user.password)
                    throw new Error("Incorrect Email/Password");

                const isValid = await bcrypt.compare(password, user.password);
                if (!isValid) throw new Error("Incorrect Email/Password");
                return {
                    id: String(user.id),
                    email: user.email,
                    name: user.name,
                    role: user.role,
                }
            },
        }),
        CredentialsProvider({
            id: "team-login",
            name: "InviteCode",
            credentials: {
                code: {label: "Code", type: "text"},
            },
            async authorize(credentials, req) {
                const {code} = credentials as {
                    code: string;
                };

                const invite = await prisma.inviteCode.findUnique({
                    where: {
                        code: code,
                    },
                    cacheStrategy: {
                        ttl: 360,
                        swr: 120,
                    },
                });

                if (!invite || !invite.code)
                    throw new Error("Invalid Invite Code");

                const isValid = code === invite.code;
                if (!isValid) throw new Error("Invalid Invite Code");
                return {
                    id: String(invite.id),
                    email: "",
                    name: invite.team,
                    role: "TEAM",
                }
            },
        }),
    ],
    callbacks: {
        async jwt({token, user}: { token: JWT; user: User }) {
            if (user) {
                token.user = user;
            }
            return token;
        },
        async session({session, token}: { session: Session; token: JWT }) {
            if (token.user) {
                session.user = token.user;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
};
