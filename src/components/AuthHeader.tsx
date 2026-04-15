'use client';

import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AuthButton from './Auth';

export default function AuthHeader() {
    const pathname = usePathname();
    const { data: session } = useSession();


    // Hide the entire auth section if we are on the /member or sign-in page
    if (!session) {
        if (pathname === '/member' || pathname === '/auth/signin') {
            return null;
        }
    }

    return (
        <div style={{ textAlign: 'right', padding: '10px 40px', backgroundColor: '#000' }}>
            <AuthButton />
        </div>
    );
}
