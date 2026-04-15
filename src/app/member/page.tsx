import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Memberinfo from '@/components/AddMemberGet';
import styles from "../page.module.css";

export default async function Members() {
    // Check if the user is authenticated on the server
    const session = await getServerSession(authOptions);

    // If no session exists, redirect them to the sign-in page
    if (!session) {
        redirect('/api/auth/signin?callbackUrl=/member');
    }

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <div className={styles.intro}>
                    <h1>Members Area</h1>
                    <p style={{ marginBottom: '20px', color: '#666' }}>
                        Welcome back, <strong>{session.user?.email}</strong>!
                    </p>
                    
                    {/* Protected content below */}
                    <Memberinfo username="Zax Max" />
                </div>
            </main>
        </div>
    );
}
