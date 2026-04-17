import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const userResult = await db.query(
                    'SELECT * FROM users WHERE email = $1',
                    [credentials.email]
                );

                const user = userResult.rows[0];
                if (!user) return null;

                const isValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                return isValid ? { id: user.id, email: user.email, name: user.username } : null;
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: '/auth/signin',
    },
    callbacks: {
        async signIn({ user, account }) {
            // Only trigger for Google sign-ins
            if (account?.provider === 'google' && user.email) {
                try {
                    // Check if the user already exists in the 'members' table
                    const memberCheck = await db.query(
                        'SELECT email FROM members WHERE email = $1',
                        [user.email]
                    );

                    if (memberCheck.rows.length === 0) {
                        // If they don't exist, insert them as a new member     
                        await db.query(
                            'INSERT INTO members (username, email) VALUES ($1, $2)',
                            [user.name, user.email]
                        );
                        console.log(`Successfully added Google user to members table: ${user.email}`);
                    }
                } catch (error) {
                    console.error("Failed to sync Google user to members table:", error);
                }
            }
            return true;
        },
    }
};
