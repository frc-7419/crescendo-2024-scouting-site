// app/api/auth/[...nextauth]/route.ts

import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import NextAuth, { AuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";

const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                const { email, password } = credentials as {
                    email: string;
                    password: string;
                };
                const user = await prisma.user.findUnique({
                    where: {
                        email: email,
                    },
                });

                if (user == null || user.password == null)
                    throw new Error("Incorrect Email/Password");

                const isValid = await bcrypt.compare(password, user.password);
                if (!isValid) throw new Error("Incorrect Email/Password");
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }: { token: JWT; user: User }) {
            if (user) {
                return {
                    ...token,
                    user: user,
                };
            }
            return token;
        },
        async session({ session, token }: { session: Session, token: JWT }) {
            if (token.user) {
                session.user = token.user;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login"
    }
};

// Create a test user
async function createTestUser() {
    try {
        // Check if the test user already exists
        const existingUser = await prisma.user.findUnique({
            where: {
                email: "test@example.com",
            },
        });

        // If test user doesn't exist, create it
        if (!existingUser) {
            // Define test user data
            const testUserData = {
                email: "test@example.com",
                password: "password123", // Make sure to hash this password before inserting into production!
                name: "Test User",
                // Add any other fields you have in your user model
            };

            // Insert the test user data into the database
            const createdUser = await prisma.user.create({
                data: testUserData,
            });

            console.log("Test user created:", createdUser);
        } else {
            console.log("Test user already exists:", existingUser);
        }
    } catch (error) {
        console.error("Error creating test user:", error);
    }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };
