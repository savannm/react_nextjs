'use client';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function AuthButton() {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return <div style={{ fontSize: '14px', color: '#999', textAlign: 'right' }}>Checking session...</div>;
    }

    if (session) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '15px', color: '#fff' }}>
                <span style={{ fontSize: '14px' }}>
                    Logged in as <strong>{session.user?.email}</strong>
                </span>
                <button
                    onClick={() => signOut()}
                    style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #ddd',
                        color: '#000',
                        background: '#fff',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                >
                    Sign out
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => signIn('google')}
            style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                background: '#0070f3',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600
            }}
        >
            Sign in with Google
        </button>
    );
}