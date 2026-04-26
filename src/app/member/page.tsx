import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Memberinfo from '@/components/AddMemberGet';
import styles from "../page.module.css";
import UploadResume from '@/components/ResumeUpload';
import GrokResumeAnalyzer from '@/components/ResumeAnalysisAi';

export default async function Members() {
    // Check if the user is authenticated on the server
    const session = await getServerSession(authOptions);

    // If no session exists, redirect them to the sign-in page
    if (!session) {
        //goes to signin page and then back to member page after signin
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
                    <Memberinfo email={session?.user?.email ?? ""} />
                </div>
                <div style={{ marginTop: '40px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                    {/* <h3 style={{ margin: '30px 0 15px' }}>AI Resume Analysis</h3> */}
                    <GrokResumeAnalyzer />
                    <h3 style={{ margin: '30px 0 15px' }}>Uploads PDF, and saves to database into user info.</h3>
                    <UploadResume />
                </div>
            </main>

        </div>
    );
}
