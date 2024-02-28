// app/api/auth/[...nextauth]/route.ts

import bcrypt from "bcrypt";
import NextAuth, { AuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { authOptions } from "@/components/util/auth-options";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
