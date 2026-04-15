'use client';

import { Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import styles from './signin.module.css';

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Sign in to access the member area</p>
        </div>

        <div className={styles.content}>
          <button
            onClick={() => signIn('google', { callbackUrl })}
            className={styles.googleButton}
          >
            <svg className={styles.googleIcon} viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115z"
              />
              <path
                fill="#34A853"
                d="M16.04 18.013c-1.09.593-2.325.896-3.601.896a7.076 7.076 0 0 1-6.736-4.909L1.24 17.55c1.958 3.951 6.029 6.45 10.76 6.45 2.94 0 5.613-1.01 7.68-2.734l-3.64-3.253z"
              />
              <path
                fill="#4285F4"
                d="M19.834 7.5c.231.758.354 1.565.354 2.408 0 .611-.08 1.213-.231 1.792H12v4.2h8.04c.328-1.554.551-3.218.551-4.992 0-2.356-.708-4.595-1.92-6.508l-3.64 5.1z"
              />
              <path
                fill="#FBBC05"
                d="M5.266 14.235A7.077 7.077 0 0 1 4.909 12a7.077 7.077 0 0 1 .357-2.235L1.24 6.65c-.808 1.636-1.24 3.471-1.24 5.35-0 1.879.432 3.714 1.24 5.35l4.026-3.115z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className={styles.divider}>
            <span className={styles.dividerText}>or</span>
          </div>

          <p className={styles.footerText}>
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className={styles.container}>
        <div className={styles.card}>
          <p className={styles.subtitle}>Loading sign-in...</p>
        </div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
